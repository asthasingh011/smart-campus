'use client'

const navItems = {
  dashboard: [
    { id: 'resources', label: 'Resources', icon: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10', accent: 'cyan' },
    { id: 'book', label: 'Book Resource', icon: 'M12 4v16m8-8H4', accent: 'blue' },
    { id: 'mybookings', label: 'My Bookings', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', accent: 'indigo' },
    { id: 'calendar', label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', accent: 'pink' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9', accent: 'violet' },
    { id: 'analytics', label: 'Analytics', icon: 'M3 3v18h18M7 14l4-4 4 4 6-6', accent: 'amber' },
  ],
  admin: [
    { id: 'bookings', label: 'All Bookings', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', accent: 'blue' },
    { id: 'calendar', label: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', accent: 'pink' },
    { id: 'maintenance', label: 'Maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572C2.561 12.85 2.561 10.352 4.317 9.926a1.724 1.724 0 0 0 1.066-2.573C4.443 5.81 6.209 4.043 7.753 4.983a1.724 1.724 0 0 0 2.572-1.066z', accent: 'amber' },
    { id: 'notify', label: 'Send Notification', icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z', accent: 'cyan' },
    { id: 'logs', label: 'Usage Logs', icon: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z', accent: 'green' },
    { id: 'slots', label: 'Schedule Slots', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', accent: 'violet' },
    { id: 'analytics', label: 'Usage Analytics', icon: 'M3 3v18h18M7 14l4-4 4 4 6-6', accent: 'amber' },
  ],
}

const accentMap = {
  cyan:   { icon: '#22d3ee', glow: 'rgba(34,211,238,0.15)',  activeBg: 'rgba(34,211,238,0.08)',  activeBorder: 'rgba(34,211,238,0.35)',  activeText: '#67e8f9' },
  blue:   { icon: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  activeBg: 'rgba(96,165,250,0.08)',  activeBorder: 'rgba(96,165,250,0.35)',  activeText: '#93c5fd' },
  indigo: { icon: '#818cf8', glow: 'rgba(129,140,248,0.15)', activeBg: 'rgba(129,140,248,0.08)', activeBorder: 'rgba(129,140,248,0.35)', activeText: '#a5b4fc' },
  violet: { icon: '#a78bfa', glow: 'rgba(167,139,250,0.15)', activeBg: 'rgba(167,139,250,0.08)', activeBorder: 'rgba(167,139,250,0.35)', activeText: '#c4b5fd' },
  amber:  { icon: '#fbbf24', glow: 'rgba(251,191,36,0.15)',  activeBg: 'rgba(251,191,36,0.08)',  activeBorder: 'rgba(251,191,36,0.35)',  activeText: '#fcd34d' },
  green:  { icon: '#34d399', glow: 'rgba(52,211,153,0.15)',  activeBg: 'rgba(52,211,153,0.08)',  activeBorder: 'rgba(52,211,153,0.35)',  activeText: '#6ee7b7' },
  pink:   { icon: '#f472b6', glow: 'rgba(244,114,182,0.15)', activeBg: 'rgba(244,114,182,0.08)', activeBorder: 'rgba(244,114,182,0.35)', activeText: '#fbcfe8' },
}

export default function Sidebar({ type = 'dashboard', active, onSelect }) {
  const items = navItems[type] || []

  return (
    <aside
      className="w-[260px] flex-shrink-0 h-full flex flex-col py-6 gap-2 relative z-10 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #0b0f19 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
      />

      {/* Section label */}
      <div className="px-5 mb-3 mt-1 relative">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: type === 'admin' ? '#a78bfa' : '#22d3ee', boxShadow: `0 0 6px ${type === 'admin' ? '#a78bfa' : '#22d3ee'}` }}
          />
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'rgba(148,163,184,0.7)', fontFamily: "'Syne', sans-serif" }}
          >
            {type === 'admin' ? 'Admin Panel' : 'Navigation'}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 relative">
        {items.map((item) => {
          const isActive = active === item.id
          const a = accentMap[item.accent] || accentMap.blue

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group"
              style={{
                background: isActive ? a.activeBg : 'transparent',
                border: isActive ? `1px solid ${a.activeBorder}` : '1px solid transparent',
                color: isActive ? a.activeText : 'rgba(148,163,184,0.75)',
                boxShadow: isActive ? `0 0 20px ${a.glow}` : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = '#e2e8f0'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(148,163,184,0.75)'
                }
              }}
            >
              {/* Icon container */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125 group-hover:border-blue-400/50"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${a.activeBg}, rgba(0,0,0,0.2))`
                    : 'rgba(255,255,255,0.04)',
                  border: isActive ? `1px solid ${a.activeBorder}` : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <svg
                  width="14" height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isActive ? a.icon : 'rgba(148,163,184,0.6)'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
              </div>

              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>

              {/* Active indicator pip */}
              {isActive && (
                <div
                  className="absolute right-3 w-1 h-1 rounded-full"
                  style={{ background: a.icon, boxShadow: `0 0 8px ${a.icon}` }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom decorative line */}
      <div className="mt-auto mx-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 group cursor-pointer" title="System Dashboard">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.5)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.05em' }}>
              SMARTCAMPUS
            </div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(100,116,139,0.5)' }}>v2.0 · Resource System</div>
          </div>
        </div>
      </div>
    </aside>
  )
}