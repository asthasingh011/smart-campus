'use client'

export default function ResourceCard({ resource, typeName, onBook }) {
  const isAvailable = resource.Status === 'Available'

  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-300 group animate-slide-up overflow-hidden w-full min-w-0"
      style={{
        background: 'linear-gradient(135deg, #141c2e 0%, #0d1117 60%, #111827 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Background mesh gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: isAvailable
            ? 'radial-gradient(circle at 80% 20%, rgba(34,211,238,0.06) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 20%, rgba(251,191,36,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 relative">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)_!important]"
          style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.08))',
            border: '1px solid rgba(56,189,248,0.2)',
            boxShadow: '0 0 16px rgba(56,189,248,0.1)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={isAvailable ? {
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.25)',
            color: '#6ee7b7',
          } : {
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.25)',
            color: '#fcd34d',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isAvailable ? '#34d399' : '#fbbf24',
              boxShadow: `0 0 6px ${isAvailable ? '#34d399' : '#fbbf24'}`,
            }}
          />
          {resource.Status || 'Unknown'}
        </div>
      </div>

      {/* Name & type */}
      <h3
        className="text-sm font-semibold mb-0.5 leading-snug relative"
        style={{ color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: '0.9rem' }}
      >
        {resource.Resource_Name || resource.Name || 'Unnamed Resource'}
      </h3>
      <p className="text-[11px] mb-4 relative" style={{ color: 'rgba(148,163,184,0.6)' }}>
        {typeName || resource.Type || '—'}
      </p>

      {/* Detail rows */}
      <div className="space-y-2 mb-5 relative">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:brightness-125 group-hover:border-blue-400/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)' }}>{resource.Location || 'No location'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:brightness-125 group-hover:border-blue-400/50"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)' }}>Capacity: {resource.Capacity || '—'}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-4 relative" style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }} />

      {/* Book button */}
      {onBook && (
        <button
          onClick={() => onBook(resource)}
          disabled={!isAvailable}
          className="w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all duration-200 relative flex items-center justify-center gap-2"
          style={isAvailable ? {
            background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(99,102,241,0.08))',
            border: '1px solid rgba(56,189,248,0.25)',
            color: '#7dd3fc',
            boxShadow: '0 0 20px rgba(56,189,248,0.08)',
          } : {
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(100,116,139,0.6)',
            cursor: 'not-allowed',
          }}
          onMouseEnter={e => {
            if (isAvailable) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.14))'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(56,189,248,0.2)'
            }
          }}
          onMouseLeave={e => {
            if (isAvailable) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(99,102,241,0.08))'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(56,189,248,0.08)'
            }
          }}
        >
          {isAvailable ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Resource
            </>
          ) : 'Under Maintenance'}
        </button>
      )}
    </div>
  )
}