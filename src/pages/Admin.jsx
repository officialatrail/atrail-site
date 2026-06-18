import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { iconNames } from '../lib/iconRegistry';
import ChartInserter from '../components/ChartInserter';
import {
  getArticles, saveArticles,
  getTools, saveTools,
  getPrompts, savePrompts,
  getPillars, savePillars,
  getVideos, saveVideos,
  getAbout, saveAbout,
  getComingSoon, saveComingSoon,
  fetchWaitlist,
  fetchExclusiveRequests, fetchApprovedEmails, approveEmail, revokeEmail,
  getStats, saveStats,
  slugify,
} from '../lib/contentStore';

const TABS = ['Articles', 'Tools', 'Prompts', 'Pillars', 'Videos', 'About', 'Stats', 'Coming Soon', 'Waitlist', 'Exclusive Access'];

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";
const cardClass = "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6";
const saveBtnClass = "inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700";
const addBtnClass = "mb-6 inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700";

async function persist(saveFn, data, successMsg) {
  try {
    await saveFn(data);
    toast.success(successMsg);
  } catch {
    toast.error('Could not save - check your connection and try again.');
  }
}

function ArticlesAdmin() {
  const [items, setItems] = useState(getArticles());

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const save = () => persist(saveArticles, items, 'Articles saved');

  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    persist(saveArticles, next, 'Article removed');
  };

  const addNew = () => {
    const title = 'New Article Title';
    const next = [
      {
        slug: slugify(title) + '-' + Date.now(),
        title,
        category: 'General',
        date: new Date().toISOString().slice(0, 10),
        readTime: '5 min read',
        excerpt: 'Short summary of the article.',
        body: 'First paragraph. You can use Markdown here: ## headings, **bold**, tables, and ```chart fenced blocks.',
      },
      ...items,
    ];
    setItems(next);
    persist(saveArticles, next, 'Article added');
  };

  return (
    <div>
      <button onClick={addNew} className={addBtnClass}>
        <Plus size={14} /> Add Article
      </button>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.slug} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <Field label="Title">
                <input className={inputClass} value={item.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </Field>
              <button onClick={() => remove(i)} className="mt-6 text-zinc-400 hover:text-red-500" aria-label="Delete article">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <input className={inputClass} value={item.category} onChange={(e) => update(i, 'category', e.target.value)} />
              </Field>
              <Field label="Read Time">
                <input className={inputClass} value={item.readTime} onChange={(e) => update(i, 'readTime', e.target.value)} />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea className={inputClass} rows={2} value={item.excerpt} onChange={(e) => update(i, 'excerpt', e.target.value)} />
            </Field>
            <Field label="Body (Markdown: ## headings, **bold**, | tables |)">
              <ChartInserter onInsert={(block) => update(i, 'body', item.body + block)} />
              <textarea
                className={`${inputClass} font-mono`}
                rows={10}
                value={item.body}
                onChange={(e) => update(i, 'body', e.target.value)}
              />
            </Field>
            <button onClick={save} className={saveBtnClass}>
              <Save size={14} /> Save All
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const linkTypes = ['article', 'link', 'github', 'video'];

function ToolsAdmin() {
  const [items, setItems] = useState(getTools());
  const articles = getArticles();

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const updateLink = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], link: { ...next[index].link, [field]: value } };
    setItems(next);
  };

  const save = () => persist(saveTools, items, 'Tools saved');

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={item.name} className={cardClass}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <input className={inputClass} value={item.name} onChange={(e) => update(i, 'name', e.target.value)} />
            </Field>
            <Field label="Category">
              <input className={inputClass} value={item.category} onChange={(e) => update(i, 'category', e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={inputClass} rows={2} value={item.description} onChange={(e) => update(i, 'description', e.target.value)} />
          </Field>
          <Field label="Image URL">
            <input className={inputClass} value={item.image} onChange={(e) => update(i, 'image', e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Link Type">
              <select className={inputClass} value={item.link?.type} onChange={(e) => updateLink(i, 'type', e.target.value)}>
                {linkTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label={item.link?.type === 'article' ? 'Article' : item.link?.type === 'video' ? 'YouTube Video ID' : 'URL'}>
              {item.link?.type === 'article' ? (
                <select className={inputClass} value={item.link?.value} onChange={(e) => updateLink(i, 'value', e.target.value)}>
                  {articles.map((a) => <option key={a.slug} value={a.slug}>{a.title}</option>)}
                </select>
              ) : (
                <input className={inputClass} value={item.link?.value} onChange={(e) => updateLink(i, 'value', e.target.value)} />
              )}
            </Field>
          </div>
          <button onClick={save} className={saveBtnClass}>
            <Save size={14} /> Save All
          </button>
        </div>
      ))}
    </div>
  );
}

