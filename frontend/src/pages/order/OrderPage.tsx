import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Stack,
  Alert,
  Card,
  CardContent,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { createOrder } from '@/api/orderApi'
import { fetchUser } from '@/api/userApi'
import { useDaumPostcode } from '@/hooks/useDaumPostcode'

interface OrderItem {
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  option?: string
}

interface ShippingInfo {
  name: string
  phone: string
  zipcode: string
  address: string
  addressDetail: string
  memo: string
}

/**
 * 주문서/결제 페이지
 * SPEC: /order
 * - 주문 상품 요약
 * - 배송지 정보 (다음 우편번호 API 연동)
 * - 결제수단 선택
 * - 최종 결제 금액 및 약관 동의
 */
const OrderPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { openPostcode } = useDaumPostcode()

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    memo: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    payment: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.cartItems) {
      setOrderItems(location.state.cartItems)
    } else {
      // 데모용 mock 데이터
      const mockItems: OrderItem[] = [
        {
          productId: 1,
          productName: '프리미엄 무선 이어폰',
          productImage: 'https://via.placeholder.com/80',
          price: 89000,
          quantity: 1,
          option: '블랙 / M',
        },
        {
          productId: 2,
          productName: '스마트 워치 Pro',
          productImage: 'https://via.placeholder.com/80',
          price: 299000,
          quantity: 2,
          option: '실버 / L',
        },
      ]
      setOrderItems(mockItems)
    }
    fetchUserInfo()
  }, [location.state])

  const fetchUserInfo = async () => {
    try {
      const user = await fetchUser()
      setShippingInfo(prev => ({
        ...prev,
        name: user.username || '',
        phone: user.phone || '',
        zipcode: user.zipCode || '',
        address: user.addr || '',
      }))
    } catch {
      // 사용자 정보 없으면 빈 값 유지
    }
  }

  const handleInputChange = (field: keyof ShippingInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingInfo(prev => ({ ...prev, [field]: e.target.value }))
  }

  // 다음 우편번호 API 연동
  const handleSearchAddress = () => {
    openPostcode((result) => {
      setShippingInfo(prev => ({
        ...prev,
        zipcode: result.zonecode,
        address: result.address,
      }))
    })
  }

  // 약관 동의 처리
  const handleAgreementChange = (field: keyof typeof agreements) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked

    if (field === 'all') {
      setAgreements({
        all: checked,
        terms: checked,
        privacy: checked,
        payment: checked,
      })
    } else {
      const newAgreements = { ...agreements, [field]: checked }
      newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.payment
      setAgreements(newAgreements)
    }
  }

  const handleSubmit = async () => {
    // 배송 정보 유효성 검사
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setError('배송 정보를 모두 입력해주세요.')
      return
    }

    // 약관 동의 검사
    if (!agreements.terms || !agreements.privacy || !agreements.payment) {
      setError('필수 약관에 모두 동의해주세요.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const orderData = {
        addr: shippingInfo.address + ' ' + shippingInfo.addressDetail,
        zipCode: shippingInfo.zipcode,
        username: shippingInfo.name,
        orderDetail: shippingInfo.memo,
        call: shippingInfo.phone,
      }

      const result = await createOrder(orderData)
      navigate(`/order/complete?orderId=${result.order_id}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '주문 처리 중 오류가 발생했습니다.'
      setError(errorMessage)
      // 데모용 - 실패해도 완료 페이지로 이동
      setTimeout(() => {
        navigate('/order/complete?orderId=demo-order-001')
      }, 1000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 50000 ? 0 : 3000
  const totalPrice = subtotal + shippingFee

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  if (orderItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            주문할 상품이 없습니다.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/cart')} sx={{ mt: 2 }}>
            장바구니로 이동
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        주문/결제
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 주문 상품 목록 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                주문 상품 ({orderItems.length}개)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {orderItems.map((item) => (
                  <Box key={item.productId} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      component="img"
                      src={item.productImage}
                      alt={item.productName}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="medium">{item.productName}</Typography>
                      {item.option && (
                        <Typography variant="body2" color="text.secondary">
                          옵션: {item.option}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        수량: {item.quantity}개
                      </Typography>
                      <Typography fontWeight="bold" color="primary">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* 배송 정보 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                배송 정보
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="수령인"
                    fullWidth
                    required
                    value={shippingInfo.name}
                    onChange={handleInputChange('name')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="연락처"
                    fullWidth
                    required
                    placeholder="010-0000-0000"
                    value={shippingInfo.phone}
                    onChange={handleInputChange('phone')}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="우편번호"
                    fullWidth
                    value={shippingInfo.zipcode}
                    InputProps={{ readOnly: true }}
                    placeholder="주소 검색을 해주세요"
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Button 
                    variant="outlined" 
                    sx={{ height: '56px' }}
                    startIcon={<SearchIcon />}
                    onClick={handleSearchAddress}
                  >
                    주소 검색
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="주소"
                    fullWidth
                    required
                    value={shippingInfo.address}
                    InputProps={{ readOnly: true }}
                    placeholder="주소 검색을 통해 입력해주세요"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="상세주소"
                    fullWidth
                    value={shippingInfo.addressDetail}
                    onChange={handleInputChange('addressDetail')}
                    placeholder="상세주소를 입력해주세요"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="배송 메모"
                    fullWidth
                    placeholder="배송 시 요청사항을 입력해주세요"
                    value={shippingInfo.memo}
                    onChange={handleInputChange('memo')}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* 결제 수단 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                결제 수단
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel value="card" control={<Radio />} label="신용카드" />
                  <FormControlLabel value="bank" control={<Radio />} label="무통장입금" />
                  <FormControlLabel value="virtual" control={<Radio />} label="가상계좌" />
                  <FormControlLabel value="phone" control={<Radio />} label="휴대폰 결제" />
                </RadioGroup>
              </FormControl>
              {paymentMethod === 'bank' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  주문 후 24시간 이내에 입금해주세요. 미입금 시 자동 취소됩니다.
                </Alert>
              )}
              {paymentMethod === 'virtual' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  가상계좌는 주문 완료 후 발급됩니다. 7일 이내 입금해주세요.
                </Alert>
              )}
            </Paper>

            {/* 약관 동의 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                약관 동의
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.all}
                      onChange={handleAgreementChange('all')}
                    />
                  }
                  label={<Typography fontWeight="bold">전체 동의</Typography>}
                />
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.terms}
                      onChange={handleAgreementChange('terms')}
                    />
                  }
                  label="(필수) 이용약관 동의"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.privacy}
                      onChange={handleAgreementChange('privacy')}
                    />
                  }
                  label="(필수) 개인정보 처리방침 동의"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreements.payment}
                      onChange={handleAgreementChange('payment')}
                    />
                  }
                  label="(필수) 결제 서비스 이용 동의"
                />
              </FormGroup>
            </Paper>
          </Stack>
        </Grid>

        {/* 결제 정보 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                결제 정보
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">상품 금액</Typography>
                  <Typography fontWeight={600}>{formatPrice(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">배송비</Typography>
                  <Typography fontWeight={600}>
                    {shippingFee === 0 ? (
                      <Box component="span" sx={{ color: 'success.main' }}>무료</Box>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </Typography>
                </Box>
                {subtotal < 50000 && (
                  <Typography variant="caption" color="text.secondary">
                    * 5만원 이상 구매 시 무료배송
                  </Typography>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">총 결제 금액</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {formatPrice(totalPrice)}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !agreements.terms || !agreements.privacy || !agreements.payment}
              >
                {isSubmitting ? '처리 중...' : `${formatPrice(totalPrice)} 결제하기`}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default OrderPage

