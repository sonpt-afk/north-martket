import React, { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { GetCurrentUser } from '../apicalls/users'
import { User as UserType } from '../types/user'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../redux/loadersSlice'
import { SetUser } from '../redux/usersSlice'
import { Badge, Avatar } from 'antd'
import Notifications from './Notifications'
import { GetAllNotifications, ReadAllNotifications } from '../apicalls/notifications'
import { Notification } from '../types/notification'

interface ProtectedPageProps {
  children: ReactNode
}

function ProtectedPage({ children }: ProtectedPageProps) {
  const [notifications, setNotification] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await GetCurrentUser()
      dispatch(SetLoader(false))

      if (response.success && response.data) {
        setUser(response.data)
        dispatch(SetUser(response.data)) // Add this line to set user in Redux store
      } else {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } catch (error) {
      localStorage.removeItem('token') // Clear invalid token
      navigate('/login')
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const getNotifications = async () => {
    try {
      const response = await GetAllNotifications()
      if (response.success) {
        setNotification(response.data)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const readNotifications = async () => {
    try {
      dispatch(SetLoader(true))
      const response = await ReadAllNotifications()
      dispatch(SetLoader(false))
      if (response.success) {
        getNotifications()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      validateToken()
      getNotifications()
    } else {
      navigate('/login')
    }
  }, [])

  return (
    user && (
      <div className=''>
        <div className='flex justify-between items-center bg-primary p-5'>
          <h1
            className='text-2xl text-white font-bold	cursor-pointer'
            onClick={() => {
              navigate('/')
            }}
          >
            North MP
          </h1>
          <div className='bg-white py-2 px-5 round flex gap-1 items-center'>
            <i className='ri-shield-user-line '></i>
            <span
              className='underline cursor-pointer'
              onClick={() => {
                if (user?.role === 'user') {
                  navigate('/profile')
                } else {
                  navigate('/admin')
                }
              }}
            >
              {user.name}
            </span>
            <div>
              <Badge
                count={notifications?.filter((noti) => !noti?.read).length}
                onClick={() => {
                  readNotifications()
                  setShowNotifications(true)
                }}
                className='cursor-pointer'
              >
                <Avatar shape='circle' size='default' icon={<i className='ri-notification-4-line'></i>} />
              </Badge>
            </div>
            <i
              className='ri-logout-box-r-line ml-8 hover:cursor-pointer'
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/login')
              }}
            ></i>
          </div>
        </div>
        {/* body */}
        <div className='p-5'>{children}</div>

        <Notifications
          reloadNotifications={getNotifications}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
      </div>
    )
  )
}

export default ProtectedPage
