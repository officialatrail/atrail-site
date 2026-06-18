// Platform logos shown on tool cards and used for the platform filter on /tools.
// Real brand logos only — local files for ones without a public CDN, simpleicons CDN otherwise.
export const platforms = {
  'Google Sheets': { logo: `${import.meta.env.BASE_URL}images/gsheets-logo.svg` },
  'Excel': { logo: `${import.meta.env.BASE_URL}images/excel-logo-new.svg` },
  'n8n': { logo: 'https://cdn.simpleicons.org/n8n' },
  'Zapier': { logo: 'https://cdn.simpleicons.org/zapier' },
};

export const platformNames = Object.keys(platforms);
