import { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { login } from '@/api/userApi'
import { brandColors } from '@/theme/tokens'

/**
 * 로그인 페이지
 * 백엔드 API: POST /api/auth/login
 * REQUEST: { email, password }
 * RESPONSE: { userId, email, username, role }
 */

const LoginPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [saveEmail, setSaveEmail] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // OAuth 로그인 성공 처리
  useEffect(() => {
    const result = searchParams.get('result')
    if (result === 'success') {
      // OAuth 로그인 성공 - 쿠키에서 토큰이 설정됨
      // 사용자 정보를 가져와서 저장
      fetch('/api/auth/me', {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.result) {
            const user = data.result
            localStorage.setItem('userId', String(user.userId))
            localStorage.setItem('email', user.email)
            localStorage.setItem('username', user.username)
            localStorage.setItem('role', user.role)
            window.dispatchEvent(new Event('auth:login'))
            navigate('/')
          }
        })
        .catch(() => {
          // 사용자 정보 조회 실패해도 홈으로 이동 (쿠키 인증은 유지됨)
          window.dispatchEvent(new Event('auth:login'))
          navigate('/')
        })
    } else if (result === 'failure') {
      setError('소셜 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }, [searchParams, navigate])

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

      const userData = await login(formData)

      // 사용자 정보 저장
      localStorage.setItem('userId', String(userData.userId))
      localStorage.setItem('email', userData.email)
      localStorage.setItem('username', userData.username)
      localStorage.setItem('role', userData.role)

      // 인증 상태 변경 알림 (같은 탭 내 컴포넌트들에게)
      window.dispatchEvent(new Event('auth:login'))

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
    window.location.href = '/api/oauth2/authorization/google'
  }

  // Naver OAuth 로그인
  const handleNaverLogin = () => {
    window.location.href = '/api/oauth2/authorization/naver'
  }


  return (
    <Container maxWidth="md" sx={{ py: 10, minHeight: '100vh' }}>
      {/* 타이틀 */}
      <Typography
        variant="h4"
        fontWeight={400}
        textAlign="center"
        sx={{
          mt: 6,
          mb: 4,
          fontWeight: 'semibold',
          color: '#000',
          letterSpacing: '10px',
        }}
      >
        LOGIN
      </Typography>

      <Divider sx={{ borderColor: brandColors.textDark, mb: 4 }} />

      {/* 로그인 폼 섹션 */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          mb: 4,
          px: { xs: 2, md: 8 },
        }}
      >
        {/* 왼쪽: 입력 필드 */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            {/* 이메일 아이디 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100, fontSize: '0.9rem', color: '#666' }}>
                이메일 아이디
              </Typography>
              <TextField
                placeholder="이메일 아이디를 @까지 정확하게 입력하세요"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': { borderColor: '#ddd' },
                  },
                }}
              />
            </Box>

            {/* 비밀번호 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100, fontSize: '0.9rem', color: '#666' }}>
                비밀번호
              </Typography>
              <TextField
                placeholder="영문+숫자+특수문자 조합 8~16자리를 입력해주세요."
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <span>🙉</span> : <span>🙈</span>}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': { borderColor: '#ddd' },
                  },
                }}
              />
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ pl: '100px' }}>
                {error}
              </Typography>
            )}

            {/* 이메일 저장 & 링크 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saveEmail}
                    onChange={(e) => setSaveEmail(e.target.checked)}
                    size="small"
                    sx={{ color: '#ccc' }}
                  />
                }
                label={<Typography variant="body2" color="text.secondary">이메일 아이디 저장</Typography>}
              />
              <Stack direction="row" spacing={1}>
                <Link component={RouterLink} to="/find-id" underline="hover" color="text.secondary" fontSize="0.85rem">
                  아이디 찾기
                </Link>
                <Typography color="text.secondary">|</Typography>
                <Link component={RouterLink} to="/find-password" underline="hover" color="text.secondary" fontSize="0.85rem">
                  비밀번호 찾기
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* 오른쪽: 로그인 버튼 */}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            width: 120,
            height: 100,
            bgcolor: brandColors.textDark,
            color: '#fff',
            borderRadius: 0,
            fontSize: '1rem',
            '&:hover': { bgcolor: brandColors.secondaryHover },
          }}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* 회원가입 섹션 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 8 },
          mb: 4,
        }}
      >
        <Typography>
          지금 가입하면 <strong style={{ color: 'orange' }}>최대 40% 웰컴 패키지</strong> 지급
        </Typography>
        <Button
          component={RouterLink}
          to="/signup"
          variant="outlined"
          sx={{
            borderColor: brandColors.textDark,
            color: brandColors.textDark,
            borderRadius: 0,
            px: 6,
            py: 1.5,
            '&:hover': { borderColor: brandColors.secondaryHover, bgcolor: 'transparent' },
          }}
        >
          이메일로 가입하기
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* SNS 로그인 섹션 */}
      <Box sx={{ px: { xs: 2, md: 8 }, mb: 4 }}>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          SNS계정으로 간편하게 로그인하세요.
        </Typography>

        {/* SNS 아이콘 버튼들 */}
        <Stack direction="row" justifyContent="center" spacing={3}>
          {/* 네이버 */}
          <IconButton
            onClick={handleNaverLogin}
            sx={{
              width: 56,
              height: 56,
              bgcolor: brandColors.naver,
              '&:hover': { bgcolor: brandColors.naverHover },
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"
              />
            </svg>
          </IconButton>

          {/* 구글 */}
          <IconButton
            onClick={handleGoogleLogin}
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#fff',
              border: '1px solid #ddd',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </IconButton>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* 비회원 주문조회 */}
      <Box sx={{ px: { xs: 2, md: 8 } }}>
        <Button
          fullWidth
          variant="contained"
          component={RouterLink}
          to="/order-lookup"
          sx={{
            bgcolor: '#888',
            color: '#fff',
            borderRadius: 0,
            py: 1.5,
            fontSize: '1rem',
            '&:hover': { bgcolor: '#666' },
          }}
        >
          비회원 주문조회
        </Button>
      </Box>
    </Container>
  )
}

export default LoginPage
