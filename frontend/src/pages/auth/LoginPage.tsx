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
import { setAccessToken } from '@/api/axiosClient'

/**
 * 로그인 페이지
 * SPEC: POST /api/user/login
 * REQUEST: user_id, user_pw
 * RESPONSE: user_no, user_name, role
 */

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    user_id: '',
    user_pw: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.user_id || !formData.user_pw) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      const response = await login(formData)
      
      // JWT 토큰 저장
      if (response.token) {
        setAccessToken(response.token)
      }
      
      // 사용자 정보 저장 (필요시 사용)
      localStorage.setItem('user_no', String(response.user_no))
      localStorage.setItem('user_name', response.user_name)
      localStorage.setItem('user_id', formData.user_id)
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
              label="아이디 (이메일)"
              type="email"
              value={formData.user_id}
              onChange={handleChange('user_id')}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="비밀번호"
              type="password"
              value={formData.user_pw}
              onChange={handleChange('user_pw')}
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
