import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { join } from '@/api/userApi'

/**
 * 회원가입 페이지
 * 백엔드 API: POST /api/auth/signup
 * REQUEST: { email, password, passwordConfirm, username, zipCode, addr, addrDetail, phone }
 */

const SignupPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    username: '',
    phone: '',
    zipCode: '',
    addr: '',
    addrDetail: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  // 주소 검색 (다음 우편번호 API)
  const handleSearchAddress = () => {
    const daum = (window as unknown as { daum?: { Postcode: new (options: { oncomplete: (data: { zonecode: string; address: string }) => void }) => { open: () => void } } }).daum
    if (daum?.Postcode) {
      new daum.Postcode({
        oncomplete: (data) => {
          setFormData((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            addr: data.address,
          }))
        },
      }).open()
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!formData.email || !formData.password || !formData.username) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    try {
      setIsLoading(true)
      await join({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        username: formData.username,
        phone: formData.phone,
        zipCode: formData.zipCode,
        addr: formData.addr,
        addrDetail: formData.addrDetail,
      })
      
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      const error = err as Error
      setError(error.message || '회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 4 }}>
          회원가입
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
              helperText="8자 이상 입력해주세요"
              fullWidth
              required
            />
            <TextField
              label="비밀번호 확인"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange('passwordConfirm')}
              fullWidth
              required
            />
            <TextField
              label="이름"
              value={formData.username}
              onChange={handleChange('username')}
              fullWidth
              required
            />
            <TextField
              label="전화번호"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="010-0000-0000"
              fullWidth
            />

            {/* 주소 입력 */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="우편번호"
                value={formData.zipCode}
                onChange={handleChange('zipCode')}
                sx={{ width: 150 }}
                InputProps={{ readOnly: true }}
              />
              <Button variant="outlined" onClick={handleSearchAddress}>
                주소 검색
              </Button>
            </Stack>
            <TextField
              label="주소"
              value={formData.addr}
              onChange={handleChange('addr')}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="상세 주소"
              value={formData.addrDetail}
              onChange={handleChange('addrDetail')}
              fullWidth
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
              {isLoading ? '처리 중...' : '회원가입'}
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <Typography color="text.secondary">이미 계정이 있으신가요?</Typography>
          <Link component={RouterLink} to="/login" underline="hover" sx={{ ml: 1 }}>
            로그인
          </Link>
        </Stack>
      </Paper>
    </Container>
  )
}

export default SignupPage
