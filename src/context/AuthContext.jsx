import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockUserService } from '../services/mockData'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // В режиме разработки используем mock пользователя
    const initializeUser = async () => {
      try {
        const mockUser = await mockUserService.getUser(1)
        setUser(mockUser)
      } catch (error) {
        console.error('Failed to initialize user:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const value = {
    user,
    setUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
