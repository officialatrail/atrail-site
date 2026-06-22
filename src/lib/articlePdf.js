import { jsPDF } from 'jspdf';

const BRAND_GREEN = [10, 150, 80];
const INK = [24, 24, 27];
const GRAY = [113, 113, 122];
const LIGHT_GRAY = [228, 228, 231];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 22;
const CONTENT_W = PAGE_W - MARGIN * 2;
const HEADER_Y = 18;
const CONTENT_TOP = 32;
const CONTENT_BOTTOM = PAGE_H - 24;

// Splits **bold** markers out of a line into { text, bold } runs.
function tokenizeBold(line) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return parts.map((text, i) => ({ text, bold: i % 2 === 1 })).filter((r) => r.text.length > 0);
}

// Parses simple article markdown into a flat block list: heading / paragraph / list-item.
function parseBlocks(markdown) {
  const raw = Array.isArray(markdown) ? markdown.join('\n\n') : markdown || '';
  const lines = raw.split('\n');
  const blocks = [];
  let buffer = [];

  const flush = () => {
    if (buffer.length) {
      blocks.push({ type: 'p', text: buffer.join(' ').trim() });
      buffer = [];
    }
  };

  let inCodeFence = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^```/.test(line)) { inCodeFence = !inCodeFence; flush(); continue; }
    if (inCodeFence) continue; // skip entire fenced blocks (code + chart specs) in the carousel
    if (/^\|.*\|$/.test(line)) continue; // skip markdown table rows - not worth rendering in a carousel
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
  return blocks.filter((b) => b.text);
}

// Groups blocks into sections, one per H2 (intro content before the first H2 is its own section).
function groupSections(blocks) {
  const sections = [];
  let current = { heading: null, blocks: [] };
  for (const block of blocks) {
    if (block.type === 'h2') {
      if (current.heading || current.blocks.length) sections.push(current);
      current = { heading: block.text, blocks: [] };
    } else {
      current.blocks.push(block);
    }
  }
  if (current.heading || current.blocks.length) sections.push(current);
  return sections;
}

function drawHeader(doc, pageLabel) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND_GREEN);
  doc.text('Atrail', MARGIN, HEADER_Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(pageLabel, PAGE_W - MARGIN, HEADER_Y, { align: 'right' });

  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, HEADER_Y + 5, PAGE_W - MARGIN, HEADER_Y + 5);
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

// Draws a paragraph (array of bold/plain runs) at (x, y), wrapping within maxWidth.
// Returns the new y position after the paragraph.
function drawParagraph(doc, text, x, y, maxWidth, { fontSize = 11, lineHeight = 5.6, color = INK } = {}) {
  const runs = tokenizeBold(text);
  const lines = wrapRuns(doc, runs, maxWidth, fontSize);
  doc.setTextColor(...color);
  lines.forEach((line) => {
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

function newSlide(doc, label) {
  doc.addPage();
  drawHeader(doc, label);
  return CONTENT_TOP;
}

export function generateArticlePdf(article) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const siteLabel = 'officialatrail.online';

  // --- Title slide ---
  drawHeader(doc, siteLabel);
  let y = 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...INK);
  const titleLines = doc.splitTextToSize(article.title, CONTENT_W);
  titleLines.forEach((line) => { doc.text(line, MARGIN, y); y += 11; });

  y += 6;
  if (article.excerpt) {
    y = drawParagraph(doc, article.excerpt, MARGIN, y, CONTENT_W, { fontSize: 13, lineHeight: 6.5, color: GRAY });
  }

  y += 10;
  doc.setDrawColor(...LIGHT_GRAY);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text('By: Atrail', MARGIN, y);

  // --- Section slides ---
  const sections = groupSections(parseBlocks(article.body));
  sections.forEach((section) => {
    y = newSlide(doc, siteLabel);

    if (section.heading) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(...INK);
      const lines = doc.splitTextToSize(section.heading, CONTENT_W);
      lines.forEach((line) => {
        if (y > CONTENT_BOTTOM) y = newSlide(doc, siteLabel);
        doc.text(line, MARGIN, y);
        y += 8;
      });
      y += 4;
    }

    section.blocks.forEach((block) => {
      if (y > CONTENT_BOTTOM) y = newSlide(doc, siteLabel);
      if (block.type === 'li') {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...BRAND_GREEN);
        doc.text('-', MARGIN, y);
        y = drawParagraph(doc, block.text, MARGIN + 5, y, CONTENT_W - 5, { fontSize: 11, lineHeight: 5.6 });
        y += 2;
      } else {
        y = drawParagraph(doc, block.text, MARGIN, y, CONTENT_W, { fontSize: 11, lineHeight: 5.8 });
        y += 5;
      }
    });
  });

  // --- Closing CTA slide ---
  y = newSlide(doc, siteLabel);
  y = 90;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text('Read the full article', MARGIN, y);
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_GREEN);
  doc.text(`officialatrail.online/articles/${article.slug}`, MARGIN, y);

  y += 18;
  doc.setDrawColor(...LIGHT_GRAY);
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
  y = drawParagraph(
    doc,
    'Join the Atrail community for articles, tools, and AI prompts for finance and accounting workflow automation.',
    MARGIN, y, CONTENT_W, { fontSize: 11, lineHeight: 6 }
  );

  doc.save(`${article.slug}-linkedin-carousel.pdf`);
}
