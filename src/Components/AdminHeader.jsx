// File: src/Components/AdminHeader.jsx (Corrected)

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import { PanelLeftClose, PanelRightClose, User } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

const AdminHeader = ({ toggleSidebar, isOpen }) => {
  const [user, setUser] = useState({ name: 'Admin', email: '', role: '' })
  // const [searchQuery, setSearchQuery] = useState(''); // <-- FIX: Removed unused state
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigate = useNavigate()
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  const handleNotificationClick = (notification) => {
    navigate(notification.link || '/admin/dashboard')
    setShowNotifications(false)
    markAllAsRead()
  }

  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const getCookieData = () => {
      try {
        const userData = Cookie.get('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (e) {
        console.error('Failed to parse user cookie', e)
      }
    }
    getCookieData()

    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationRef])

  const handleLogout = () => {
    Cookie.remove('token')
    Cookie.remove('user')
    window.location.href = '/admin'
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '📋'
    }
  }

  return (
    <header className='bg-white border-gray-200 p-3 flex items-center justify-between sticky top-0 left-0 z-40 shadow-sm'>
      {/* Left side */}
      <div className='mr-2 f'>
        <button type='button' onClick={toggleSidebar}>
          {isOpen ? <PanelLeftClose /> : <PanelRightClose />}
        </button>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2'>
        <div className='relative' ref={notificationRef}>
          <button
            className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label='Notifications'>
            <svg className='h-6 w-6' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
            </svg>
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-pulse'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50'>
              <div className='flex items-center justify-between p-4 border-b'>
                <h3 className='text-lg font-semibold'>Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}>
                      <div className='flex-shrink-0 mr-3'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm bg-blue-100 text-blue-600`}>
                          <span>{getNotificationIcon(notification.type)}</span>
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium text-gray-900 truncate'>
                          {notification.title}
                        </div>
                        <div className='text-sm text-gray-600 mt-1'>
                          {notification.message}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          {notification.time}
                        </div>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-600 rounded-full flex-shrink-0'></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'>
                    <span className='text-4xl mb-4 block'>🔔</span>
                    <p className='text-gray-500'>No new notifications</p>
                  </div>
                )}
              </div>
              <div className='p-4 border-t'>
                <button
                  onClick={() => navigate('/admin/view-requests')}
                  className='w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium'>
                  View All Requests
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='relative' ref={userMenuRef}>
          <button
            className='flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg'
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label='User menu'>
            <div className='relative'>
              <User className='w-8 h-8 rounded-full object-cover' />
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
            </div>
            <div className='hidden md:block text-left'>
              <div className='text-sm font-medium text-gray-900'>
                {user.name}
              </div>
              {user.role === 'Admin' && (
                <span className='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>
                  {user.role}
                </span>
              )}
              {user.role === 'manager' && (
                <span className='bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>
                  {user.role}
                </span>
              )}
              {user.role === 'recruiter' && (
                <span className='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm'>
                  {user.role}
                </span>
              )}
            </div>
            <svg
              className='w-4 h-4 text-gray-400'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-50'>
              <div className='flex items-center p-4 border-b'>
                <div className='flex-shrink-0'>
                  <User className='w-12 h-12 rounded-full object-cover' />
                </div>
                <div className='ml-3 flex-1'>
                  <div className='text-sm font-medium text-gray-900'>
                    {user.name}
                  </div>
                  <span className='text-[12px] text-gray-500'>
                    {user.email}
                  </span>
                </div>
              </div>
              <div className='py-2'>
                <a
                  href={`userPage/${user.id}`}
                  className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                  Profile Settings
                </a>
                <hr className='my-2 border-gray-200' />
                <button
                  className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                  onClick={handleLogout}>
                  <svg
                    className='w-4 h-4 mr-3 text-red-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
