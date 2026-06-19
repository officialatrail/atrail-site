import { articles as defaultArticles } from '../data/articles';
import { tools as defaultTools, categoryColors } from '../data/tools';
import { prompts as defaultPrompts } from '../data/prompts';
import { videos as defaultVideos } from '../data/videos';
import { pillars as defaultPillars } from '../data/pillars';
import { supabase } from './supabaseClient';

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
  { label: 'Views', value: 400, suffix: 'K+' },
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
  bannerDismissed: 'atrail_banner_dismissed_v1',
  likedByMe: 'atrail_liked_by_me_v1',
  myEmail: 'atrail_my_email_v1',
  stats: 'atrail_stats_v1',
};

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to fallback */
  }
  return fallback;
}

function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// In-memory cache, hydrated from Supabase once at app boot (see hydrateContentStore
// in index.jsx, called before the first render). get* functions read from here so
// every page/component can keep calling them synchronously, same as before.
const cache = {
  articles: loadLocal(KEYS.articles, defaultArticles),
  tools: loadLocal(KEYS.tools, defaultTools),
  prompts: loadLocal(KEYS.prompts, defaultPrompts),
  videos: loadLocal(KEYS.videos, defaultVideos),
  about: loadLocal(KEYS.about, defaultAbout),
  pillars: loadLocal(KEYS.pillars, defaultPillars),
  comingSoon: loadLocal(KEYS.comingSoon, defaultComingSoon),
  stats: loadLocal(KEYS.stats, defaultStats),
  likes: {},
};

export async function hydrateContentStore() {
  try {
    const { data, error } = await supabase.from('site_content').select('key, value');
    if (!error && data) {
      for (const row of data) {
        if (row.key in cache) cache[row.key] = row.value;
      }
    }
  } catch {
    /* offline or unreachable - keep local/default cache */
  }

  try {
    const { data, error } = await supabase.from('likes').select('item_key, count');
    if (!error && data) {
      cache.likes = Object.fromEntries(data.map((r) => [r.item_key, r.count]));
    }
  } catch {
    /* keep empty likes cache */
  }
}

function makeContentPair(cacheKey, storageKey) {
  return [
    () => cache[cacheKey],
    async (value) => {
      cache[cacheKey] = value;
      saveLocal(storageKey, value);
      const { error } = await supabase.from('site_content').upsert({ key: cacheKey, value });
      if (error) throw error;
    },
  ];
}

export const [getArticles, saveArticles] = makeContentPair('articles', KEYS.articles);
export const [getTools, saveTools] = makeContentPair('tools', KEYS.tools);
export const [getPrompts, savePrompts] = makeContentPair('prompts', KEYS.prompts);
export const [getVideos, saveVideos] = makeContentPair('videos', KEYS.videos);
export const [getAbout, saveAbout] = makeContentPair('about', KEYS.about);
export const [getPillars, savePillars] = makeContentPair('pillars', KEYS.pillars);
export const [getComingSoon, saveComingSoon] = makeContentPair('comingSoon', KEYS.comingSoon);
export const [getStats, saveStats] = makeContentPair('stats', KEYS.stats);

// Waitlist / exclusive access: writes are public (anyone can submit their email),
// reads are admin-only and fetched live from Supabase inside the Admin page.
export async function joinWaitlist(email) {
  const { error } = await supabase.from('waitlist').insert({ email });
  if (error) throw error;
}

export async function fetchWaitlist() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('email, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function requestExclusiveAccess(email) {
  setMyEmail(email);
  const { error } = await supabase
    .from('exclusive_requests')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
}

export async function fetchExclusiveRequests() {
  const { data, error } = await supabase
    .from('exclusive_requests')
    .select('email, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchApprovedEmails() {
  const { data, error } = await supabase.from('approved_emails').select('email');
  if (error) throw error;
  return data.map((r) => r.email);
}

export async function approveEmail(email) {
  const { error } = await supabase.from('approved_emails').insert({ email });
  if (error) throw error;
}

export async function revokeEmail(email) {
  const { error } = await supabase.from('approved_emails').delete().eq('email', email);
  if (error) throw error;
}

export async function isMyEmailApproved() {
  const mine = getMyEmail();
  if (!mine) return false;
  const { data, error } = await supabase.rpc('check_email_approved', { check_email: mine });
  if (error) return false;
  return !!data;
}

export const isLikedByMe = (itemKey) => {
  const liked = loadLocal(KEYS.likedByMe, []);
  return liked.includes(itemKey);
};

export const getLikeCount = (itemKey) => cache.likes[itemKey] || 0;

export async function toggleLike(itemKey) {
  const liked = loadLocal(KEYS.likedByMe, []);
  const alreadyLiked = liked.includes(itemKey);
  const delta = alreadyLiked ? -1 : 1;

  const { data, error } = await supabase.rpc('adjust_like', { p_item_key: itemKey, p_delta: delta });
  if (error) throw error;

  cache.likes[itemKey] = data;
  saveLocal(KEYS.likedByMe, alreadyLiked ? liked.filter((k) => k !== itemKey) : [...liked, itemKey]);
  return { liked: !alreadyLiked, count: data };
}

export const isBannerDismissed = () => loadLocal(KEYS.bannerDismissed, false);
export const dismissBanner = () => saveLocal(KEYS.bannerDismissed, true);

export const getMyEmail = () => loadLocal(KEYS.myEmail, '');
export const setMyEmail = (email) => saveLocal(KEYS.myEmail, email);

export function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
