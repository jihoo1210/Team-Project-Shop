import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import { login } from '@/api/userApi'

/**
 * 로그인 페이지
 * 백엔드 API: POST /api/auth/login
 * REQUEST: { email, password }
 * RESPONSE: { userId, email, username, role }
 */

const LoginPage = () => {
  const navigate = useNavigate()

  // 더미 계정 초기화 (백엔드 없이 테스트용)
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('myshop_users') || '[]')
    if (existingUsers.length === 0) {
      const dummyUsers = [
        { email: 'test@test.com', password: 'test1234', username: '테스트유저', phone: '010-1234-5678', role: 'USER' },
        { email: 'admin@admin.com', password: 'admin1234', username: '관리자', phone: '010-0000-0000', role: 'ADMIN' },
      ]
      localStorage.setItem('myshop_users', JSON.stringify(dummyUsers))
    }
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      
      let userData = null
      
      try {
        const response = await login(formData)
        userData = response
      } catch (apiError) {
        // 백엔드 연결 실패 시 로컬 스토리지에서 확인 (데모용)
        console.warn('백엔드 연결 실패, 로컬 로그인 모드:', apiError)
        
        const existingUsers = JSON.parse(localStorage.getItem('myshop_users') || '[]')
        const user = existingUsers.find(
          (u: { email: string; password: string }) => 
            u.email === formData.email && u.password === formData.password
        )
        
        if (!user) {
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
        
        userData = {
          userId: Date.now(),
          email: user.email,
          username: user.username,
          role: 'USER',
        }
      }
      
      if (userData) {
        // 사용자 정보 저장
        localStorage.setItem('userId', String(userData.userId))
        localStorage.setItem('email', userData.email)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('role', userData.role)
        
        // 로그인 성공 시 홈으로 이동
        navigate('/')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '로그인에 실패했습니다.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Google OAuth 로그인
  const handleGoogleLogin = () => {
    // TODO: Google OAuth 연동
    window.location.href = '/api/oauth2/authorization/google'
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 4 }}>
          로그인
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="이메일"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              fullWidth
              required
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }}>또는</Divider>

        {/* Google OAuth 로그인 - SPEC: OAuth Google */}
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ py: 1.5 }}
        >
          Google로 로그인
        </Button>

        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/signup" underline="hover">
            회원가입
          </Link>
          <Typography color="text.secondary">|</Typography>
          <Link component={RouterLink} to="/find-password" underline="hover">
            비밀번호 찾기
          </Link>
        </Stack>
      </Paper>
    </Container>
  )
}

export default LoginPage
