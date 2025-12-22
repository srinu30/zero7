import { useState, useEffect } from 'react'
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from 'react-icons/fa'
import { Bell, Trash2 } from 'lucide-react'
import api from '../api/axios'
import Cookie from 'js-cookie' // <<< 1. IMPORT js-cookie

// Style mapping for different notification types
const NOTIFICATION_STYLES = {
  info: {
    icon: <FaInfoCircle className='text-blue-500' />,
    border: 'border-blue-500',
    unreadBg: 'bg-blue-50',
  },
  success: {
    icon: <FaCheckCircle className='text-green-500' />,
    border: 'border-green-500',
    unreadBg: 'bg-green-50',
  },
  warning: {
    icon: <FaExclamationTriangle className='text-yellow-500' />,
    border: 'border-yellow-500',
    unreadBg: 'bg-yellow-50',
  },
  error: {
    icon: <FaTimesCircle className='text-red-500' />,
    border: 'border-red-500',
    unreadBg: 'bg-red-50',
  },
}

const RecentActivity = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRole, setUserRole] = useState('') 

 
  useEffect(() => {
    try {
      const userData = Cookie.get('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUserRole(parsedUser.role || '') 
      }
    } catch (e) {
      console.error('Failed to parse user cookie', e)
    }
  }, []) 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications')
        setNotifications(response.data)
      } catch (err) {
        setError('Failed to fetch recent activity.')
        console.error('Failed to fetch notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read')
      setNotifications(
        notifications.map((notif) => ({ ...notif, unread: false })),
      )
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const handleDelete = async (id) => {
    setNotifications(notifications.filter((notif) => notif._id !== id))

    try {
      const notif = await api.delete(`/notifications/${id}`)
      console.log(notif.data)
    } catch (err) {
      console.error('Failed to delete notification:', err)
      setError('Could not delete the notification. Please refresh.')
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  if (loading) {
    return (
      <div className='bg-white w-full p-6 rounded-2xl mt-4 shadow-sm border border-gray-200 text-gray-500'>
        Loading activities...
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-white w-full p-6 rounded-2xl mt-4 shadow-sm border border-red-200 text-red-600'>
        {error}
      </div>
    )
  }

  return (
    <div className='bg-white w-full p-4 sm:p-6 rounded-2xl mt-4 shadow-sm border border-gray-200'>
      <div className='flex items-center justify-between gap-3 mb-4'>
        <div className='flex items-center gap-3'>
          <Bell className='text-gray-500' />
          <h3 className='text-xl font-bold text-gray-800'>Recent Activity</h3>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'>
            Mark all as read
          </button>
        )}
      </div>

      <div className='space-y-2'>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const styles = NOTIFICATION_STYLES[notification.type]
            return (
              <div
                key={notification._id}
                className={`group relative flex gap-4 p-4 rounded-lg transition-all duration-300 border-l-4 ${
                  styles.border
                } ${
                  notification.unread ? styles.unreadBg : 'bg-white'
                } hover:shadow-md hover:bg-gray-50`}>
                <div className='flex-shrink-0 text-2xl mt-1'>{styles.icon}</div>
                <div className='flex-grow pr-8'>
                  <div className='flex justify-between items-start mb-1'>
                    <span
                      className={`font-semibold text-gray-800 ${
                        notification.unread ? 'font-extrabold' : ''
                      }`}>
                      {notification.title}
                    </span>
                    <span className='text-xs text-gray-500 flex-shrink-0 ml-4'>
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>
                    {notification.message}
                  </p>

               
                  {userRole === 'Admin' && notification.link && (
                    <a
                      href={notification.link}
                      className='text-sm font-semibold text-blue-600 hover:underline'>
                      View Details
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(notification._id)}
                  className='absolute top-2 right-2 p-1.5 rounded-full text-gray-400 bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-100 hover:text-red-600'
                  aria-label='Delete notification'>
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })
        ) : (
          <p className='text-gray-500 p-4 text-center'>
            You're all caught up!
          </p>
        )}
      </div>
    </div>
  )
}

export default RecentActivity