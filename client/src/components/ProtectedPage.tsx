import React, { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { GetCurrentUser } from '../apicalls/users'
import { User as UserType } from '../types/user'
import { useDispatch } from 'react-redux'
import { SetLoader } from '../redux/loadersSlice'
import { SetUser } from '../redux/usersSlice'

interface ProtectedPageProps {
  children: ReactNode
}

function ProtectedPage({ children }: ProtectedPageProps) {
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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    validateToken()
  }, [navigate]) // Add navigate to dependency array

  return (
    user && (
      <div className=''>
        {/* header */}
        <div className='flex justify-between items-center bg-primary p-5'>
          <h1 className='text-2xl text-white font-bold	'>North MP</h1>
          <div className='bg-white py-2 px-5 round flex gap-1 items-center'>
            <i className='ri-shield-user-line '></i>
            <span
              className='underline cursor-pointer'
              onClick={() => {
                navigate('/profile')
              }}
            >
              {user.name}
            </span>
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
      </div>
    )
  )
}

export default ProtectedPage
