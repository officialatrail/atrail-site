import { jsPDF } from 'jspdf';

const BRAND_GREEN = [10, 150, 80];
const INK = [24, 24, 27];
const GRAY = [113, 113, 122];
const LINE_GRAY = [195, 195, 200];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 22;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LOGO_SIZE = 9;
const HEADER_TOP = 13;
const DIVIDER_Y = HEADER_TOP + LOGO_SIZE + 5;
const CONTENT_TOP = DIVIDER_Y + 12;
const CONTENT_BOTTOM = PAGE_H - 20;

const LINKEDIN_URL = 'https://www.linkedin.com/company/atrail/';

async function loadImageAsDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('image fetch failed: ' + url);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getImageSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Splits **bold** markers out of a line into { text, bold } runs.
function tokenizeBold(line) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((text, i) => ({ text, bold: i % 2 === 1 })).filter((r) => r.text.length > 0);
}

// Parses article markdown into a flat block list: heading / paragraph / list-item / chart / image.
function parseBlocks(markdown) {
  const raw = Array.isArray(markdown) ? markdown.join('\n\n') : markdown || '';
  const lines = raw.split('\n');
  const blocks = [];
  let buffer = [];
  let fence = null; // null | 'code' | 'chart'
  let fenceLines = [];

  const flush = () => {
    if (buffer.length) {
      blocks.push({ type: 'p', text: buffer.join(' ').trim() });
      buffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (/^```/.test(line)) {
      if (fence) {
        if (fence === 'chart') {
          try {
            blocks.push({ type: 'chart', spec: JSON.parse(fenceLines.join('\n')) });
          } catch {
            /* malformed chart spec - skip silently */
          }
        }
        fence = null;
        fenceLines = [];
      } else {
        flush();
        fence = line.replace(/^```/, '').trim() === 'chart' ? 'chart' : 'code';
      }
      continue;
    }
    if (fence) {
      if (fence === 'chart') fenceLines.push(rawLine);
      continue; // plain code fences are skipped entirely in the carousel
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\((\S+)\)$/);
    if (imageMatch) { flush(); blocks.push({ type: 'image', alt: imageMatch[1], url: imageMatch[2] }); continue; }

    if (/^\|.*\|$/.test(line)) continue; // markdown table rows - not worth rendering in a carousel
    if (!line) { flush(); continue; }
    if (/^#{1,2}\s+/.test(line)) { flush(); blocks.push({ type: 'h2', text: line.replace(/^#{1,2}\s+/, '') }); continue; }
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      flush();
      blocks.push({ type: 'li', text: line.replace(/^([-*]|\d+\.)\s+/, '').replace(/`/g, '') });
      continue;
    }
    buffer.push(line.replace(/`/g, ''));
  }
  flush();
  return blocks.filter((b) => b.text || b.type === 'chart' || b.type === 'image');
}

function drawHeader(doc, logoDataUrl) {
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', MARGIN, HEADER_TOP, LOGO_SIZE, LOGO_SIZE);
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text('Atrail', PAGE_W - MARGIN, HEADER_TOP + LOGO_SIZE / 2 + 1.5, { align: 'right' });

  doc.setDrawColor(...LINE_GRAY);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, DIVIDER_Y, PAGE_W - MARGIN, DIVIDER_Y);
}

function newPage(doc, logoDataUrl) {
  doc.addPage();
  drawHeader(doc, logoDataUrl);
  return CONTENT_TOP;
}

function wrapRuns(doc, runs, maxWidth, fontSize) {
  doc.setFontSize(fontSize);
  const words = [];
  runs.forEach((run) => {
    run.text.split(/(\s+)/).forEach((piece) => {
      if (piece.length) words.push({ text: piece, bold: run.bold });
    });
  });

  const lines = [];
  let current = [];
  let currentWidth = 0;
  words.forEach((word) => {
    doc.setFont('helvetica', word.bold ? 'bold' : 'normal');
    const w = doc.getTextWidth(word.text);
    if (currentWidth + w > maxWidth && current.length) {
      lines.push(current);
      current = [];
      currentWidth = 0;
    }
    if (!(word.text.trim() === '' && current.length === 0)) {
      current.push(word);
      currentWidth += w;
    }
  });
  if (current.length) lines.push(current);
  return lines;
}

