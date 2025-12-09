import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { fetchOrderDetail } from '@/api/orderApi'
import type { OrderDetailResponse } from '@/types/api'

export default function OrderCompletePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<OrderDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('주문 정보를 찾을 수 없습니다.')
      setLoading(false)
      return
    }

    const loadOrder = async () => {
      try {
        const data = await fetchOrderDetail(orderId)
        setOrder(data)
      } catch {
        setError('주문 정보를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>주문 정보를 불러오는 중...</Typography>
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || '주문 정보를 찾을 수 없습니다.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </Container>
    )
  }

  const totalAmount = order.items?.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  ) || 0

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {/* 주문 완료 아이콘 */}
        <CheckCircleOutlineIcon
          sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          주문이 완료되었습니다!
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          주문해 주셔서 감사합니다.
          <br />
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* 주문 정보 */}
        <Box sx={{ textAlign: 'left', mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            주문번호
          </Typography>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {order.order_id}
          </Typography>

          {order.created_at && (
            <>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                주문일시
              </Typography>
              <Typography>
                {new Date(order.created_at).toLocaleString('ko-KR')}
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 주문 상품 목록 */}
        {order.items && order.items.length > 0 && (
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              주문 상품
            </Typography>
            <List disablePadding>
              {order.items.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={item.item_name}
                    secondary={`수량: ${item.quantity}개`}
                  />
                  <Typography fontWeight="bold">
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()}원
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                총 결제금액
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {totalAmount.toLocaleString()}원
              </Typography>
            </Box>
          </Box>
        )}

        {/* 배송 정보 */}
        {(order.address || order.phone) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                배송 정보
              </Typography>
              {order.address && (
                <Typography color="text.secondary">{order.address}</Typography>
              )}
              {order.phone && (
                <Typography color="text.secondary">{order.phone}</Typography>
              )}
            </Box>
          </>
        )}

        {/* 버튼 영역 */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            component={RouterLink}
            to="/mypage/orders"
            variant="outlined"
            fullWidth
            startIcon={<ShoppingBagOutlinedIcon />}
          >
            주문내역 보기
          </Button>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            fullWidth
            startIcon={<HomeOutlinedIcon />}
          >
            쇼핑 계속하기
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
