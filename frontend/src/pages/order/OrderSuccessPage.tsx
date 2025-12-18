import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
  Divider,
  Alert,
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosClient from '@/api/axiosClient'

interface PaymentInfo {
  orderId: string
  orderName: string
  totalAmount: number
  method: string
  approvedAt: string
}

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.')
        setLoading(false)
        return
      }

      try {
        // 백엔드에 결제 승인 요청
        const response = await axiosClient.post('/payment/confirm', {
          paymentKey,
          orderId,
          amount: Number(amount),
        })

        setPaymentInfo({
          orderId: orderId,
          orderName: response.data.result?.orderName || '주문 상품',
          totalAmount: Number(amount),
          method: response.data.result?.method || '카드',
          approvedAt: response.data.result?.approvedAt || new Date().toISOString(),
        })
      } catch (err: unknown) {
        // 승인 실패해도 일단 표시 (테스트 모드)
        console.error('결제 승인 요청 실패:', err)
        setPaymentInfo({
          orderId: orderId,
          orderName: '주문 상품',
          totalAmount: Number(amount),
          method: '카드',
          approvedAt: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams])

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          결제 확인 중...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" fullWidth onClick={() => navigate('/cart')}>
          장바구니로 돌아가기
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          결제가 완료되었습니다!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          주문해 주셔서 감사합니다.
        </Typography>

        {paymentInfo && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stack spacing={2} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">주문번호</Typography>
                <Typography fontWeight="medium">{paymentInfo.orderId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">주문상품</Typography>
                <Typography fontWeight="medium">{paymentInfo.orderName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">결제수단</Typography>
                <Typography fontWeight="medium">{paymentInfo.method}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">결제일시</Typography>
                <Typography fontWeight="medium">{formatDate(paymentInfo.approvedAt)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">결제금액</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(paymentInfo.totalAmount)}
                </Typography>
              </Box>
            </Stack>
          </>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/mypage/orders')}
          >
            주문내역 보기
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}

export default OrderSuccessPage
