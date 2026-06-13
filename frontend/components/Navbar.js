'use client'
import { useRouter } from 'next/navigation'

export default function Navbar({ user }) {
  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('campus_user')
    router.push('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const getRoleDisplay = (role) => {
    if (!role) return 'STUDENT'
    const lower = role.toLowerCase()
    if (lower === 'admin') return 'ADMIN'
    if (lower === 'staff') return 'CAMPUS STAFF'
    return 'STUDENT'
  }

  return (
    <header
      className="h-16 w-full flex items-center justify-between px-6 shrink-0 relative z-20"
      style={{
        background: '#0d1117',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 group cursor-pointer" title="SmartCampus Dashboard">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 0 12px rgba(99,102,241,0.4)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
          SmartCampus
        </span>
      </div>

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end pr-2 border-r border-gray-700/50">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>{user.Name}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{getRoleDisplay(user.Role)}</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.6)' }}>{user.Email}</span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 hover:brightness-125 cursor-pointer shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}
          >
            {getInitials(user.Name)}
          </div>
          <span className={`badge text-xs ${user.Role?.toLowerCase() === 'admin' ? 'badge-approved' : 'badge-pending'}`}>
            {getRoleDisplay(user.Role)}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(148,163,184,0.7)',
              background: 'rgba(255,255,255,0.03)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  )
}