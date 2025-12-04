import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAccessToken, getAccessToken, AUTH_EVENTS } from '@/api/axiosClient'

interface AuthUser {
  user_no: number
  user_id: string
  user_name: string
  role: string
}

/**
 * 인증 상태 관리 훅
 * localStorage에서 사용자 정보를 읽어 인증 상태를 관리
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 로드
  const loadUser = useCallback(() => {
    const token = getAccessToken()
    const userNo = localStorage.getItem('user_no')
    const userId = localStorage.getItem('user_id')
    const userName = localStorage.getItem('user_name')
    const role = localStorage.getItem('role')

    if (token && userNo && userId && userName) {
      setUser({
        user_no: Number(userNo),
        user_id: userId,
        user_name: userName,
        role: role || 'User',
      })
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  // 로그아웃
  const logout = useCallback(() => {
    clearAccessToken()
    localStorage.removeItem('user_no')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    localStorage.removeItem('role')
    setUser(null)
  }, [])

  // 초기 로드 및 이벤트 리스너
  useEffect(() => {
    loadUser()

    // 401 에러 발생 시 로그아웃 처리
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized)
    
    // storage 이벤트 (다른 탭에서 로그아웃 시 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'myshop_access_token') {
        loadUser()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [loadUser, logout])

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'Admin',
    isLoading,
    logout,
    refreshAuth: loadUser,
  }
}

/**
 * 로그인 필요 페이지에서 사용하는 Guard 훅
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const navigate = useNavigate()
  const { user, isLoading, isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(redirectTo, { replace: true })
    }
  }, [isLoading, isLoggedIn, navigate, redirectTo])

  return { user, isLoading, isLoggedIn }
}

/**
 * 관리자 전용 페이지 Guard 훅
 */
export const useRequireAdmin = (redirectTo = '/') => {
  const navigate = useNavigate()
  const { user, isLoading, isAdmin } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate(redirectTo, { replace: true })
    }
  }, [isLoading, isAdmin, navigate, redirectTo])

  return { user, isLoading, isAdmin }
}
