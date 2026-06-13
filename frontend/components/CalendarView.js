'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BookingModal from './BookingModal'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarView({ bookings }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // State for Calendar Navigation
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState(Views.MONTH)

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Memoize events to prevent unnecessary re-renders
  const events = useMemo(() => {
    return (bookings || []).map(b => {
      const dateObj = new Date(b.date)
      const startStr = b.start || '00:00:00'
      const endStr = b.end || '23:59:59'
      
      const [startH, startM, startS] = startStr.split(':').map(Number)
      const [endH, endM, endS] = endStr.split(':').map(Number)

      const startDate = new Date(dateObj)
      startDate.setHours(startH, startM, startS || 0, 0)

      const endDate = new Date(dateObj)
      endDate.setHours(endH, endM, endS || 0, 0)

      return {
        title: `${b.resource} - ${b.purpose || 'Booking'}`,
        start: startDate,
        end: endDate,
        resource: b,
      }
    })
  }, [bookings])

  // Callbacks for navigation
  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate)
  }, [])

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView)
  }, [])

  // Style the events based on status
  const eventPropGetter = useCallback((event) => {
    const status = event.resource.status || 'Pending'
    let bg = 'rgba(56, 189, 248, 0.15)'
    let border = 'rgba(56, 189, 248, 0.3)'
    let color = '#38bdf8'

    if (status === 'Approved') {
      bg = 'rgba(34, 197, 94, 0.2)'
      border = 'rgba(34, 197, 94, 0.4)'
      color = '#4ade80'
    } else if (status === 'Rejected') {
      bg = 'rgba(239, 68, 68, 0.2)'
      border = 'rgba(239, 68, 68, 0.4)'
      color = '#f87171'
    } else { // Pending
      bg = 'rgba(234, 179, 8, 0.2)'
      border = 'rgba(234, 179, 8, 0.4)'
      color = '#facc15'
    }

    // Highlight ongoing booking
    const now = new Date()
    const isOngoing = now >= event.start && now <= event.end
    if (isOngoing && status === 'Approved') {
      bg = 'rgba(34, 197, 94, 0.4)'
      border = 'rgba(34, 197, 94, 0.8)'
      color = '#ffffff'
    }

    return {
      style: {
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: color,
        borderRadius: '6px',
        padding: '3px 8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backdropFilter: 'blur(8px)',
        boxShadow: isOngoing ? `0 0 10px ${border}` : 'none',
        animation: isOngoing ? 'pulse 2s infinite' : 'none',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
      }
    }
  }, [])

  return (
    <div className="w-full flex justify-center px-4 py-6 md:p-8 min-h-full">
      <div className="w-full max-w-6xl flex flex-col h-[85vh] min-h-[700px] transition-all duration-300">
        <style>{`
          /* Overriding react-big-calendar default styles for dark glassmorphism theme */
          .rbc-calendar {
            font-family: 'Inter', sans-serif;
            color: #f1f5f9;
          }
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-radius: 16px;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(16px);
            overflow: hidden;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }
          .rbc-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
            border-left: 1px solid rgba(255, 255, 255, 0.02) !important;
            padding: 16px 0 !important;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          .rbc-month-row, .rbc-day-bg, .rbc-time-slot, .rbc-time-content, .rbc-time-header-content {
            border-color: rgba(255, 255, 255, 0.03) !important;
          }
          .rbc-off-range-bg {
            background: rgba(0, 0, 0, 0.3);
          }
          /* Highlight Current Day */
          .rbc-today {
            background: rgba(56, 189, 248, 0.08) !important;
          }
          .rbc-date-cell {
            padding: 8px !important;
            font-weight: 500;
            font-size: 0.9rem;
            color: #cbd5e1;
          }
          .rbc-date-cell.rbc-now {
            font-weight: 800;
            color: #38bdf8;
          }
          /* Event Styling & Cell Spacing */
          .rbc-event {
            background: transparent !important;
            outline: none !important;
            padding: 2px 0 !important;
          }
          .rbc-row-segment {
            padding: 0 4px;
          }
          .rbc-event:hover {
            transform: translateY(-2px);
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 5;
          }
          /* Toolbar Styling */
          .rbc-toolbar {
            margin-bottom: 24px !important;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .rbc-toolbar-label {
            font-size: 1.25rem;
            font-weight: 700;
            color: #e2e8f0;
            letter-spacing: 0.02em;
          }
          .rbc-toolbar button {
            color: #94a3b8 !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            background: rgba(255, 255, 255, 0.03) !important;
            border-radius: 10px !important;
            padding: 8px 16px !important;
            font-weight: 500 !important;
            transition: all 0.2s ease;
          }
          .rbc-toolbar button:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #e2e8f0 !important;
          }
          .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
            background: rgba(56, 189, 248, 0.15) !important;
            color: #38bdf8 !important;
            border-color: rgba(56, 189, 248, 0.3) !important;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.1) !important;
          }
          /* Current Time Indicator */
          .rbc-current-time-indicator {
            background-color: #ef4444 !important;
            height: 2px !important;
          }
          .rbc-current-time-indicator::before {
            background-color: #ef4444 !important;
          }
          /* Show More (+X more) link */
          .rbc-show-more {
            background-color: transparent !important;
            color: #38bdf8 !important;
            font-weight: 600;
            font-size: 0.8rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 2px;
            display: inline-block;
            transition: color 0.2s;
            z-index: 10;
          }
          .rbc-show-more:hover {
            color: #7dd3fc !important;
            text-decoration: underline;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
            100% { opacity: 1; }
          }
        `}</style>

        {/* Header Area with Live Clock */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Campus Calendar
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              View all resource bookings and schedules in real-time
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-xl font-bold text-slate-100 tracking-wider font-mono">
              {currentTime.toLocaleTimeString('en-US', { hour12: true })}
            </span>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/40 border border-slate-700/30 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col">
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex-1 relative z-10 animate-fade-in transition-opacity duration-300">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              view={currentView}
              onView={handleViewChange}
              date={currentDate}
              onNavigate={handleNavigate}
              eventPropGetter={eventPropGetter}
              onSelectEvent={(event) => setSelectedEvent(event.resource)}
              step={60}
              timeslots={1}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {selectedEvent && (
        <BookingModal 
          booking={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  )
}
