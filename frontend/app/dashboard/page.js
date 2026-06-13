'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import ResourceCard from '../../components/ResourceCard'
import BookingForm from '../../components/BookingForm'
import Table from '../../components/Table'
import NotificationList from '../../components/NotificationList'
import SectionCard from '../../components/SectionCard'
import CalendarView from '../../components/CalendarView'
import {
  getResources,
  getResourceTypes,
  getMyBookings,
  getNotifications,
  getAnalytics,
  deleteBooking,
} from '../../services/api'

// ── Stat card sub-component ───────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient, glow, iconColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-6 overflow-hidden flex flex-col justify-between group transition-all duration-300 ease-out hover:-translate-y-1 hover:brightness-105 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: gradient,
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.35), 0 0 40px ${glow}`,
      }}
    >
      {/* Mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 85% 15%, ${glow} 0%, transparent 55%)` }}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-[11px] font-medium tracking-widest uppercase mb-2" style={{ color: 'rgba(148,163,184,0.65)', fontFamily: "'Syne', sans-serif" }}>
            {label}
          </p>
          <p className="text-3xl font-bold" style={{ color: '#f1f5f9', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125 group-hover:border-white/30"
          style={{
            background: `rgba(255,255,255,0.06)`,
            border: `1px solid rgba(255,255,255,0.1)`,
            boxShadow: `0 0 16px ${glow}`,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('resources')
  const [bookingFilter, setBookingFilter] = useState('all')

  // Resource Filters
  const [resSearchQuery, setResSearchQuery] = useState('')
  const [resStatusFilter, setResStatusFilter] = useState('all')
  const [resCapacityFilter, setResCapacityFilter] = useState('all')
  const [resLocationFilter, setResLocationFilter] = useState('all')

  // Data states
  const [resources, setResources] = useState([])
  const [resourceTypes, setResourceTypes] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loadingRes, setLoadingRes] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [actionLoading, setActionLoading] = useState({})
  
  const [prefillResource, setPrefillResource] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem('campus_user')
    if (!stored) { router.replace('/login'); return }
    try {
      const u = JSON.parse(stored)
      if (u.Role === 'Admin') { router.replace('/admin'); return }
      setUser(u)
    } catch { router.replace('/login') }
  }, [router])

  // Fetch resources
  useEffect(() => {
    if (!user) return
    setLoadingRes(true)
    Promise.all([getResources(), getResourceTypes()]).then(([res, types]) => {
      setResources(res)
      setResourceTypes(types)
      setLoadingRes(false)
    })
  }, [user])

  // Fetch my bookings
  const fetchMyBookings = useCallback(async () => {
    if (!user) return
    setLoadingBookings(true)
    const data = await getMyBookings(user.User_ID)
    setMyBookings(data)
    setLoadingBookings(false)
  }, [user])

  useEffect(() => { fetchMyBookings() }, [fetchMyBookings])

  // Fetch notifications
  useEffect(() => {
    if (!user) return
    setLoadingNotifs(true)
    getNotifications(user.User_ID).then(data => {
      setNotifications(data)
      setLoadingNotifs(false)
    })
  }, [user])

  // Fetch Analytics
  useEffect(() => {
    if (activeSection === 'analytics' && user && !analytics) {
      setLoadingAnalytics(true)
      getAnalytics(user.User_ID, user.Role).then(data => {
        setAnalytics(data)
        setLoadingAnalytics(false)
      })
    }
  }, [activeSection, user, analytics])

  function getTypeName(resource) {
    const type = resourceTypes.find(
      t => t.Resource_Type_ID === resource.Resource_Type_ID || t.Type_ID === resource.Type_ID
    )
    return type?.Type_Name || type?.Name || resource.Type || '—'
  }

  function handleBookResource(resource) {
    setPrefillResource(resource)
    setActiveSection('book')
  }

  async function handleDelete(bookingId) {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    setActionLoading(prev => ({ ...prev, [`delete_${bookingId}`]: true }))
    try {
      await deleteBooking(bookingId)
      fetchMyBookings()
    } catch (err) {
      console.error("Delete failed", err)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${bookingId}`]: false }))
    }
  }

  // Stats
  const stats = [
    { label: 'Available Resources', value: resources.filter(r => r.Status === 'Available').length, color: 'text-green-400' },
    { label: 'My Bookings', value: myBookings.length, color: 'text-blue-400' },
    { label: 'Pending Approvals', value: myBookings.filter(b => b.Status === 'Pending').length, color: 'text-yellow-400' },
    { label: 'Notifications', value: notifications.filter(n => n.Status === 'Unread').length, color: 'text-indigo-400' },
  ]

  const formatTime = (timeStr) => {
    if (!timeStr) return '—'
    const [h, m] = timeStr.split(':')
    let hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12 || 12
    return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`
  }

  const bookingColumns = [
    { key: 'resource', label: 'RESOURCE', render: (v) => v || '—' },
    { 
      key: 'date', label: 'DATE', 
      render: (v) => v ? new Date(v).toLocaleDateString('en-GB') : '—' 
    },
    { 
      key: 'start', label: 'START', 
      render: (v) => formatTime(v) 
    },
    { 
      key: 'end', label: 'END', 
      render: (v) => formatTime(v) 
    },
    {
      key: 'status', label: 'STATUS',
      render: (v) => (
        <span className={`badge badge-${(v || 'pending').toLowerCase()}`}>{v || 'Pending'}</span>
      )
    },
    { key: 'purpose', label: 'PURPOSE', render: v => <span className="text-campus-muted text-xs">{v || '—'}</span> },
    {
      key: 'actions', label: 'ACTIONS',
      render: (_, row) => (
        <button
          onClick={() => handleDelete(row.id)}
          disabled={actionLoading[`delete_${row.id}`]}
          className="px-2 py-1 rounded-md bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          title="Delete Booking"
        >
          {actionLoading[`delete_${row.id}`] ? (
            <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          ) : '🗑️'} Delete
        </button>
      )
    },
  ]

  // Filter Logic over fetched resources
  const uniqueLocations = Array.from(new Set(resources.map(r => r.Location).filter(Boolean)))

  const filteredResources = resources.filter(r => {
    const name = r.Resource_Name || r.Name || ''
    if (resSearchQuery && !name.toLowerCase().includes(resSearchQuery.toLowerCase())) return false
    
    if (resStatusFilter !== 'all' && r.Status !== resStatusFilter) return false
    
    if (resLocationFilter !== 'all' && r.Location !== resLocationFilter) return false
    
    if (resCapacityFilter !== 'all') {
      const cap = parseInt(r.Capacity, 10)
      if (isNaN(cap)) return false
      if (resCapacityFilter === 'small' && cap > 20) return false
      if (resCapacityFilter === 'medium' && (cap <= 20 || cap > 50)) return false
      if (resCapacityFilter === 'large' && cap <= 50) return false
    }
    return true
  })

  // Common UI styles for filters
  const filterInputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.75rem',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '0.8125rem',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s ease-out'
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0f19' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(56,189,248,0.2)' }}
        >
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.75rem', fontFamily: "'Syne', sans-serif", letterSpacing: '0.1em' }}>
          LOADING
        </p>
      </div>
    </div>
  )

  // Stat card configs
  const statCards = [
    {
      label: 'Available',
      value: resources.filter(r => r.Status === 'Available').length,
      icon: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10',
      gradient: 'linear-gradient(145deg, #0d2e1f 0%, #0d1117 100%)',
      glow: 'rgba(52,211,153,0.08)',
      iconColor: '#34d399',
      onClick: () => setActiveSection('resources')
    },
    {
      label: 'My Bookings',
      value: myBookings.length,
      icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
      gradient: 'linear-gradient(145deg, #0d1e3a 0%, #0d1117 100%)',
      glow: 'rgba(56,189,248,0.08)',
      iconColor: '#38bdf8',
      onClick: () => { setActiveSection('mybookings'); setBookingFilter('all') }
    },
    {
      label: 'Pending',
      value: myBookings.filter(b => b.Status === 'Pending').length,
      icon: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
      gradient: 'linear-gradient(145deg, #2d1f0d 0%, #0d1117 100%)',
      glow: 'rgba(251,191,36,0.08)',
      iconColor: '#fbbf24',
      onClick: () => { setActiveSection('mybookings'); setBookingFilter('pending') }
    },
    {
      label: 'Unread Alerts',
      value: notifications.filter(n => n.Status === 'Unread').length,
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
      gradient: 'linear-gradient(145deg, #1a0d2e 0%, #0d1117 100%)',
      glow: 'rgba(167,139,250,0.08)',
      iconColor: '#a78bfa',
      onClick: () => setActiveSection('notifications')
    },
  ]

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0b0f19' }}>
      <Navbar user={user} />
      <div className="flex flex-1 min-h-0">
        <Sidebar type="dashboard" active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 overflow-y-auto w-full" style={{ background: 'linear-gradient(180deg, #0b0f19 0%, #080c14 100%)' }}>
          <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">

            {/* ── Welcome banner ── */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0f1e3a 0%, #111827 50%, #0f172a 100%)',
                border: '1px solid rgba(56,189,248,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(56,189,248,0.05)',
              }}
            >
              {/* Background glow orbs */}
              <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 60%)' }} />
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5), rgba(129,140,248,0.4), transparent)' }} />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                    <span style={{ fontSize: '0.7rem', color: 'rgba(52,211,153,0.8)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.12em', fontWeight: 600 }}>
                      ONLINE
                    </span>
                  </div>
                  <h1
                    className="text-2xl font-bold mb-1"
                    style={{ color: '#f1f5f9', fontFamily: "'Syne', sans-serif", textShadow: '0 0 40px rgba(56,189,248,0.2)' }}
                  >
                    Hello, {user.Name?.split(' ')[0]} 👋
                  </h1>
                  <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.8125rem' }}>
                    {user.Role} · {user.Email}
                  </p>
                </div>

                {/* Inline mini-stats (md+) */}
                <div className="flex items-center flex-wrap gap-2 md:gap-3">
                  {stats.map((s, i) => (
                    <div
                      key={s.label}
                      className="text-center px-4 py-2 md:px-5 md:py-3 rounded-xl flex-1 md:flex-none min-w-[100px]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div className={`text-xl md:text-2xl font-bold ${s.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.55)', marginTop: '2px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Stat cards row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map(s => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

          {/* ─── Resources ─── */}
          {activeSection === 'resources' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold" style={{ color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: '1.1rem' }}>
                    Campus Resources
                  </h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#7dd3fc' }}
                  >
                    {filteredResources.length} matched
                  </span>
                </div>
              </div>

              {/* ── Filter Bar ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  value={resSearchQuery} 
                  onChange={(e) => setResSearchQuery(e.target.value)} 
                  style={filterInputStyle}
                  className="focus:border-blue-500/50 focus:bg-blue-500/5 placeholder-gray-600"
                />
                
                <select 
                  value={resStatusFilter} 
                  onChange={(e) => setResStatusFilter(e.target.value)} 
                  style={filterInputStyle}
                  className="focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0b0f19] text-gray-300">All Statuses</option>
                  <option value="Available" className="bg-[#0b0f19] text-green-400">Available</option>
                  <option value="Maintenance" className="bg-[#0b0f19] text-amber-400">Maintenance</option>
                </select>

                <select 
                  value={resLocationFilter} 
                  onChange={(e) => setResLocationFilter(e.target.value)} 
                  style={filterInputStyle}
                  className="focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0b0f19] text-gray-300">All Locations</option>
                  {uniqueLocations.map(loc => (
                    <option key={loc} value={loc} className="bg-[#0b0f19] text-gray-300">{loc}</option>
                  ))}
                </select>

                <select 
                  value={resCapacityFilter} 
                  onChange={(e) => setResCapacityFilter(e.target.value)} 
                  style={filterInputStyle}
                  className="focus:border-blue-500/50 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0b0f19] text-gray-300">Any Capacity</option>
                  <option value="small" className="bg-[#0b0f19] text-gray-300">Small (1-20)</option>
                  <option value="medium" className="bg-[#0b0f19] text-gray-300">Medium (21-50)</option>
                  <option value="large" className="bg-[#0b0f19] text-gray-300">Large (50+)</option>
                </select>
              </div>

              {loadingRes ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-0">
                  {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
                </div>
              ) : filteredResources.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-20 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
                >
                  <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '0.875rem' }}>No resources match your filters.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-w-0">
                  {filteredResources.map((r, i) => (
                    <ResourceCard
                      key={r.Resource_ID || r.ID || i}
                      resource={r}
                      typeName={getTypeName(r)}
                      onBook={handleBookResource}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Book Resource ─── */}
          {activeSection === 'book' && (
            <div className="max-w-xl animate-fade-in">
              <SectionCard
                title="Book a Resource"
                subtitle="Fill in the details to submit your booking request"
              >
                <BookingForm
                  resources={resources.filter(r => r.Status === 'Available')}
                  userId={user.User_ID}
                  prefillResource={prefillResource}
                  onSuccess={() => { fetchMyBookings(); setActiveSection('mybookings') }}
                />
              </SectionCard>
            </div>
          )}

          {/* ─── My Bookings ─── */}
          {activeSection === 'mybookings' && (
            <div className="animate-fade-in">
              <SectionCard
                title={bookingFilter === 'pending' ? "Pending Approvals" : "My Bookings"}
                subtitle={bookingFilter === 'pending' ? "Bookings awaiting administrator approval" : "Your past and upcoming booking requests"}
                action={
                  <div className="flex items-center gap-3">
                    {bookingFilter === 'pending' && (
                      <button
                        onClick={() => setBookingFilter('all')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                      >
                        Clear Filter
                      </button>
                    )}
                    <button
                      onClick={fetchMyBookings}
                      className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: 'rgba(56,189,248,0.07)',
                        border: '1px solid rgba(56,189,248,0.2)',
                        color: '#7dd3fc',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.14)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.07)' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                      Refresh
                    </button>
                  </div>
                }
              >
                <Table 
                  columns={bookingColumns} 
                  data={bookingFilter === 'pending' ? myBookings.filter(b => b.Status === 'Pending') : myBookings} 
                  loading={loadingBookings} 
                  emptyMessage="No bookings found." 
                />
              </SectionCard>
            </div>
          )}

          {/* ─── Notifications ─── */}
          {activeSection === 'notifications' && (
            <div className="max-w-2xl animate-fade-in">
              <SectionCard
                title="Notifications"
                subtitle={`${notifications.filter(n => n.Status === 'Unread').length} unread messages`}
              >
                <NotificationList notifications={notifications} loading={loadingNotifs} />
              </SectionCard>
            </div>
          )}

          {/* ─── Analytics ─── */}
          {activeSection === 'analytics' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold" style={{ color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: '1.2rem' }}>
                  {user.Role === 'Admin' ? 'System Analytics' : 'My Usage Analytics'}
                </h2>
              </div>
              
              {loadingAnalytics || !analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Most Used Resources */}
                  <SectionCard title="Top Resources" subtitle="Most frequently booked">
                    <div className="space-y-4">
                      {analytics.mostUsedResources?.length > 0 ? analytics.mostUsedResources.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-sm font-medium text-gray-200">{item.Resource_Name || 'Unknown'}</span>
                          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold">{item.total_bookings} uses</span>
                        </div>
                      )) : <p className="text-gray-500 text-sm">No usage data found.</p>}
                    </div>
                  </SectionCard>

                  {/* Peak Hours */}
                  <SectionCard title="Peak Booking Times" subtitle="Busiest hours">
                    <div className="space-y-4">
                      {analytics.peakHours?.length > 0 ? analytics.peakHours.map((item, i) => {
                        const h = item.hour || item.peak_hour;
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const hr = h % 12 === 0 ? 12 : h % 12;
                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="text-sm font-medium text-gray-200">{hr}:00 {ampm}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, item.total * 10)}%` }} />
                              </div>
                              <span className="text-amber-400 text-xs font-bold w-4 text-right">{item.total}</span>
                            </div>
                          </div>
                        )
                      }) : <p className="text-gray-500 text-sm">No time data found.</p>}
                    </div>
                  </SectionCard>

                  {/* Utilization */}
                  <SectionCard title="Total Resource Bookings" subtitle="All-time bookings">
                    <div className="flex flex-col gap-3">
                      {analytics.bookingsPerResource?.length > 0 ? analytics.bookingsPerResource.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="text-sm font-medium text-gray-200">{item.Resource_Name || 'Unknown'}</span>
                          <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold">{item.count} bookings</span>
                        </div>
                      )) : <p className="text-gray-500 text-sm">No status data found.</p>}
                    </div>
                  </SectionCard>
                </div>
              )}
            </div>
          )}

          {/* ─── Calendar ─── */}
          {activeSection === 'calendar' && (
            <div className="h-[800px] animate-fade-in">
              <CalendarView bookings={myBookings} />
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}