function PromptsAdmin() {
  const [items, setItems] = useState(getPrompts());

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const save = () => persist(savePrompts, items, 'Prompts saved');

  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    persist(savePrompts, next, 'Prompt removed');
  };

  const addNew = () => {
    const next = [
      { title: 'New Prompt', category: 'General', description: 'Short description.', prompt: 'Prompt text here.', locked: false },
      ...items,
    ];
    setItems(next);
    persist(savePrompts, next, 'Prompt added');
  };

  return (
    <div>
      <button onClick={addNew} className={addBtnClass}>
        <Plus size={14} /> Add Prompt
      </button>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.title + i} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <Field label="Title">
                  <input className={inputClass} value={item.title} onChange={(e) => update(i, 'title', e.target.value)} />
                </Field>
                <Field label="Category">
                  <input className={inputClass} value={item.category} onChange={(e) => update(i, 'category', e.target.value)} />
                </Field>
              </div>
              <button onClick={() => remove(i)} className="mt-6 text-zinc-400 hover:text-red-500" aria-label="Delete prompt">
                <Trash2 size={16} />
              </button>
            </div>
            <Field label="Description">
              <textarea className={inputClass} rows={2} value={item.description} onChange={(e) => update(i, 'description', e.target.value)} />
            </Field>
            <Field label="Prompt Text">
              <textarea className={`${inputClass} font-mono`} rows={6} value={item.prompt} onChange={(e) => update(i, 'prompt', e.target.value)} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 mb-3">
              <input type="checkbox" checked={!!item.locked} onChange={(e) => update(i, 'locked', e.target.checked)} />
              Exclusive (locked / blurred for members)
            </label>
            <button onClick={save} className={saveBtnClass}>
              <Save size={14} /> Save All
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarsAdmin() {
  const [items, setItems] = useState(getPillars());

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const save = () => persist(savePillars, items, 'Pillars saved');

  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    persist(savePillars, next, 'Pillar removed');
  };

  const addNew = () => {
    const next = [...items, { icon: iconNames[0], image: '', title: 'New Pillar', description: 'Short description.' }];
    setItems(next);
    persist(savePillars, next, 'Pillar added');
  };

  return (
    <div>
      <button onClick={addNew} className={addBtnClass}>
        <Plus size={14} /> Add Pillar
      </button>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.title + i} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <Field label="Title">
                <input className={inputClass} value={item.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </Field>
              <button onClick={() => remove(i)} className="mt-6 text-zinc-400 hover:text-red-500" aria-label="Delete pillar">
                <Trash2 size={16} />
              </button>
            </div>
            <Field label="Description">
              <textarea className={inputClass} rows={2} value={item.description} onChange={(e) => update(i, 'description', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (used if no image)">
                <select className={inputClass} value={item.icon} onChange={(e) => update(i, 'icon', e.target.value)}>
                  {iconNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Image URL (overrides icon)">
                <input className={inputClass} value={item.image} onChange={(e) => update(i, 'image', e.target.value)} />
              </Field>
            </div>
            <button onClick={save} className={saveBtnClass}>
              <Save size={14} /> Save All
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideosAdmin() {
  const [items, setItems] = useState(getVideos());

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const save = () => persist(saveVideos, items, 'Videos saved');

  const remove = (index) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    persist(saveVideos, next, 'Video removed');
  };

  const addNew = () => {
    const next = [...items, { videoId: '', title: 'New Video', description: 'Short description.' }];
    setItems(next);
    persist(saveVideos, next, 'Video added');
  };

  return (
    <div>
      <button onClick={addNew} className={addBtnClass}>
        <Plus size={14} /> Add Video
      </button>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <Field label="Title">
                <input className={inputClass} value={item.title} onChange={(e) => update(i, 'title', e.target.value)} />
              </Field>
              <button onClick={() => remove(i)} className="mt-6 text-zinc-400 hover:text-red-500" aria-label="Delete video">
                <Trash2 size={16} />
              </button>
            </div>
            <Field label="YouTube Video ID (the part after v= in the URL)">
              <input className={inputClass} value={item.videoId} onChange={(e) => update(i, 'videoId', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className={inputClass} rows={2} value={item.description} onChange={(e) => update(i, 'description', e.target.value)} />
            </Field>
            <button onClick={save} className={saveBtnClass}>
              <Save size={14} /> Save All
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutAdmin() {
  const [about, setAbout] = useState(getAbout());

  const updateBio = (index, value) => {
    const next = [...about.bioParagraphs];
    next[index] = value;
    setAbout({ ...about, bioParagraphs: next });
  };

  const updateFocus = (index, value) => {
    const next = [...about.focusAreas];
    next[index] = value;
    setAbout({ ...about, focusAreas: next });
  };

  const save = () => persist(saveAbout, about, 'About page saved');

  return (
    <div className={cardClass}>
      <Field label="Bio Paragraphs">
        {about.bioParagraphs.map((p, i) => (
          <textarea key={i} className={`${inputClass} mb-2`} rows={3} value={p} onChange={(e) => updateBio(i, e.target.value)} />
        ))}
      </Field>
      <Field label="Focus Areas">
        {about.focusAreas.map((f, i) => (
          <input key={i} className={`${inputClass} mb-2`} value={f} onChange={(e) => updateFocus(i, e.target.value)} />
        ))}
      </Field>
      <button onClick={save} className={saveBtnClass}>
        <Save size={14} /> Save
      </button>
    </div>
  );
}

function StatsAdmin() {
  const [items, setItems] = useState(getStats());

  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: field === 'value' ? Number(value) || 0 : value };
    setItems(next);
  };

  const save = () => persist(saveStats, items, 'Stats saved');

  return (
    <div className={cardClass}>
      <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Shown on the homepage as count-up numbers, before the Tools section.
      </p>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 items-end">
            <Field label="Label">
              <input className={inputClass} value={item.label} onChange={(e) => update(i, 'label', e.target.value)} />
            </Field>
            <Field label="Value">
              <input className={inputClass} type="number" value={item.value} onChange={(e) => update(i, 'value', e.target.value)} />
            </Field>
            <Field label="Suffix">
              <input className={inputClass} value={item.suffix} onChange={(e) => update(i, 'suffix', e.target.value)} placeholder="e.g. +" />
            </Field>
          </div>
        ))}
      </div>
      <button onClick={save} className={saveBtnClass}>
        <Save size={14} /> Save
      </button>
    </div>
  );
}

function ComingSoonAdmin() {
  const [data, setData] = useState(getComingSoon());

  const update = (field, value) => setData({ ...data, [field]: value });

  const updateFeature = (index, value) => {
    const next = [...data.features];
    next[index] = value;
    setData({ ...data, features: next });
  };

  const save = () => persist(saveComingSoon, data, 'Coming Soon section saved');

  return (
    <div className={cardClass}>
      <Field label="Badge">
        <input className={inputClass} value={data.badge} onChange={(e) => update('badge', e.target.value)} />
      </Field>
      <Field label="Title">
        <input className={inputClass} value={data.title} onChange={(e) => update('title', e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea className={inputClass} rows={3} value={data.description} onChange={(e) => update('description', e.target.value)} />
      </Field>
      <Field label="Feature bullets">
        {data.features.map((f, i) => (
          <input key={i} className={`${inputClass} mb-2`} value={f} onChange={(e) => updateFeature(i, e.target.value)} />
        ))}
      </Field>
      <button onClick={save} className={saveBtnClass}>
        <Save size={14} /> Save
      </button>
    </div>
  );
}

function WaitlistAdmin() {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    fetchWaitlist().then(setEntries).catch(() => setEntries([]));
  }, []);

  if (entries === null) {
    return <p className="font-rubik text-zinc-400 dark:text-zinc-500 text-sm">Loading...</p>;
  }

  return (
    <div className={cardClass}>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {entries.length} {entries.length === 1 ? 'person' : 'people'} interested.
      </p>
      {entries.length === 0 ? (
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">No signups yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
          {entries.map((e, i) => (
            <li key={i} className="py-2.5 flex items-center justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">{e.email}</span>
              <span className="text-zinc-400 dark:text-zinc-500">{new Date(e.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ExclusiveAdmin() {
  const [requests, setRequests] = useState(null);
  const [approved, setApproved] = useState([]);

  const reload = () => {
    fetchExclusiveRequests().then(setRequests).catch(() => setRequests([]));
    fetchApprovedEmails().then(setApproved).catch(() => setApproved([]));
  };

  useEffect(() => { reload(); }, []);

  const approve = async (email) => {
    try {
      await approveEmail(email);
      toast.success(`${email} can now view exclusive prompts`);
      reload();
    } catch {
      toast.error('Could not approve - try again.');
    }
  };

  const revoke = async (email) => {
    try {
      await revokeEmail(email);
      reload();
    } catch {
      toast.error('Could not revoke - try again.');
    }
  };

  if (requests === null) {
    return <p className="font-rubik text-zinc-400 dark:text-zinc-500 text-sm">Loading...</p>;
  }

  return (
    <div className={cardClass}>
      <p className="font-rubik text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        People who requested access to exclusive prompts. Approve an email to unlock exclusive content for them.
      </p>
      {requests.length === 0 ? (
        <p className="font-rubik text-zinc-400 dark:text-zinc-500 text-sm">No requests yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
          {requests.map((r, i) => {
            const isApproved = approved.includes(r.email);
            return (
              <li key={i} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <span className="font-rubik text-zinc-700 dark:text-zinc-300">{r.email}</span>
                  <span className="font-rubik text-zinc-400 dark:text-zinc-500 ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {isApproved ? (
                  <button onClick={() => revoke(r.email)} className="font-rubik text-xs font-semibold text-red-500 hover:text-red-600">
                    Revoke
                  </button>
                ) : (
                  <button onClick={() => approve(r.email)} className="font-rubik text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Approve
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('Articles');
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Admin</h1>
            <button onClick={logout} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-red-500">
              <LogOut size={14} /> Log out
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  tab === t
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {tab === 'Articles' && <ArticlesAdmin />}
            {tab === 'Tools' && <ToolsAdmin />}
            {tab === 'Prompts' && <PromptsAdmin />}
            {tab === 'Pillars' && <PillarsAdmin />}
            {tab === 'Videos' && <VideosAdmin />}
            {tab === 'About' && <AboutAdmin />}
            {tab === 'Stats' && <StatsAdmin />}
            {tab === 'Coming Soon' && <ComingSoonAdmin />}
            {tab === 'Waitlist' && <WaitlistAdmin />}
            {tab === 'Exclusive Access' && <ExclusiveAdmin />}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
