'use client'

export default function SectionCard({ title, subtitle, children, action }) {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-in relative"
      style={{
        background: 'linear-gradient(145deg, #141c2e 0%, #0d1117 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle top mesh */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(129,140,248,0.3), transparent)' }}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 relative"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Accent bar */}
          <div
            className="w-0.5 h-8 rounded-full"
            style={{ background: 'linear-gradient(180deg, #38bdf8, #818cf8)', boxShadow: '0 0 10px rgba(56,189,248,0.4)' }}
          />
          <div>
            <h2
              className="font-semibold text-sm leading-tight"
              style={{ color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: '0.9375rem' }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(148,163,184,0.6)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 relative">
        {children}
      </div>
    </div>
  )
}