// Draws a paragraph (with inline **bold** support), paginating mid-paragraph if needed.
// Returns the new y position.
function drawParagraph(doc, text, x, y, maxWidth, opts, logoDataUrl) {
  const { fontSize = 11, lineHeight = 5.8, color = INK } = opts || {};
  const runs = tokenizeBold(text);
  const lines = wrapRuns(doc, runs, maxWidth, fontSize);
  doc.setTextColor(...color);
  lines.forEach((line) => {
    if (y > CONTENT_BOTTOM) y = newPage(doc, logoDataUrl);
    let cx = x;
    line.forEach((word) => {
      doc.setFont('helvetica', word.bold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.text(word.text, cx, y);
      cx += doc.getTextWidth(word.text);
    });
    y += lineHeight;
  });
  return y;
}

const CHART_HEIGHT = 46;

function estimateChartHeight(spec) {
  return CHART_HEIGHT + (spec?.title ? 8 : 0) + 14;
}

function drawChart(doc, spec, x, y, width) {
  const data = Array.isArray(spec.data) ? spec.data : [];
  if (!data.length) return y;

  if (spec.title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(spec.title, x, y);
    y += 8;
  }

  const chartTop = y;
  const chartBottom = y + CHART_HEIGHT;
  const values = data.map((d) => Number(d[spec.yKey]) || 0);
  const maxVal = Math.max(...values, 1);

  if (spec.type === 'line') {
    doc.setDrawColor(...LINE_GRAY);
    doc.setLineWidth(0.3);
    doc.line(x, chartBottom, x + width, chartBottom);

    const stepX = data.length > 1 ? width / (data.length - 1) : 0;
    doc.setDrawColor(...BRAND_GREEN);
    doc.setLineWidth(0.7);
    let prev = null;
    data.forEach((d, i) => {
      const px = x + stepX * i;
      const py = chartBottom - (Number(d[spec.yKey]) / maxVal) * (CHART_HEIGHT - 6);
      if (prev) doc.line(prev.x, prev.y, px, py);
      doc.setFillColor(...BRAND_GREEN);
      doc.circle(px, py, 1.3, 'F');
      prev = { x: px, y: py };
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(String(d[spec.xKey]), px, chartBottom + 6, { align: 'center' });
    });
  } else {
    const gap = 4;
    const barWidth = (width - gap * (data.length - 1)) / data.length;
    data.forEach((d, i) => {
      const val = Number(d[spec.yKey]) || 0;
      const barH = Math.max((val / maxVal) * (CHART_HEIGHT - 8), 0.5);
      const bx = x + i * (barWidth + gap);
      const by = chartBottom - barH;
      doc.setFillColor(...BRAND_GREEN);
      doc.rect(bx, by, barWidth, barH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...INK);
      doc.text(String(val), bx + barWidth / 2, by - 2, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(String(d[spec.xKey]), bx + barWidth / 2, chartBottom + 6, { align: 'center' });
    });
    doc.setDrawColor(...LINE_GRAY);
    doc.setLineWidth(0.3);
    doc.line(x, chartBottom, x + width, chartBottom);
  }

  return chartBottom + 14;
}

async function preloadImages(blocks) {
  for (const block of blocks) {
    if (block.type !== 'image') continue;
    try {
      const dataUrl = await loadImageAsDataUrl(block.url);
      const size = await getImageSize(dataUrl);
      block.dataUrl = dataUrl;
      block.width = size.width;
      block.height = size.height;
    } catch (e) {
      console.warn('Skipping image in PDF (failed to load):', block.url, e);
      block.failed = true;
    }
  }
}

export async function generateArticlePdf(article) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let logoDataUrl = null;
  try {
    logoDataUrl = await loadImageAsDataUrl(`${import.meta.env.BASE_URL}images/logo-green.png`);
  } catch {
    /* render without the logo if it fails to load */
  }

  const blocks = parseBlocks(article.body);
  await preloadImages(blocks);

  // --- Title slide ---
  drawHeader(doc, logoDataUrl);
  let y = 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...INK);
  const titleLines = doc.splitTextToSize(article.title, CONTENT_W);
  titleLines.forEach((line) => { doc.text(line, MARGIN, y); y += 11; });

  y += 6;
  if (article.excerpt) {
    y = drawParagraph(doc, article.excerpt, MARGIN, y, CONTENT_W, { fontSize: 13, lineHeight: 6.5, color: GRAY }, logoDataUrl);
  }

  y += 10;
  doc.setDrawColor(...LINE_GRAY);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_GREEN);
  doc.textWithLink('By: Atrail', MARGIN, y, { url: LINKEDIN_URL });

  // --- Continuous content flow (packs tightly, only breaks pages when needed) ---
  y = newPage(doc, logoDataUrl);

  blocks.forEach((block) => {
    if (block.type === 'h2') {
      if (y > CONTENT_TOP) y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(block.text, CONTENT_W);
      const needed = lines.length * 7.5 + 6;
      if (y + needed > CONTENT_BOTTOM && y > CONTENT_TOP) y = newPage(doc, logoDataUrl);
      lines.forEach((line) => { doc.text(line, MARGIN, y); y += 7.5; });
      y += 3;
      return;
    }

    if (block.type === 'chart') {
      const needed = estimateChartHeight(block.spec);
      if (y + needed > CONTENT_BOTTOM && y > CONTENT_TOP) y = newPage(doc, logoDataUrl);
      y = drawChart(doc, block.spec, MARGIN, y, CONTENT_W);
      return;
    }

    if (block.type === 'image') {
      if (block.failed || !block.dataUrl) return;
      const w = CONTENT_W;
      const h = w * (block.height / block.width);
      if (y + h + 8 > CONTENT_BOTTOM && y > CONTENT_TOP) y = newPage(doc, logoDataUrl);
      doc.addImage(block.dataUrl, MARGIN, y, w, h);
      y += h + 8;
      return;
    }

    if (block.type === 'li') {
      if (y > CONTENT_BOTTOM) y = newPage(doc, logoDataUrl);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...BRAND_GREEN);
      doc.text('-', MARGIN, y);
      y = drawParagraph(doc, block.text, MARGIN + 5, y, CONTENT_W - 5, { fontSize: 11, lineHeight: 5.8 }, logoDataUrl);
      y += 2;
      return;
    }

    y = drawParagraph(doc, block.text, MARGIN, y, CONTENT_W, { fontSize: 11, lineHeight: 5.8 }, logoDataUrl);
    y += 5;
  });

  // --- Closing CTA slide ---
  y = newPage(doc, logoDataUrl);
  y = 90;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text('Read the full article', MARGIN, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN);
  doc.textWithLink(`officialatrail.online/articles/${article.slug}`, MARGIN, y, {
    url: `https://officialatrail.online/articles/${article.slug}`,
  });

  y += 18;
  doc.setDrawColor(...LINE_GRAY);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text('Want more like this?', MARGIN, y);
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  drawParagraph(
    doc,
    'Join the Atrail community for articles, tools, and AI prompts for finance and accounting workflow automation.',
    MARGIN, y, CONTENT_W, { fontSize: 11, lineHeight: 6 }, logoDataUrl
  );

  doc.save(`${article.slug}-linkedin-carousel.pdf`);
}
