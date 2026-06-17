import { articles as defaultArticles } from '../data/articles';
import { tools as defaultTools, categoryColors } from '../data/tools';
import { prompts as defaultPrompts } from '../data/prompts';
import { videos as defaultVideos } from '../data/videos';
import { pillars as defaultPillars } from '../data/pillars';

export { categoryColors };

const defaultAbout = {
  bioParagraphs: [
    "Atrail exists because most finance and accounting automation content online is either too generic to use, or too tool-specific to adapt. Every article, tool, and prompt here is built around a real task: reconciling a bank statement, building a prepayment schedule, putting together a financial model under deadline.",
    "The goal is not to chase AI hype. It's to find the workflows that genuinely save hours of manual work, document them clearly, and ship the tools that make them reusable.",
  ],
  focusAreas: [
    'n8n workflow automation for finance teams',
    'Financial modelling with Claude and Excel',
    'Bank reconciliation and bookkeeping automation',
    'Practical AI prompt engineering for finance work',
  ],
};

const defaultComingSoon = {
  badge: 'Coming Soon',
  title: 'Atrail AI Add-in for Excel',
  description: "A full AI agent living inside the Excel ribbon. Ask questions about your data, build automations, run financial models, and connect to Claude or ChatGPT without leaving Excel.",
  features: [
    'AI financial model generation inside Excel',
    'Reconciliation automation with one click',
    'Connect to Claude, ChatGPT, and Gemini',
    'No browser switching, stays in your ribbon',
  ],
};

const defaultStats = [
  { label: 'Community Across Platforms', value: 600, suffix: '+' },
  { label: 'Videos Published', value: 30, suffix: '+' },
  { label: 'Tool Downloads', value: 30, suffix: '+' },
];

const KEYS = {
  articles: 'atrail_articles_v1',
  tools: 'atrail_tools_v1',
  prompts: 'atrail_prompts_v1',
  videos: 'atrail_videos_v1',
  about: 'atrail_about_v1',
  pillars: 'atrail_pillars_v1',
  comingSoon: 'atrail_coming_soon_v1',
  waitlist: 'atrail_waitlist_v1',
  likes: 'atrail_likes_v1',
  likedByMe: 'atrail_liked_by_me_v1',
  bannerDismissed: 'atrail_banner_dismissed_v1',
  exclusiveRequests: 'atrail_exclusive_requests_v1',
  approvedEmails: 'atrail_approved_emails_v1',
  myEmail: 'atrail_my_email_v1',
  stats: 'atrail_stats_v1',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to fallback */
  }
  return fallback;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const getArticles = () => load(KEYS.articles, defaultArticles);
export const saveArticles = (data) => save(KEYS.articles, data);

export const getTools = () => load(KEYS.tools, defaultTools);
export const saveTools = (data) => save(KEYS.tools, data);

export const getPrompts = () => load(KEYS.prompts, defaultPrompts);
export const savePrompts = (data) => save(KEYS.prompts, data);

export const getVideos = () => load(KEYS.videos, defaultVideos);
export const saveVideos = (data) => save(KEYS.videos, data);

export const getAbout = () => load(KEYS.about, defaultAbout);
export const saveAbout = (data) => save(KEYS.about, data);

export const getPillars = () => load(KEYS.pillars, defaultPillars);
export const savePillars = (data) => save(KEYS.pillars, data);

export const getComingSoon = () => load(KEYS.comingSoon, defaultComingSoon);
export const saveComingSoon = (data) => save(KEYS.comingSoon, data);

export const getWaitlist = () => load(KEYS.waitlist, []);
export const joinWaitlist = (email) => {
  const list = getWaitlist();
  list.push({ email, date: new Date().toISOString() });
  save(KEYS.waitlist, list);
};

export const isLikedByMe = (itemKey) => {
  const liked = load(KEYS.likedByMe, []);
  return liked.includes(itemKey);
};

export const getLikeCount = (itemKey) => {
  const likes = load(KEYS.likes, {});
  return likes[itemKey] || 0;
};

export const toggleLike = (itemKey) => {
  const likes = load(KEYS.likes, {});
  const liked = load(KEYS.likedByMe, []);
  const alreadyLiked = liked.includes(itemKey);
  const current = likes[itemKey] || 0;

  if (alreadyLiked) {
    likes[itemKey] = Math.max(0, current - 1);
    save(KEYS.likes, likes);
    save(KEYS.likedByMe, liked.filter((k) => k !== itemKey));
    return { liked: false, count: likes[itemKey] };
  }

  likes[itemKey] = current + 1;
  save(KEYS.likes, likes);
  save(KEYS.likedByMe, [...liked, itemKey]);
  return { liked: true, count: likes[itemKey] };
};

export const isBannerDismissed = () => load(KEYS.bannerDismissed, false);
export const dismissBanner = () => save(KEYS.bannerDismissed, true);

export const getMyEmail = () => load(KEYS.myEmail, '');
export const setMyEmail = (email) => save(KEYS.myEmail, email);

export const getExclusiveRequests = () => load(KEYS.exclusiveRequests, []);
export const requestExclusiveAccess = (email) => {
  setMyEmail(email);
  const list = getExclusiveRequests();
  if (!list.some((r) => r.email === email)) {
    list.push({ email, date: new Date().toISOString() });
    save(KEYS.exclusiveRequests, list);
  }
};

export const getApprovedEmails = () => load(KEYS.approvedEmails, []);
export const approveEmail = (email) => {
  const list = getApprovedEmails();
  if (!list.includes(email)) {
    save(KEYS.approvedEmails, [...list, email]);
  }
};
export const revokeEmail = (email) => {
  save(KEYS.approvedEmails, getApprovedEmails().filter((e) => e !== email));
};

export const isMyEmailApproved = () => {
  const mine = getMyEmail();
  return mine && getApprovedEmails().includes(mine);
};

export const getStats = () => load(KEYS.stats, defaultStats);
export const saveStats = (data) => save(KEYS.stats, data);

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
