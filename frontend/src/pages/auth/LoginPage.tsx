import { useState } from 'react'
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
      const response = await login(formData)
      
      // 사용자 정보 저장
      localStorage.setItem('userId', String(response.userId))
      localStorage.setItem('email', response.email)
      localStorage.setItem('username', response.username)
      localStorage.setItem('role', response.role)
      
      // 로그인 성공 시 홈으로 이동
      navigate('/')
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
