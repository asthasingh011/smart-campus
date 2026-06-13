'use client'
import React from 'react'

export default function BookingModal({ booking, onClose }) {
  if (!booking) return null


  const formattedDate = booking.date ? new Date(booking.date).toLocaleDateString("en-GB") : '—'
  const formatTime = (t) => t ? new Date(`1970-01-01T${t}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.15)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
        >
          ✕
        </button>

        {/* Pass Card Area */}
        <div className="p-8 pb-6 relative overflow-hidden" style={{ background: '#0d1117' }}>
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-blue-400 font-bold tracking-widest uppercase mb-1">Entry Pass</p>
                    <h2 className="text-2xl font-bold text-white">#{booking.id}</h2>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    booking.status === 'Approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    booking.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {booking.status || 'Pending'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Resource</p>
                    <p className="text-lg font-medium text-white">{booking.resource}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-medium text-white">{formattedDate}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Time</p>
                      <p className="text-sm font-medium text-white">{formatTime(booking.start)} - {formatTime(booking.end)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Reserved For</p>
                      <p className="text-sm font-medium text-white truncate">{booking.user}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-gray-400 mb-1">Purpose</p>
                      <p className="text-sm font-medium text-white truncate">{booking.purpose || '—'}</p>
                    </div>
                  </div>
                </div>
          </div>
        </div>

      </div>
    </div>
  )
}
