import React, { useState } from 'react';
import { Image as ImageIcon, Video, Code2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';

const inputClass = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

function extractYouTubeId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

function ImagePanel({ onInsert, close }) {
  const [alt, setAlt] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(path, file);
    setUploading(false);
    e.target.value = '';
    if (error) {
      toast.error('Upload failed - try again.');
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    onInsert(`\n\n![${alt || 'image'}](${data.publicUrl})\n\n`);
    close();
  };

  const insertFromUrl = () => {
    if (!url.trim()) return;
    onInsert(`\n\n![${alt || 'image'}](${url.trim()})\n\n`);
    close();
  };

  return (
    <div>
      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Alt text (optional)</label>
      <input className={`${inputClass} mb-3`} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describes the image" />

      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Upload an image or GIF</label>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm mb-3" />

      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">...or paste an image/GIF URL</label>
      <div className="flex items-center gap-2">
        <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://...png or .gif" />
        <button type="button" onClick={insertFromUrl} className="shrink-0 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700">
          Insert
        </button>
      </div>
      {uploading && <p className="text-xs text-zinc-400 mt-2">Uploading...</p>}
    </div>
  );
}

function VideoPanel({ onInsert, close }) {
  const [url, setUrl] = useState('');

  const insert = () => {
    if (!url.trim()) return;
    const id = extractYouTubeId(url);
    if (id) {
      onInsert(`\n\n<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>\n\n`);
    } else {
      // Assume it's already a direct embeddable URL (e.g. Vimeo, Loom)
      onInsert(`\n\n<iframe src="${url.trim()}" allowfullscreen></iframe>\n\n`);
    }
    close();
  };

  return (
    <div>
      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">YouTube link (or any embeddable video URL)</label>
      <div className="flex items-center gap-2">
        <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
        <button type="button" onClick={insert} className="shrink-0 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700">
          Insert
        </button>
      </div>
      <p className="text-xs text-zinc-400 mt-2">Paste a normal YouTube link - it's converted to an embed automatically.</p>
    </div>
  );
}

function CodePanel({ onInsert, close }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const insert = () => {
    onInsert(`\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`);
    close();
  };

  return (
    <div>
      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Language (optional)</label>
      <input className={`${inputClass} mb-3`} value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. javascript, vba, sql" />
      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Code</label>
      <textarea className={`${inputClass} font-mono mb-3`} rows={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here" />
      <button type="button" onClick={insert} className="bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700">
        Insert Code Block
      </button>
    </div>
  );
}

export default function MediaInserter({ onInsert }) {
  const [panel, setPanel] = useState(null);

  const tabs = [
    { key: 'image', label: 'Image / GIF', icon: ImageIcon },
    { key: 'video', label: 'Video', icon: Video },
    { key: 'code', label: 'Code', icon: Code2 },
  ];

  if (!panel) {
    return (
      <div className="flex items-center gap-3 mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setPanel(t.key)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <t.icon size={14} /> Insert {t.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="border border-brand-100 dark:border-zinc-700 rounded-xl p-4 mb-3 bg-brand-50/40 dark:bg-zinc-800/40">
      <div className="flex items-center justify-between mb-3">
        <span className="font-rubik text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">
          {tabs.find((t) => t.key === panel)?.label}
        </span>
        <button type="button" onClick={() => setPanel(null)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-700">
          Cancel
        </button>
      </div>
      {panel === 'image' && <ImagePanel onInsert={onInsert} close={() => setPanel(null)} />}
      {panel === 'video' && <VideoPanel onInsert={onInsert} close={() => setPanel(null)} />}
      {panel === 'code' && <CodePanel onInsert={onInsert} close={() => setPanel(null)} />}
    </div>
  );
}
