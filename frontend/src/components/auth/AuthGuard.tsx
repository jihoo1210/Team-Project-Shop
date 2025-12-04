import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoadingScreen from '@/components/common/LoadingScreen'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * 로그인 필요 페이지 보호 컴포넌트
 * 비로그인 시 로그인 페이지로 리다이렉트
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isLoggedIn) {
    // 로그인 후 원래 페이지로 돌아가기 위해 현재 경로 저장
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

/**
 * 관리자 전용 페이지 보호 컴포넌트
 * 비관리자 시 홈으로 리다이렉트
 */
export const AdminGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

/**
 * 비로그인 전용 페이지 보호 컴포넌트
 * 로그인 상태에서 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
 */
export const GuestGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
