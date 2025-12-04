import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createOrder } from '@/api/orderApi'

/**
 * ì£¼ë¬¸??ê²°ì œ ?˜ì´ì§€
 * SPEC: /order
 * - ì£¼ë¬¸ ?í’ˆ ?”ì•½
 * - ë°°ì†¡ì§€ ?•ë³´ (?˜ë ¹?? ?°ë½ì²? ì£¼ì†Œ)
 * - ê²°ì œ?˜ë‹¨ ? íƒ
 * - ìµœì¢… ê²°ì œ ê¸ˆì•¡ ë°??½ê? ?™ì˜
 * - ì£¼ë¬¸ ?„ë£Œ ë²„íŠ¼ ??/order/completeë¡??´ë™
 * 
 * [SPEC ê·œì¹™] OrderPage??CartPage?ì„œë§?ì§„ì… ê°€??
 */

const OrderPage = () => {
  const navigate = useNavigate()

  // ë°°ì†¡ì§€ ?•ë³´
  const [shippingInfo, setShippingInfo] = useState({
    username: '',
    call: '',
    zipCode: '',
    addr: '',
    addrDetail: '',
  })

  // ê²°ì œ?˜ë‹¨
  const [paymentMethod, setPaymentMethod] = useState('card')

  // ?½ê? ?™ì˜
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    payment: false,
  })

  // ì²˜ë¦¬ ì¤?
  const [isSubmitting, setIsSubmitting] = useState(false)

  // TODO: CartPage?ì„œ ?„ë‹¬ë°›ì? ì£¼ë¬¸ ?í’ˆ ?•ë³´
  const orderItems = [
    {
      id: '1',
      title: '?í’ˆëª??ˆì‹œ',
      option: 'ë¸”ë™ / M',
      quantity: 1,
      price: 39000,
      image: '/placeholder.jpg',
    },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 50000 ? 0 : 3000
  const totalPrice = subtotal + shippingFee

  // ?…ë ¥ ?¸ë“¤??
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }))
  }

  // ì£¼ì†Œ ê²€??(?¤ìŒ ?°í¸ë²ˆí˜¸ API)
  const handleSearchAddress = () => {
    // @ts-ignore - ?¤ìŒ ?°í¸ë²ˆí˜¸ API
    if (window.daum?.Postcode) {
      // @ts-ignore
      new window.daum.Postcode({
        oncomplete: (data: { zonecode: string; address: string }) => {
          setShippingInfo((prev) => ({
            ...prev,
            zipCode: data.zonecode,
            addr: data.address,
          }))
        },
      }).open()
    } else {
      alert('ì£¼ì†Œ ê²€???œë¹„?¤ë? ë¶ˆëŸ¬?¤ëŠ” ì¤‘ì…?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.')
    }
  }

  // ?„ì²´ ?™ì˜
  const handleAllAgreement = () => {
    const newValue = !agreements.all
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
      payment: newValue,
    })
  }

  // ê°œë³„ ?™ì˜
  const handleAgreement = (field: 'terms' | 'privacy' | 'payment') => () => {
    const newAgreements = { ...agreements, [field]: !agreements[field] }
    newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.payment
    setAgreements(newAgreements)
  }

  // ì£¼ë¬¸ ?„ë£Œ
  const handleSubmitOrder = async () => {
    // ? íš¨??ê²€??
    if (!shippingInfo.username || !shippingInfo.call || !shippingInfo.zipCode || !shippingInfo.addr) {
      alert('ë°°ì†¡ì§€ ?•ë³´ë¥?ëª¨ë‘ ?…ë ¥?´ì£¼?¸ìš”.')
      return
    }
    if (!agreements.terms || !agreements.privacy || !agreements.payment) {
      alert('?„ìˆ˜ ?½ê????™ì˜?´ì£¼?¸ìš”.')
      return
    }

    try {
      setIsSubmitting(true)
      // SPEC: POST /api/order
      await createOrder({
        addr: `${shippingInfo.addr} ${shippingInfo.addrDetail}`,
        zipCode: shippingInfo.zipCode,
        username: shippingInfo.username,
        call: shippingInfo.call,
        orderDetail: JSON.stringify(orderItems),
      })
      // ì£¼ë¬¸ ?„ë£Œ ?˜ì´ì§€ë¡??´ë™
      navigate('/order/complete')
    } catch (err) {
      console.error('ì£¼ë¬¸ ?¤íŒ¨:', err)
      alert('ì£¼ë¬¸ ì²˜ë¦¬???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        ì£¼ë¬¸/ê²°ì œ
      </Typography>

      <Grid container spacing={4}>
        {/* ì¢Œì¸¡: ì£¼ë¬¸ ?•ë³´ ?…ë ¥ */}
        <Grid item xs={12} md={8}>
          {/* ì£¼ë¬¸ ?í’ˆ ?”ì•½ */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              ì£¼ë¬¸ ?í’ˆ ({orderItems.length}ê°?
            </Typography>
            <Stack spacing={2}>
              {orderItems.map((item) => (
                <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.option} / {item.quantity}ê°?
                    </Typography>
                  </Box>
                  <Typography fontWeight={700}>
                    {(item.price * item.quantity).toLocaleString()}??
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* ë°°ì†¡ì§€ ?•ë³´ */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              ë°°ì†¡ì§€ ?•ë³´
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="?˜ë ¹??
                value={shippingInfo.username}
                onChange={handleInputChange('username')}
                fullWidth
                required
              />
              <TextField
                label="?°ë½ì²?
                value={shippingInfo.call}
                onChange={handleInputChange('call')}
                placeholder="010-0000-0000"
                fullWidth
                required
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="?°í¸ë²ˆí˜¸"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange('zipCode')}
                  sx={{ width: 150 }}
                  InputProps={{ readOnly: true }}
                  required
                />
                <Button variant="outlined" onClick={handleSearchAddress}>
                  ì£¼ì†Œ ê²€??
                </Button>
              </Stack>
              <TextField
                label="ì£¼ì†Œ"
                value={shippingInfo.addr}
                onChange={handleInputChange('addr')}
                fullWidth
                InputProps={{ readOnly: true }}
                required
              />
              <TextField
                label="?ì„¸ ì£¼ì†Œ"
                value={shippingInfo.addrDetail}
                onChange={handleInputChange('addrDetail')}
                placeholder="???¸ìˆ˜ ???ì„¸ ì£¼ì†Œ"
                fullWidth
              />
            </Stack>
          </Paper>

          {/* ê²°ì œ?˜ë‹¨ ? íƒ */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              ê²°ì œ?˜ë‹¨
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel value="card" control={<Radio />} label="? ìš©/ì²´í¬ì¹´ë“œ" />
                <FormControlLabel value="bank" control={<Radio />} label="ë¬´í†µ?¥ì…ê¸? />
                <FormControlLabel value="virtual" control={<Radio />} label="ê°€?ê³„ì¢? />
              </RadioGroup>
            </FormControl>
            {paymentMethod === 'bank' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ì£¼ë¬¸ ??24?œê°„ ???…ê¸ˆ?´ì£¼?¸ìš”. ë¯¸ì…ê¸????ë™ ì·¨ì†Œ?©ë‹ˆ??
              </Typography>
            )}
          </Paper>

          {/* ?½ê? ?™ì˜ */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              ?½ê? ?™ì˜
            </Typography>
            <FormControlLabel
              control={
                <Checkbox checked={agreements.all} onChange={handleAllAgreement} />
              }
              label={<Typography fontWeight={600}>?„ì²´ ?™ì˜</Typography>}
            />
            <Divider sx={{ my: 1 }} />
            <Stack sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={agreements.terms} onChange={handleAgreement('terms')} />
                }
                label="(?„ìˆ˜) êµ¬ë§¤ì¡°ê±´ ?•ì¸ ë°?ê²°ì œì§„í–‰???™ì˜"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={agreements.privacy} onChange={handleAgreement('privacy')} />
                }
                label="(?„ìˆ˜) ê°œì¸?•ë³´ ?˜ì§‘ ë°??´ìš© ?™ì˜"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={agreements.payment} onChange={handleAgreement('payment')} />
                }
                label="(?„ìˆ˜) ê²°ì œ?€???œë¹„???´ìš©?½ê? ?™ì˜"
              />
            </Stack>
          </Paper>
        </Grid>

        {/* ?°ì¸¡: ê²°ì œ ê¸ˆì•¡ */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              ê²°ì œ ê¸ˆì•¡
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">?í’ˆ ê¸ˆì•¡</Typography>
                <Typography fontWeight={600}>{subtotal.toLocaleString()}??/Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">ë°°ì†¡ë¹?/Typography>
                <Typography fontWeight={600}>
                  {shippingFee === 0 ? 'ë¬´ë£Œ' : `${shippingFee.toLocaleString()}??}
                </Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  ìµœì¢… ê²°ì œ ê¸ˆì•¡
                </Typography>
                <Typography variant="h5" fontWeight={800} color="primary">
                  {totalPrice.toLocaleString()}??
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              sx={{ mt: 3, py: 1.5 }}
            >
              {isSubmitting ? 'ì²˜ë¦¬ ì¤?..' : `${totalPrice.toLocaleString()}??ê²°ì œ?˜ê¸°`}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default OrderPage

