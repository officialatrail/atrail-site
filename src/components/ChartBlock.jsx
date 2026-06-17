import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#067C40', '#22d97a', '#5bd093', '#92e4b8', '#0a9650', '#055430'];

export default function ChartBlock({ spec }) {
  let parsed;
  try {
    parsed = JSON.parse(spec);
  } catch {
    return (
      <pre className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl">
        Invalid chart JSON.
      </pre>
    );
  }

  const { type = 'bar', data = [], xKey = 'name', yKey = 'value', title } = parsed;

  return (
    <div className="my-8 bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-100 dark:border-zinc-800">
      {title && <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height={280}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
            <XAxis dataKey={xKey} stroke="currentColor" className="text-zinc-500" fontSize={12} />
            <YAxis stroke="currentColor" className="text-zinc-500" fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#067C40" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={100} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
            <XAxis dataKey={xKey} stroke="currentColor" className="text-zinc-500" fontSize={12} />
            <YAxis stroke="currentColor" className="text-zinc-500" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#067C40" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
