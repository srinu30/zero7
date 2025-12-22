// File: src/context/NotificationContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import { io } from 'socket.io-client'
import api from '../api/axios' // Make sure you have a configured axios instance

const NotificationContext = createContext(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    )
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const audioContextRef = useRef(null)
  const audioUnlockedRef = useRef(false)

  // This function unlocks the browser's audio context, which is required for autoplaying sound.
  const unlockAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
    }
    audioUnlockedRef.current = true
    // Clean up the event listeners after the first user interaction.
    document.removeEventListener('click', unlockAudio)
    document.removeEventListener('touchstart', unlockAudio)
  }, [])

  // This function plays the notification sound.
  const playSound = useCallback(() => {
    if (!audioUnlockedRef.current) {
      console.warn(
        'Audio not unlocked yet. Click anywhere on the page to enable sound.',
      )
      return
    }
    try {
      const audio = new Audio('/sounds/notification.wav') // Ensure this file is in your /public/sounds folder
      audio.play().catch((err) => console.error('Error playing sound:', err))
    } catch (err) {
      console.error('Could not play sound:', err)
    }
  }, [])

  // Effect for Socket connection and initial data fetch
  useEffect(() => {
    const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
    const newSocket = io(SOCKET_URL, { transports: ['websocket'] }) // More reliable connection
    setSocket(newSocket)

    const fetchInitialNotifications = async () => {
      try {
        const response = await api.get('/notifications')
        const fetchedNotifications = response.data.map((n) => ({
          id: n._id,
          ...n,
          time: new Date(n.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
        setNotifications(fetchedNotifications)
        setUnreadCount(fetchedNotifications.filter((n) => n.unread).length)
      } catch (error) {
        console.error('Failed to fetch initial notifications:', error)
      }
    }

    fetchInitialNotifications()

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Add event listeners to unlock audio on the first user interaction
    document.addEventListener('click', unlockAudio, { once: true })
    document.addEventListener('touchstart', unlockAudio, { once: true })

    return () => {
      newSocket.close()
      document.removeEventListener('click', unlockAudio)
      document.removeEventListener('touchstart', unlockAudio)
    }
  }, [unlockAudio])

  // --- REFACTORED: This effect now handles real-time updates directly ---
  useEffect(() => {
    if (!socket) return

    // Central handler for all incoming notifications
    const handleNewNotification = (notificationData) => {
      // 1. Play sound and show browser notification
      playSound()
      if (Notification.permission === 'granted') {
        new Notification(notificationData.title, {
          body: notificationData.message,
          icon: '/logo192.png',
        })
      }

      // 2. Create the new notification object for the UI
      const newNotification = {
        id: Date.now(), // Unique key for the React list
        ...notificationData,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        unread: true,
      }

      // 3. Update state using the functional form to guarantee real-time UI updates
      setNotifications((prevNotifications) =>
        [newNotification, ...prevNotifications].slice(0, 50),
      )
      setUnreadCount((prevCount) => prevCount + 1)
    }

    // List of all events to listen for
    const events = {
      newInfoRequest: {
        title: 'New Candidate Request',
        type: 'info',
        link: '/admin/view-requests',
      },
      newApplication: {
        title: 'New Job Application',
        type: 'success',
        link: '/admin/applications',
      },
      newEnrollment: {
        title: 'New Enrollment',
        type: 'info',
        link: '/admin/studentenrollment',
      },
      newFormSubmission: {
        title: 'New Contact Message',
        type: 'warning',
        link: '/admin/forms',
      },
      newJobPosting: {
        title: 'New Job Posting',
        type: 'info',
        link: '/admin/manage-jobs',
      },
      newCandidateAdded: {
        title: 'New Candidate Added',
        type: 'success',
        link: '/admin/manage-candidates',
      },
      newInterview: {
        title: 'New Interview Scheduled',
        type: 'success',
        link: '/admin/interviews',
      },
      newInterviewApproval: {
        title: 'Interview Approval Needed',
        type: 'warning',
        link: '/admin/interviews/approvals',
      },
      interviewStatusUpdated: {
        title: 'Interview Status Updated',
        type: 'info',
        link: '/admin/interviews',
      },
    }

    // Register all listeners
    Object.entries(events).forEach(([eventName, details]) => {
      socket.on(eventName, (data) => {
        handleNewNotification({
          ...details,
          message:
            data.message || `From ${data.name} regarding "${data.purpose}"`, // Handle different data shapes
        })
      })
    })

    socket.on('connect', () =>
      console.log('✅ Socket connected successfully via Context'),
    )
    socket.on('connect_error', (err) =>
      console.error('❌ Socket connection error:', err.message),
    )

    // Cleanup function to remove all listeners when the component unmounts
    return () => {
      socket.off('connect')
      socket.off('connect_error')
      Object.keys(events).forEach((eventName) => socket.off(eventName))
    }
  }, [socket, playSound]) // This effect only re-runs if the socket or playSound function changes

  const markAllAsRead = useCallback(async () => {
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    try {
      await api.put('/notifications/mark-all-read')
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
      // Optional: Revert UI change on API call failure
    }
  }, [])

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllAsRead,
    }),
    [notifications, unreadCount, markAllAsRead],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
