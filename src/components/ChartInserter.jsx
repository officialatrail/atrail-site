import React, { useState } from 'react';
import { Plus, Trash2, BarChart3 } from 'lucide-react';

const inputClass = "w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function ChartInserter({ onInsert }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('bar');
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState([{ label: '', value: '' }, { label: '', value: '' }]);

  const updateRow = (i, field, value) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: value };
    setRows(next);
  };

  const addRow = () => setRows([...rows, { label: '', value: '' }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const handleInsert = () => {
    const data = rows
      .filter((r) => r.label.trim() !== '')
      .map((r) => ({ name: r.label, value: Number(r.value) || 0 }));

    const spec = { type, xKey: 'name', yKey: 'value', data };
    if (title.trim()) spec.title = title.trim();

    const block = '\n\n```chart\n' + JSON.stringify(spec, null, 2) + '\n```\n';
    onInsert(block);

    setOpen(false);
    setTitle('');
    setRows([{ label: '', value: '' }, { label: '', value: '' }]);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-3"
      >
        <BarChart3 size={14} /> Insert Chart
      </button>
    );
  }

  return (
    <div className="border border-brand-100 dark:border-zinc-700 rounded-xl p-4 mb-3 bg-brand-50/40 dark:bg-zinc-800/40">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Chart Type</label>
          <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <div>
          <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Title (optional)</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Monthly match rate" />
        </div>
      </div>

      <label className="block font-rubik text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Data</label>
      <div className="space-y-2 mb-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputClass}
              placeholder="Label (e.g. Jan)"
              value={row.label}
              onChange={(e) => updateRow(i, 'label', e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Value (e.g. 91)"
              type="number"
              value={row.value}
              onChange={(e) => updateRow(i, 'value', e.target.value)}
            />
            <button type="button" onClick={() => removeRow(i)} className="text-zinc-400 hover:text-red-500 shrink-0" aria-label="Remove row">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <Plus size={14} /> Add Row
        </button>
        <button type="button" onClick={handleInsert} className="inline-flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-700">
          Insert Chart Into Article
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-700">
          Cancel
        </button>
      </div>
    </div>
  );
}
