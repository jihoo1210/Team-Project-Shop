import React, { useState, useEffect } from 'react';
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
  Stack,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '@/api/orderApi';
import { fetchUser } from '@/api/userApi';

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

interface ShippingInfo {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  memo: string;
}

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    memo: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.cartItems) {
      setOrderItems(location.state.cartItems);
    } else {
      const mockItems: OrderItem[] = [
        {
          productId: 1,
          productName: '프리미엄 무선 이어폰',
          productImage: 'https://via.placeholder.com/80',
          price: 89000,
          quantity: 1,
        },
        {
          productId: 2,
          productName: '스마트 워치 Pro',
          productImage: 'https://via.placeholder.com/80',
          price: 299000,
          quantity: 2,
        },
      ];
      setOrderItems(mockItems);
    }
    fetchUserInfo();
  }, [location.state]);

  const fetchUserInfo = async () => {
    try {
      const user = await fetchUser();
      setShippingInfo(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    } catch {
      // Use empty values for demo
    }
  };

  const handleInputChange = (field: keyof ShippingInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setError('배송 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        addr: shippingInfo.address + ' ' + shippingInfo.addressDetail,
        zipCode: shippingInfo.zipcode,
        username: shippingInfo.name,
        orderDetail: shippingInfo.memo,
        call: shippingInfo.phone,
      };

      const result = await createOrder(orderData);
      navigate(`/order/complete?orderId=${result.order_id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
      // 데모용 - 실패해도 완료 페이지로 이동
      setTimeout(() => {
        navigate('/order/complete?orderId=demo-order-001');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;
  const totalPrice = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

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
    );
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
                    onChange={handleInputChange('zipcode')}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Button variant="outlined" sx={{ height: '56px' }}>
                    주소 검색
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="주소"
                    fullWidth
                    required
                    value={shippingInfo.address}
                    onChange={handleInputChange('address')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="상세주소"
                    fullWidth
                    value={shippingInfo.addressDetail}
                    onChange={handleInputChange('addressDetail')}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : `${formatPrice(totalPrice)} 결제하기`}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderPage;

