import React from 'react';
import { Search, ArrowDownUp } from 'lucide-react';

export default function SearchSortBar({ search, onSearchChange, placeholder, sortBy, onSortChange, sortOptions }) {
  return (
    <div className="flex items-center gap-2 max-w-xl mx-auto mb-12">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      <div className="relative shrink-0">
        <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="pl-8 pr-3 py-3 rounded-full border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
