'use client'
import { useState, useRef, useEffect } from 'react'

export default function CustomTimePicker({ name, value, onChange }) {
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

  const [hours, mins] = (value || '09:00').split(':')
  const [h, setH] = useState(hours || '09')
  const [m, setM] = useState(mins || '00')

  const hArr = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  // Standardizing 15-min intervals for simple UX, but we can do full 60 if needed
  const mArr = ['00', '15', '30', '45']

  function updateTime(newH, newM) {
    setH(newH)
    setM(newM)
    onChange({ target: { name, value: `${newH}:${newM}` } })
  }

  return (
    <div className="relative w-full" ref={popupRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full bg-campus-bg border border-campus-border rounded-lg px-3 py-2.5 text-campus-text text-sm cursor-pointer flex justify-between items-center hover:border-blue-500/50 transition-colors"
      >
        <span>{value || '09:00'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-48 p-4 rounded-xl bg-[#0b0f19] border border-gray-700/50 shadow-2xl shadow-blue-900/20 flex gap-4 justify-center">
          
          {/* Hours Column */}
          <div 
            className="flex flex-col h-40 overflow-y-auto w-14 snap-y snap-mandatory rounded-lg bg-black/20 border border-gray-800"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
            
            <div className="h-16 shrink-0" />
            {hArr.map((hr) => (
              <div 
                key={hr}
                onClick={() => updateTime(hr, m)}
                className={`h-8 flex items-center justify-center shrink-0 snap-center cursor-pointer transition-all
                  ${hr === h ? 'text-blue-400 font-bold text-lg scale-110' : 'text-gray-500 text-sm hover:text-gray-300 hover:bg-gray-800/50 rounded'}
                `}
              >
                {hr}
              </div>
            ))}
            <div className="h-16 shrink-0" />
          </div>
          
          <div className="flex items-center text-gray-500 font-bold">:</div>

          {/* Minutes Column */}
          <div 
            className="flex flex-col h-40 overflow-y-auto w-14 snap-y snap-mandatory rounded-lg bg-black/20 border border-gray-800"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="h-16 shrink-0" />
            {mArr.map((mn) => (
              <div 
                key={mn}
                onClick={() => updateTime(h, mn)}
                className={`h-8 flex items-center justify-center shrink-0 snap-center cursor-pointer transition-all
                  ${mn === m ? 'text-blue-400 font-bold text-lg scale-110' : 'text-gray-500 text-sm hover:text-gray-300 hover:bg-gray-800/50 rounded'}
                `}
              >
                {mn}
              </div>
            ))}
            <div className="h-16 shrink-0" />
          </div>

        </div>
      )}
    </div>
  )
}
