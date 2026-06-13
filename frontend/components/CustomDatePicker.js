'use client'
import { useState, useRef, useEffect } from 'react'

export default function CustomDatePicker({ value, onChange, minDate }) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedDate = value ? new Date(value) : new Date()
  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentYear, currentMonth, i))

  return (
    <div className="relative w-full" ref={popupRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full bg-campus-bg border border-campus-border rounded-lg px-3 py-2.5 text-campus-text text-sm cursor-pointer flex justify-between items-center hover:border-blue-500/50 transition-colors"
      >
        <span>{value || 'Select a date'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-72 p-4 rounded-xl bg-[#0b0f19] border border-gray-700/50 shadow-2xl shadow-blue-900/20">
          <div className="text-center font-bold text-gray-200 mb-4">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (!d) return <div key={i} />
              
              // Normalize the string parsing to local timezone effectively
              const year = d.getFullYear()
              const month = String(d.getMonth() + 1).padStart(2, '0')
              const day = String(d.getDate()).padStart(2, '0')
              const dateStr = `${year}-${month}-${day}`
              
              const isSelected = dateStr === value
              const isPast = minDate && dateStr < minDate
              
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange({ target: { name: 'booking_date', value: dateStr } })
                    setOpen(false)
                  }}
                  className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all mx-auto
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : ''}
                    ${!isSelected && !isPast ? 'text-gray-300 hover:bg-gray-800' : ''}
                    ${isPast ? 'text-gray-700 cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
