'use client'

export default function Table({ columns, data, loading, emptyMessage = 'No data found.' }) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-full rounded-lg bg-[#020617] border border-white/10 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span className="text-sm">{emptyMessage}</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-xl shadow-blue-500/5">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b border-white/5 hover:bg-white/5 transition-all"
            >
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 text-gray-300">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}