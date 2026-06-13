'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Table from '../../components/Table'
import SectionCard from '../../components/SectionCard'
import CalendarView from '../../components/CalendarView'
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  sendNotification,
  getUsageLogs,
  getSlots,
  getResources,
  getAnalytics,
} from '../../services/api'

// ── Admin stat card ───────────────────────────────────────────────────────────
function AdminStatCard({ label, value, icon, accent, glowColor }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden flex flex-col justify-between group transition-all duration-300 ease-out hover:-translate-y-1 hover:brightness-105"
      style={{
        background: 'linear-gradient(145deg, #141c2e 0%, #0d1117 100%)',
        border: `1px solid ${accent}22`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 30px ${glowColor}`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 10%, ${glowColor} 0%, transparent 55%)` }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(148,163,184,0.6)', fontFamily: "'Syne', sans-serif" }}>
            {label}
          </p>
          <p className="text-3xl font-bold" style={{ color: accent, fontFamily: "'Syne', sans-serif", lineHeight: 1, textShadow: `0 0 20px ${glowColor}` }}>
            {value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1 group-hover:brightness-125 group-hover:border-white/30"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Form field wrappers ───────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#e2e8f0',
  fontSize: '0.8125rem',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(148,163,184,0.6)',
  marginBottom: '6px',
  fontFamily: "'Syne', sans-serif",
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('bookings')

  // Data
  const [allBookings, setAllBookings] = useState([])
  const [usageLogs, setUsageLogs] = useState([])
  const [slots, setSlots] = useState([])
  const [resources, setResources] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [actionLoading, setActionLoading] = useState({})
  
  const [analytics, setAnalytics] = useState(null)

  // Form states
  const [maintForm, setMaintForm] = useState({ Resource_ID: '', Issue_Description: '' })
  const [maintMsg, setMaintMsg] = useState(null)
  const [maintLoading, setMaintLoading] = useState(false)

  const [notifForm, setNotifForm] = useState({ User_ID: '', Message: '' })
  const [notifMsg, setNotifMsg] = useState(null)
  const [notifLoading, setNotifLoading] = useState(false)

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem('campus_user')
    if (!stored) { router.replace('/login'); return }
    try {
      const u = JSON.parse(stored)
      if (u.Role !== 'Admin') { router.replace('/dashboard'); return }
      setUser(u)
    } catch { router.replace('/login') }
  }, [router])

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    const data = await getAllBookings()
    setAllBookings(data || [])
    setLoadingBookings(false)
  }, [])

  // Fetch usage logs
  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true)
    const data = await getUsageLogs()
    setUsageLogs(data)
    setLoadingLogs(false)
  }, [])

  // Fetch slots
  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true)
    const data = await getSlots()
    setSlots(data)
    setLoadingSlots(false)
  }, [])

  // Fetch resources for maintenance form
  useEffect(() => {
    if (!user) return
    fetchBookings()
    getResources().then(setResources)
  }, [user, fetchBookings])

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

  useEffect(() => {
    if (activeSection === 'logs') fetchLogs()
    if (activeSection === 'slots') fetchSlots()
  }, [activeSection, fetchLogs, fetchSlots])

  // Approve / Reject
  async function handleApprove(bookingId) {
    setActionLoading(prev => ({ ...prev, [`approve_${bookingId}`]: true }))
    const res = await approveBooking(bookingId, user.User_ID)
    setActionLoading(prev => ({ ...prev, [`approve_${bookingId}`]: false }))
    fetchBookings()
  }

  async function handleReject(bookingId) {
    setActionLoading(prev => ({ ...prev, [`reject_${bookingId}`]: true }))
    await rejectBooking(bookingId, user.User_ID)
    setActionLoading(prev => ({ ...prev, [`reject_${bookingId}`]: false }))
    fetchBookings()
  }

  async function handleDelete(bookingId) {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    setActionLoading(prev => ({ ...prev, [`delete_${bookingId}`]: true }))
    try {
      await deleteBooking(bookingId)
      fetchBookings()
    } catch (err) {
      console.error("Delete failed", err)
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${bookingId}`]: false }))
    }
  }

  // Maintenance submit
  async function handleMaintSubmit(e) {
    e.preventDefault()
    if (!maintForm.Resource_ID || !maintForm.Issue_Description.trim()) {
      setMaintMsg({ type: 'error', text: 'Please fill all fields.' }); return
    }
    setMaintLoading(true); setMaintMsg(null)
    const today = new Date().toISOString().split('T')[0]
    const res = await reportMaintenance({
      Resource_ID: Number(maintForm.Resource_ID),
      Issue_Description: maintForm.Issue_Description,
      Reported_Date: today,
      Status: 'Pending',
    })
    setMaintLoading(false)
    if (res !== null) {
      setMaintMsg({ type: 'success', text: 'Maintenance request submitted!' })
      setMaintForm({ Resource_ID: '', Issue_Description: '' })
    } else {
      setMaintMsg({ type: 'error', text: 'Failed to submit request.' })
    }
  }

  // Notification submit
  async function handleNotifSubmit(e) {
    e.preventDefault()
    if (!notifForm.User_ID || !notifForm.Message.trim()) {
      setNotifMsg({ type: 'error', text: 'Please fill all fields.' }); return
    }
    setNotifLoading(true); setNotifMsg(null)
    const today = new Date().toISOString().split('T')[0]
    const res = await sendNotification({
      User_ID: Number(notifForm.User_ID),
      Message: notifForm.Message,
      Date_Sent: today,
      Status: 'Unread',
    })
    setNotifLoading(false)
    if (res !== null) {
      setNotifMsg({ type: 'success', text: 'Notification sent successfully!' })
      setNotifForm({ User_ID: '', Message: '' })
    } else {
      setNotifMsg({ type: 'error', text: 'Failed to send notification.' })
    }
  }

  // Table columns
  const bookingColumns = [
    { key: 'id', label: 'ID' },
    { key: 'user', label: 'User' },
    { key: 'resource', label: 'Resource', render: (v, row) => row.resource || "—" },
    { key: 'date', label: 'Date' },
    { key: 'start', label: 'Start' },
    { key: 'end', label: 'End' },
    {
      key: 'status', label: 'Status',
      render: v => <span className={`badge badge-${(v || 'pending').toLowerCase()}`}>{v || 'Pending'}</span>
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => {
        const isPending = row.status === 'Pending' || !row.status
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApprove(row.id)}
              disabled={!isPending || actionLoading[`approve_${row.id}`]}
              className="px-3 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              {actionLoading[`approve_${row.id}`] ? (
                <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : '✓'} Approve
            </button>
            <button
              onClick={() => handleReject(row.id)}
              disabled={!isPending || actionLoading[`reject_${row.id}`]}
              className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
            >
              {actionLoading[`reject_${row.id}`] ? (
                <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : '✕'} Reject
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              disabled={actionLoading[`delete_${row.id}`]}
              className="px-3 py-1 rounded-md bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
              title="Delete Permanently"
            >
              {actionLoading[`delete_${row.id}`] ? (
                <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : '🗑️'} Delete
            </button>
          </div>
        )
      }
    },
  ]

  const logsColumns = [
    { key: 'id', label: 'Log ID' },
    { key: 'resource', label: 'Resource', render: v => v || "—" },
    { key: 'user', label: 'User', render: v => v || "—" },
    { 
      key: 'date', label: 'Date',
      render: v => v ? new Date(v).toLocaleDateString("en-GB") : "—"
    },
    { 
      key: 'start', label: 'Start',
      render: v => v ? new Date(`1970-01-01T${v}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"
    },
    { 
      key: 'end', label: 'End',
      render: v => v ? new Date(`1970-01-01T${v}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"
    },
    { key: 'purpose', label: 'Purpose' },
  ]

  const slotsColumns = [
    { key: 'Slot_ID', label: 'Slot ID' },
    { key: 'Resource_ID', label: 'Resource' },
    { key: 'slot_date', label: 'Date' },
    { key: 'start_time', label: 'Start' },
    { key: 'end_time', label: 'End' },
    { key: 'is_available', label: 'Available', render: v => (
      <span className={`badge ${v ? 'badge-available' : 'badge-maintenance'}`}>
        {v ? 'Yes' : 'No'}
      </span>
    )},
  ]

  // Summary stats
  const safeBookings = allBookings || []
  const pendingCount = safeBookings.filter(b => b.Status === 'Pending' || !b.Status).length
  const approvedCount = safeBookings.filter(b => b.Status === 'Approved').length
  const rejectedCount = safeBookings.filter(b => b.Status === 'Rejected').length

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0f19' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(129,140,248,0.1))', border: '1px solid rgba(167,139,250,0.2)' }}
        >
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.75rem', fontFamily: "'Syne', sans-serif", letterSpacing: '0.1em' }}>
          LOADING
        </p>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0b0f19' }}>
      <Navbar user={user} />
      <div className="flex flex-1 min-h-0">
        <Sidebar type="admin" active={activeSection} onSelect={setActiveSection} />

        <main className="flex-1 overflow-y-auto w-full" style={{ background: 'linear-gradient(180deg, #0b0f19 0%, #080c14 100%)' }}>
          <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">

            {/* ── Admin banner ── */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #120a2a 0%, #111827 50%, #0f172a 100%)',
                border: '1px solid rgba(167,139,250,0.18)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 60px rgba(167,139,250,0.06)',
              }}
            >
              <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)' }} />
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), rgba(56,189,248,0.3), transparent)' }} />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.8)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.12em', fontWeight: 600 }}>
                    ADMIN PANEL
                  </span>
                </div>
                <h1
                  className="text-2xl font-bold mb-1"
                  style={{ color: '#f1f5f9', fontFamily: "'Syne', sans-serif" }}
                >
                  Resource Control Center
                </h1>
                <p style={{ color: 'rgba(148,163,184,0.65)', fontSize: '0.8125rem' }}>
                  Logged in as {user.Name} · {user.Email}
                </p>
              </div>

              {/* Quick stat pills */}
              <div className="flex items-center flex-wrap gap-2 md:gap-3">
                {[
                  { label: 'Pending', value: pendingCount, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
                  { label: 'Approved', value: approvedCount, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
                  { label: 'Rejected', value: rejectedCount, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="text-center px-4 py-2 md:px-5 md:py-3 rounded-xl flex-1 md:flex-none min-w-[80px]"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}
                  >
                    <div className="text-xl md:text-2xl font-bold" style={{ color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(148,163,184,0.55)', marginTop: '2px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Admin stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
              label="Total Bookings"
              value={(allBookings || []).length}
              icon="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
              accent="#38bdf8"
              glowColor="rgba(56,189,248,0.07)"
            />
            <AdminStatCard
              label="Pending Review"
              value={pendingCount}
              icon="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              accent="#fbbf24"
              glowColor="rgba(251,191,36,0.07)"
            />
            <AdminStatCard
              label="Approved"
              value={approvedCount}
              icon="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              accent="#34d399"
              glowColor="rgba(52,211,153,0.07)"
            />
            <AdminStatCard
              label="Resources"
              value={resources.length}
              icon="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"
              accent="#a78bfa"
              glowColor="rgba(167,139,250,0.07)"
            />
          </div>

          {/* ─── All Bookings ─── */}
          {activeSection === 'bookings' && (
            <div className="animate-fade-in">
              <SectionCard
                title="All Bookings"
                subtitle="Manage and review all resource booking requests"
                action={
                  <button
                    onClick={fetchBookings}
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
                }
              >
                <Table columns={bookingColumns} data={allBookings || []} loading={loadingBookings} emptyMessage="No bookings found." />
              </SectionCard>
            </div>
          )}

          {/* ─── Maintenance ─── */}
          {activeSection === 'maintenance' && (
            <div className="max-w-xl animate-fade-in">
              <SectionCard title="Report Maintenance Issue" subtitle="Log a maintenance request for a campus resource">
                <form onSubmit={handleMaintSubmit} className="space-y-5">
                  <div>
                    <label style={labelStyle}>Resource</label>
                    <select
                      value={maintForm.Resource_ID}
                      onChange={e => setMaintForm(p => ({ ...p, Resource_ID: e.target.value }))}
                      style={inputStyle}
                      required
                    >
                      <option value="" style={{ background: '#0d1117' }}>Select resource...</option>
                      {resources.map(r => (
                        <option key={r.Resource_ID || r.ID} value={r.Resource_ID || r.ID} style={{ background: '#0d1117' }}>
                          {r.Resource_Name || r.Name} — {r.Location || ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Issue Description</label>
                    <textarea
                      value={maintForm.Issue_Description}
                      onChange={e => setMaintForm(p => ({ ...p, Issue_Description: e.target.value }))}
                      rows={4}
                      placeholder="Describe the maintenance issue..."
                      style={{ ...inputStyle, resize: 'none' }}
                      required
                    />
                  </div>
                  {maintMsg && (
                    <div
                      className="px-4 py-3 rounded-xl text-sm"
                      style={maintMsg.type === 'success'
                        ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7' }
                        : { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }
                      }
                    >
                      {maintMsg.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={maintLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))',
                      border: '1px solid rgba(251,191,36,0.3)',
                      color: '#fcd34d',
                      boxShadow: '0 0 20px rgba(251,191,36,0.1)',
                    }}
                  >
                    {maintLoading ? (
                      <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Submitting...</>
                    ) : 'Submit Maintenance Request'}
                  </button>
                </form>
              </SectionCard>
            </div>
          )}

          {/* ─── Send Notification ─── */}
          {activeSection === 'notify' && (
            <div className="max-w-xl animate-fade-in">
              <SectionCard title="Send Notification" subtitle="Send a message to a specific user">
                <form onSubmit={handleNotifSubmit} className="space-y-5">
                  <div>
                    <label style={labelStyle}>User ID</label>
                    <input
                      type="number"
                      value={notifForm.User_ID}
                      onChange={e => setNotifForm(p => ({ ...p, User_ID: e.target.value }))}
                      placeholder="Enter user ID..."
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      value={notifForm.Message}
                      onChange={e => setNotifForm(p => ({ ...p, Message: e.target.value }))}
                      rows={4}
                      placeholder="Enter your notification message..."
                      style={{ ...inputStyle, resize: 'none' }}
                      required
                    />
                  </div>
                  {notifMsg && (
                    <div
                      className="px-4 py-3 rounded-xl text-sm"
                      style={notifMsg.type === 'success'
                        ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', color: '#6ee7b7' }
                        : { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }
                      }
                    >
                      {notifMsg.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={notifLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.14), rgba(99,102,241,0.08))',
                      border: '1px solid rgba(56,189,248,0.28)',
                      color: '#7dd3fc',
                      boxShadow: '0 0 20px rgba(56,189,248,0.1)',
                    }}
                  >
                    {notifLoading ? (
                      <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Sending...</>
                    ) : 'Send Notification'}
                  </button>
                </form>
              </SectionCard>
            </div>
          )}

          {/* ─── Usage Logs ─── */}
          {activeSection === 'logs' && (
            <div className="animate-fade-in">
              <SectionCard title="Usage Logs" subtitle="Complete record of all resource usage">
                <Table columns={logsColumns} data={usageLogs} loading={loadingLogs} emptyMessage="No usage logs available." />
              </SectionCard>
            </div>
          )}

          {/* ─── Slots ─── */}
          {activeSection === 'slots' && (
            <div className="max-w-4xl animate-fade-in">
              <SectionCard title="Schedule Slots" subtitle="Predefined booking time slots">
                 <button onClick={fetchSlots} className="mb-4 text-xs bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded border border-violet-500/30">Refresh</button>
                 <Table columns={[{key:'Slot_ID', label:'ID'}, {key:'Booking_ID', label:'Booking'}, {key:'Slot_Start_Time', label:'Start'}, {key:'Slot_End_Time', label:'End'}]} data={slots} loading={loadingSlots} emptyMessage="No slots found." />
              </SectionCard>
            </div>
          )}

          {/* ─── Analytics ─── */}
          {activeSection === 'analytics' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold" style={{ color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: '1.2rem' }}>
                  System Analytics
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
              <CalendarView bookings={allBookings || []} />
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}