import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_EVENTS } from '@/api/axiosClient'
import { logout as apiLogout } from '@/api/userApi'

interface AuthUser {
  userId: number
  email: string
  username: string
  role: string
}

/**
 * 인증 상태 관리 훅
 * localStorage에서 사용자 정보를 읽어 인증 상태를 관리
 * 백엔드 API: /api/auth/*
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 사용자 정보 로드
  const loadUser = useCallback(() => {
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')

    if (userId && email && username) {
      setUser({
        userId: Number(userId),
        email: email,
        username: username,
        role: role || 'USER',
      })
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // 서버 로그아웃 실패해도 로컬 정리
    }
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('myshop_access_token')
    setUser(null)
    window.dispatchEvent(new Event('auth:logout'))
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
      if (e.key === 'userId' || e.key === 'email') {
        loadUser()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // 같은 탭 내 로그인/로그아웃 이벤트 감지
    const handleAuthChange = () => {
      loadUser()
    }
    window.addEventListener('auth:login', handleAuthChange)
    window.addEventListener('auth:logout', handleAuthChange)

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth:login', handleAuthChange)
      window.removeEventListener('auth:logout', handleAuthChange)
    }
  }, [loadUser, logout])

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
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
