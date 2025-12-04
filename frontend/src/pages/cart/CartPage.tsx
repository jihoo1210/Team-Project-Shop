import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material'
import { fetchCartItems, toggleCartItem } from '@/api/itemApi'
import type { ItemSummary } from '@/types/api'

/**
 * ?•Î∞îÍµ¨Îãà ?òÏù¥ÏßÄ
 * SPEC: /cart
 * - ?•Î∞îÍµ¨Îãà ?ÅÌíà Î¶¨Ïä§??(Ï≤¥ÌÅ¨Î∞ïÏä§, ?ÅÌíà?ïÎ≥¥, ?òÎüâ Î≥ÄÍ≤? ??†ú)
 * - Í∞ÄÍ≤??ïÎ≥¥ (?ÅÌíà ?©Í≥Ñ, Î∞∞ÏÜ°Îπ? Ï¥?Í≤∞Ï†ú ?àÏ†ï Í∏àÏï°)
 * - ?ÑÏ≤¥ ?†ÌÉù/??†ú
 * - Ï£ºÎ¨∏?òÍ∏∞ Î≤ÑÌäº ??/orderÎ°??¥Îèô
 * 
 * [SPEC Í∑úÏπô] OrderPage??CartPageÎ•?Î∞òÎìú??Í±∞Ï≥ê ÏßÑÏûÖ
 */

interface CartItem extends ItemSummary {
  id: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
  isSelected: boolean
}

const SHIPPING_FEE = 3000
const FREE_SHIPPING_THRESHOLD = 50000

const CartPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // ?•Î∞îÍµ¨Îãà Ï°∞Ìöå
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setLoading(true)
        const data = await fetchCartItems({ page: 0, size: 100 })
        // API ?ëÎãµ??CartItem?ºÎ°ú Î≥Ä??
        const items: CartItem[] = data.map((item, index) => ({
          ...item,
          id: item.sku || String(index),
          quantity: 1,
          selectedColor: item.colorList?.[0],
          selectedSize: item.sizeList?.[0],
          isSelected: true,
        }))
        setCartItems(items)
      } catch (err) {
        console.error('?•Î∞îÍµ¨Îãà Ï°∞Ìöå ?§Ìå®:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCartItems()
  }, [])

  // ?ÑÏ≤¥ ?†ÌÉù ?¨Î?
  const isAllSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected)

  // ?ÑÏ≤¥ ?†ÌÉù/?¥Ï†ú
  const handleSelectAll = () => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, isSelected: !isAllSelected }))
    )
  }

  // Í∞úÎ≥Ñ ?†ÌÉù/?¥Ï†ú
  const handleSelectItem = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    )
  }

  // ?òÎüâ Î≥ÄÍ≤?
  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  // Í∞úÎ≥Ñ ??†ú
  const handleDeleteItem = async (id: string) => {
    try {
      await toggleCartItem(id)
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error('??†ú ?§Ìå®:', err)
    }
  }

  // ?†ÌÉù ??™© ??†ú
  const handleDeleteSelected = async () => {
    const selectedItems = cartItems.filter((item) => item.isSelected)
    if (selectedItems.length === 0) {
      alert('?†ÌÉù???ÅÌíà???ÜÏäµ?àÎã§.')
      return
    }
    try {
      await Promise.all(selectedItems.map((item) => toggleCartItem(item.id)))
      setCartItems((prev) => prev.filter((item) => !item.isSelected))
    } catch (err) {
      console.error('??†ú ?§Ìå®:', err)
    }
  }

  // ?†Ïù∏Í∞Ä Í≥ÑÏÇ∞
  const getDiscountedPrice = (item: CartItem) => {
    if (item.discount_percent > 0) {
      return item.price * (1 - item.discount_percent / 100)
    }
    return item.price
  }

  // ?†ÌÉù???ÅÌíà ?©Í≥Ñ
  const selectedItems = cartItems.filter((item) => item.isSelected)
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * item.quantity,
    0
  )
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const totalPrice = subtotal + shippingFee

  // Ï£ºÎ¨∏?òÍ∏∞ - /orderÎ°??¥Îèô
  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert('Ï£ºÎ¨∏???ÅÌíà???†ÌÉù?¥Ï£º?∏Ïöî.')
      return
    }
    // TODO: ?†ÌÉù???ÅÌíà ?ïÎ≥¥Î•?state??contextÎ°??ÑÎã¨
    navigate('/order')
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Î°úÎî© Ï§?..</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        ?•Î∞îÍµ¨Îãà
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            ?•Î∞îÍµ¨ÎãàÍ∞Ä ÎπÑÏñ¥?àÏäµ?àÎã§.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            ?ºÌïë?òÎü¨ Í∞ÄÍ∏?
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Ï¢åÏ∏°: ?•Î∞îÍµ¨Îãà ?ÅÌíà Î¶¨Ïä§??*/}
          <Grid item xs={12} md={8}>
            {/* ?ÑÏ≤¥ ?†ÌÉù / ?†ÌÉù ??†ú */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                  <Typography fontWeight={600}>
                    ?ÑÏ≤¥ ?†ÌÉù ({selectedItems.length}/{cartItems.length})
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteSelected}
                  startIcon={<DeleteIcon />}
                >
                  ?†ÌÉù ??†ú
                </Button>
              </Stack>
            </Paper>

            {/* ?ÅÌíà Î¶¨Ïä§??*/}
            <Stack spacing={2}>
              {cartItems.map((item) => (
                <Paper key={item.id} sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2}>
                    {/* Ï≤¥ÌÅ¨Î∞ïÏä§ */}
                    <Checkbox
                      checked={item.isSelected}
                      onChange={() => handleSelectItem(item.id)}
                    />

                    {/* ?ÅÌíà ?¥Î?ÏßÄ */}
                    <Box
                      component="img"
                      src={item.main_image_url || '/placeholder.jpg'}
                      alt={item.title}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 2,
                        bgcolor: 'grey.100',
                      }}
                    />

                    {/* ?ÅÌíà ?ïÎ≥¥ */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.brand}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.selectedColor && `?âÏÉÅ: ${item.selectedColor}`}
                        {item.selectedColor && item.selectedSize && ' / '}
                        {item.selectedSize && `?¨Ïù¥Ï¶? ${item.selectedSize}`}
                      </Typography>

                      {/* ?òÎüâ Ï°∞Ï†à */}
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ border: '1px solid', borderColor: 'grey.300' }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          sx={{ border: '1px solid', borderColor: 'grey.300' }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>

                    {/* Í∞ÄÍ≤?& ??†ú */}
                    <Box sx={{ textAlign: 'right' }}>
                      <IconButton
                        onClick={() => handleDeleteItem(item.id)}
                        sx={{ mb: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {item.discount_percent > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {(item.price * item.quantity).toLocaleString()}??
                        </Typography>
                      )}
                      <Typography variant="h6" fontWeight={700}>
                        {(getDiscountedPrice(item) * item.quantity).toLocaleString()}??
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>

          {/* ?∞Ï∏°: Í≤∞Ï†ú ?ïÎ≥¥ */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                Í≤∞Ï†ú ?ïÎ≥¥
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">?ÅÌíà ?©Í≥Ñ</Typography>
                  <Typography fontWeight={600}>
                    {subtotal.toLocaleString()}??
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Î∞∞ÏÜ°Îπ?/Typography>
                  <Typography fontWeight={600}>
                    {shippingFee === 0 ? 'Î¨¥Î£å' : `${shippingFee.toLocaleString()}??}
                  </Typography>
                </Stack>

                {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <Typography variant="caption" color="primary">
                    {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}????Íµ¨Îß§ ??Î¨¥Î£åÎ∞∞ÏÜ°!
                  </Typography>
                )}

                <Divider />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight={700}>
                    Ï¥?Í≤∞Ï†ú ?àÏ†ï Í∏àÏï°
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
                onClick={handleOrder}
                disabled={selectedItems.length === 0}
                sx={{ mt: 3, py: 1.5 }}
              >
                Ï£ºÎ¨∏?òÍ∏∞ ({selectedItems.length}Í∞?
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default CartPage

