import { articles as defaultArticles } from '../data/articles';
import { tools as defaultTools, categoryColors } from '../data/tools';
import { prompts as defaultPrompts } from '../data/prompts';
import { videos as defaultVideos } from '../data/videos';
import { pillars as defaultPillars } from '../data/pillars';
import { supabase } from './supabaseClient';

export { categoryColors };

const defaultAbout = {
  bioParagraphs: [
    "Atrail is built around real tasks: reconciling a bank statement, building a prepayment schedule, putting together a financial model under deadline. Every article, tool, and prompt here comes from doing the actual work.",
    "The focus is on workflows that genuinely save hours of manual work, documented clearly, with the tools that make them reusable shipped right alongside.",
  ],
  focusAreas: [
    'n8n workflow automation for finance teams',
    'Financial modelling with Claude and Excel',
    'Bank reconciliation and bookkeeping automation',
    'Practical AI prompt engineering for finance work',
  ],
};

const defaultAddIn = {
  gifUrl: '',
  releaseDate: '2026-07-10T12:00:00',
  downloadUrl: 'https://github.com/officialatrail/Atrail-Excel-Addin/raw/main/Atrail%20Excel%20Addin.xll',
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
  addIn: 'atrail_addin_v1',
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
  addIn: loadLocal(KEYS.addIn, defaultAddIn),
  stats: loadLocal(KEYS.stats, defaultStats),
  likes: {},
  reads: {},
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

  try {
    const { data, error } = await supabase.from('reads').select('item_key, count');
    if (!error && data) {
      cache.reads = Object.fromEntries(data.map((r) => [r.item_key, r.count]));
    }
  } catch {
    /* keep empty reads cache */
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
export const [getAddIn, saveAddIn] = makeContentPair('addIn', KEYS.addIn);
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
  sendNotification({ type: 'exclusive_access_request', userEmail: email, productName: 'Atrail Exclusive Prompts' });
}

export async function fetchExclusiveRequests() {
  const { data, error } = await supabase
    .from('exclusive_requests')
    .select('email, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// Triggers the `send-update` Supabase Edge Function, which holds the Resend
// API key server-side and emails the waitlist + exclusive-access list. Admin-
// only: the function itself re-checks the caller's session server-side.
export async function sendUpdateEmail({ type, title, excerpt, image, url } = {}) {
  const { data, error } = await supabase.functions.invoke('send-update', {
    body: { type, title, excerpt, image, url },
  });
  if (error) throw error;
  return data;
}

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, created_at, subscribed')
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

// Add-in early access
export async function requestAddinEarlyAccess(email) {
  const { error } = await supabase
    .from('addin_early_access')
    .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) throw error;
  sendNotification({ type: 'early_access_request', userEmail: email, productName: 'Atrail AI for Excel Add-in' });
}

export async function getMyEarlyAccessStatus() {
  const { data, error } = await supabase
    .from('addin_early_access')
    .select('status')
    .maybeSingle();
  if (error) return null;
  return data?.status ?? null;
}

export async function fetchEarlyAccessRequests() {
  const { data, error } = await supabase.rpc('fetch_early_access_requests');
  if (error) throw error;
  return data ?? [];
}

export async function setEarlyAccessStatus(id, status) {
  const { error } = await supabase.rpc('set_early_access_status', { p_id: id, p_status: status });
  if (error) throw error;
}

export async function sendNotification({ type, userEmail, productName, userName = null }) {
  try {
    await supabase.functions.invoke('send-notification', {
      body: { type, userEmail: userEmail ?? 'anonymous', productName, userName },
    });
  } catch {}
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

export const getReadCount = (itemKey) => cache.reads[itemKey] || 0;

const READ_SESSION_KEY = 'atrail_read_session_v1';

export async function recordRead(itemKey) {
  let seen = [];
  try {
    seen = JSON.parse(sessionStorage.getItem(READ_SESSION_KEY) || '[]');
  } catch {
    /* ignore malformed sessionStorage value */
  }

  if (seen.includes(itemKey)) {
    return getReadCount(itemKey);
  }

  const { data, error } = await supabase.rpc('adjust_read_count', { p_item_key: itemKey });
  if (error) throw error;
  cache.reads[itemKey] = data;

  sessionStorage.setItem(READ_SESSION_KEY, JSON.stringify([...seen, itemKey]));
  return data;
}

const ANON_VOTER_KEY = 'atrail_anon_voter_id';
const COMMENT_VOTES_KEY = 'atrail_comment_votes_v1';

function getAnonVoterId() {
  let id = localStorage.getItem(ANON_VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ANON_VOTER_KEY, id);
  }
  return id;
}

async function getMyUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

export async function getMyAlias() {
  const userId = await getMyUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('profiles').select('alias').eq('id', userId).single();
  if (error) return null;
  return data?.alias || null;
}

export async function setMyAlias(alias) {
  const userId = await getMyUserId();
  if (!userId) throw new Error('Sign in to set an alias.');
  const { error } = await supabase.from('profiles').update({ alias }).eq('id', userId);
  if (error) {
    if (error.code === '23505') throw new Error('That alias is already taken - try another.');
    throw error;
  }
  return alias;
}

export async function getMyProfile() {
  const userId = await getMyUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('profiles').select('alias, subscribed').eq('id', userId).single();
  if (error) return null;
  return data;
}

export async function setMySubscribed(subscribed) {
  const userId = await getMyUserId();
  if (!userId) throw new Error('Sign in required.');
  const { error } = await supabase.from('profiles').update({ subscribed }).eq('id', userId);
  if (error) throw error;
  return subscribed;
}

export async function fetchComments(articleSlug) {
  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, user_id, alias_at_post, body, upvotes, downvotes, created_at')
    .eq('article_slug', articleSlug)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const userIds = [...new Set(comments.map((c) => c.user_id))];
  let aliasMap = {};
  if (userIds.length) {
    const { data: aliases } = await supabase.from('profile_aliases').select('id, alias').in('id', userIds);
    aliasMap = Object.fromEntries((aliases || []).map((a) => [a.id, a.alias]));
  }

  return comments.map((c) => ({ ...c, currentAlias: aliasMap[c.user_id] || c.alias_at_post }));
}

export async function postComment(articleSlug, body) {
  const userId = await getMyUserId();
  if (!userId) throw new Error('Sign in to comment.');
  const alias = await getMyAlias();
  if (!alias) throw new Error('Choose an alias first.');

  const { data, error } = await supabase
    .from('comments')
    .insert({ article_slug: articleSlug, user_id: userId, alias_at_post: alias, body })
    .select('id, user_id, alias_at_post, body, upvotes, downvotes, created_at')
    .single();
  if (error) throw error;
  return { ...data, currentAlias: alias };
}

export async function deleteComment(commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) throw error;
}

export function getMyCommentVote(commentId) {
  const votes = loadLocal(COMMENT_VOTES_KEY, {});
  return votes[commentId] || 0;
}

export async function voteOnComment(commentId, vote) {
  const userId = await getMyUserId();
  const voterKey = userId ? `user:${userId}` : `anon:${getAnonVoterId()}`;

  const votes = loadLocal(COMMENT_VOTES_KEY, {});
  const current = votes[commentId] || 0;

  const { data, error } = await supabase.rpc('adjust_comment_vote', {
    p_comment_id: commentId,
    p_voter_key: voterKey,
    p_vote: vote,
  });
  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  const myVote = current === vote ? 0 : vote;
  if (myVote === 0) delete votes[commentId];
  else votes[commentId] = myVote;
  saveLocal(COMMENT_VOTES_KEY, votes);

  return { upvotes: row.upvotes, downvotes: row.downvotes, myVote };
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
