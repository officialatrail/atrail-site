import { FileSpreadsheet, Code2 } from 'lucide-react';

// Platform logos shown on tool cards and used for the platform filter on /tools.
// `slug` resolves to a Simple Icons logo; `icon` is a lucide-react fallback
// for platforms Simple Icons doesn't host (e.g. Microsoft Office products).
export const platforms = {
  'Google Sheets': { slug: 'googlesheets' },
  'Excel': { icon: FileSpreadsheet },
  'VBA': { icon: Code2 },
  'n8n': { slug: 'n8n' },
  'Zapier': { slug: 'zapier' },
};

export const platformNames = Object.keys(platforms);
