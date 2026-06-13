'use client'
import { useState } from 'react'
import { getBookingById, getLatestBooking, markNotificationRead } from '../services/api'
import BookingModal from './BookingModal'

export default function NotificationList({ notifications, loading }) {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fetchingId, setFetchingId] = useState(null)
  const [readIds, setReadIds] = useState(new Set())

  const handleNotificationClick = async (n) => {
    // Optimistically mark as read in local UI
    if (n.Status === 'Unread' && !readIds.has(n.Notification_ID)) {
      setReadIds(prev => new Set(prev).add(n.Notification_ID))
      markNotificationRead(n.Notification_ID).catch(console.error)
    }

    const match = n.Message?.match(/#(\d+)/)
    if (match && match[1]) {
      const bookingId = match[1]
      setFetchingId(n.Notification_ID)
      const data = await getBookingById(bookingId)
      setFetchingId(null)
      
      if (data && !data.error) {
        setSelectedBooking(data)
        setIsModalOpen(true)
      }
    } else {
      setFetchingId(n.Notification_ID)
      const dataArray = await getLatestBooking(n.User_ID)
      setFetchingId(null)
      
      if (dataArray && dataArray.length > 0) {
        setSelectedBooking(dataArray[0])
        setIsModalOpen(true)
      }
    }
  }
  if (loading) {
    return (
      <div className="space-y-3 p-2">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14 w-full rounded-lg" />)}
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-campus-muted gap-2">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"/>
        </svg>
        <span className="text-sm">No notifications yet.</span>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
      {notifications.map((n, i) => {
        const isUnread = n.Status === 'Unread' && !readIds.has(n.Notification_ID)
        return (
          <div
            key={i}
            onClick={() => handleNotificationClick(n)}
            className={`flex gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-blue-500/50 ${
              isUnread
                ? 'border-blue-500/30 bg-blue-500/5'
                : 'border-campus-border bg-campus-bg/50 opacity-70'
            }`}
          >
            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isUnread ? 'bg-blue-400' : 'bg-transparent'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm ${isUnread ? 'text-white font-semibold' : 'text-campus-text'}`}>
                  {n.Message || 'No message'}
                </p>
                <span className="ml-4 text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {fetchingId === n.Notification_ID ? 'Loading...' : 'View Details'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {n.Date_Sent && (
                  <span className="text-xs text-campus-muted">
                    {new Date(n.Date_Sent).toLocaleDateString("en-GB")}
                  </span>
                )}
                <span className={`text-xs ${isUnread ? 'text-blue-400 font-medium' : 'text-campus-muted'}`}>
                  {isUnread ? 'Unread' : 'Read'}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
      
      {isModalOpen && selectedBooking && (
        <BookingModal 
          booking={selectedBooking} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  )
}