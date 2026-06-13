'use client'
import { useState } from 'react'
import { bookResource } from '../services/api'
import CustomDatePicker from './CustomDatePicker'
import CustomTimePicker from './CustomTimePicker'

export default function BookingForm({ resources, userId, prefillResource, onSuccess }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    Resource_ID: prefillResource?.Resource_ID || prefillResource?.ID || '',
    booking_date: today,
    start_time: '09:00',
    end_time: '10:00',
    purpose: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.Resource_ID || !form.purpose.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const payload = {
        User_ID: userId,
        Resource_ID: Number(form.Resource_ID),
        booking_date: form.booking_date,
        start_time: form.start_time + ':00',
        end_time: form.end_time + ':00',
        purpose: form.purpose,
      }
      const res = await bookResource(payload)
      if (res && typeof res === 'object' && (res.message || res.Booking_ID)) {
        setMessage({ type: 'success', text: 'Booking submitted successfully!' })
        setForm(prev => ({ ...prev, purpose: '' }))
        if (onSuccess) onSuccess()
      } else {
        setMessage({ type: 'error', text: typeof res === 'string' ? res : 'Booking failed. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resource select */}
      <div>
        <label className="block text-xs font-medium text-campus-muted mb-1.5 uppercase tracking-wider">Resource</label>
        <select
          name="Resource_ID"
          value={form.Resource_ID}
          onChange={handleChange}
          className="w-full bg-campus-bg border border-campus-border rounded-lg px-3 py-2.5 text-campus-text text-sm"
          required
        >
          <option value="">Select a resource...</option>
          {resources.map(r => (
            <option key={r.Resource_ID || r.ID} value={r.Resource_ID || r.ID}>
              {r.Resource_Name || r.Name} — {r.Location || ''}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-medium text-campus-muted mb-1.5 uppercase tracking-wider">Booking Date</label>
        <CustomDatePicker 
          value={form.booking_date}
          minDate={today}
          onChange={handleChange}
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-4 z-10 relative">
        <div>
          <label className="block text-xs font-medium text-campus-muted mb-1.5 uppercase tracking-wider">Start Time</label>
          <CustomTimePicker
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-campus-muted mb-1.5 uppercase tracking-wider">End Time</label>
          <CustomTimePicker
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-xs font-medium text-campus-muted mb-1.5 uppercase tracking-wider">Purpose</label>
        <textarea
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the purpose of your booking..."
          className="w-full bg-campus-bg border border-campus-border rounded-lg px-3 py-2.5 text-campus-text text-sm resize-none"
          required
        />
      </div>

      {/* Message */}
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Submitting...
          </>
        ) : 'Submit Booking'}
      </button>
    </form>
  )
}