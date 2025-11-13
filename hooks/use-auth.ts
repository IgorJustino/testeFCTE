"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiClient, type User } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const userData = await apiClient.getCurrentUser()
      if (userData) {
        setUser(userData)
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      setUser(null)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback((userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }, [])

  return {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout,
    checkAuth
  }
}