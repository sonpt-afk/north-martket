import React, { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { GetCurrentUser } from '../apicalls/users'
import { User as UserType } from '../types/user'

interface ProtectedPageProps {
  children: ReactNode;
}

function ProtectedPage({ children }: ProtectedPageProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const navigate = useNavigate()

  const validateToken = async () => {
    try {
      const response = await GetCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        localStorage.removeItem('token') // Clear invalid token
        navigate('/login')
      }
    } catch (error) {
      localStorage.removeItem('token') // Clear invalid token
      navigate('/login')
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
    <div>
      {user && (
        <div className='p-5'>
          {user.name}
          {children}
        </div>
      )}
    </div>
  )
}

export default ProtectedPage