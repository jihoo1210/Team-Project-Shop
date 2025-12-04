import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Pagination,
} from '@mui/material'
import { fetchOrders, fetchOrderDetail } from '@/api/orderApi'
import type { OrderListItem, OrderDetailResponse } from '@/types/api'
import { brandColors } from '@/theme/tokens'

// 가상 주문 목록 (실제 API 연동 시 수정)
interface OrderItem extends OrderListItem {
  order_no: string
  status: string
  created_at: string
}

const MyOrdersPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailResponse | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders({ page: 0, size: 20 })
        // API 응답 구조에 맞게 조정
        setOrders(data as unknown as OrderItem[])
      } catch (error) {
        console.error('주문 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleViewDetail = async (orderNo: string) => {
    try {
      const detail = await fetchOrderDetail(orderNo)
      setSelectedOrder(detail)
      setDetailOpen(true)
    } catch (error) {
      console.error('주문 상세 로드 실패:', error)
      alert('주문 상세를 불러오는데 실패했습니다.')
    }
  }

  const getStatusChip = (status: string) => {
    const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error' }> = {
      pending: { label: '결제대기', color: 'warning' },
      paid: { label: '결제완료', color: 'primary' },
      shipping: { label: '배송중', color: 'primary' },
      delivered: { label: '배송완료', color: 'success' },
      cancelled: { label: '취소', color: 'error' },
    }
    const config = statusMap[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  const totalPages = Math.ceil(orders.length / pageSize)
  const displayedOrders = orders.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        주문 내역
      </Typography>

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid #E5E7EB',
            p: 8,
            textAlign: 'center',
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            주문 내역이 없습니다.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: '#374151' },
            }}
          >
            쇼핑하러 가기
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: '1px solid #E5E7EB' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>주문번호</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>상품정보</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    결제금액
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    상태
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    주문일
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    상세
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrders.map((order) => (
                  <TableRow key={order.order_no} hover>
                    <TableCell>
                      <Typography fontWeight={500} fontSize="0.875rem">
                        {order.order_no}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={order.main_img_url || '/placeholder.jpg'}
                          alt={order.title}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            bgcolor: '#F3F4F6',
                          }}
                        />
                        <Typography fontSize="0.875rem">{order.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        {formatPrice(order.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(order.status)}
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize="0.875rem" color="text.secondary">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => handleViewDetail(order.order_no)}
                      >
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* 주문 상세 다이얼로그 */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={600}>주문 상세</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              {/* 주문 상품 목록 */}
              <Typography fontWeight={600} sx={{ mb: 2 }}>
                주문 상품
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid #E5E7EB',
                  }}
                >
                  <Box
                    component="img"
                    src={item.main_img_url || '/placeholder.jpg'}
                    alt={item.title}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={500}>{item.title}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {item.color} / {item.size} / {item.number}개
                    </Typography>
                  </Box>
                  <Typography fontWeight={600}>
                    {formatPrice(item.totalPrice)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* 배송 정보 */}
              <Typography fontWeight={600} sx={{ mb: 2 }}>
                배송 정보
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography fontSize="0.875rem">
                  수령인: {selectedOrder.username}
                </Typography>
                <Typography fontSize="0.875rem">
                  연락처: {selectedOrder.call}
                </Typography>
                <Typography fontSize="0.875rem">
                  주소: ({selectedOrder.zip_code}) {selectedOrder.addr}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 결제 정보 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography fontWeight={600}>결제수단</Typography>
                <Typography>{selectedOrder.payment}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Typography fontWeight={600}>총 결제금액</Typography>
                <Typography fontWeight={700} fontSize="1.25rem" color="primary">
                  {formatPrice(selectedOrder.totalPrice)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyOrdersPage
