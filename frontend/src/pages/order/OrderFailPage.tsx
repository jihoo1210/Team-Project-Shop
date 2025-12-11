import React from 'react'
import {
  Container,
  Typography,
  Paper,
  Button,
  Stack,
} from '@mui/material'
import { Error as ErrorIcon } from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'

const OrderFailPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const errorCode = searchParams.get('code') || 'UNKNOWN_ERROR'
  const errorMessage = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.'

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          결제에 실패했습니다
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          오류 코드: {errorCode}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/cart')}
          >
            장바구니로 돌아가기
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(-1)}
          >
            다시 시도하기
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default OrderFailPage
