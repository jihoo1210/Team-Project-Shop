import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Checkbox,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { fetchCartItems as fetchCartApi, toggleCartItem } from '@/api/itemApi'

interface CartItem {
  cartItemId: string
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  stock: number
  selected: boolean
}

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectAll, setSelectAll] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetchCartApi()
      const items: CartItem[] = (response.content || []).map((item: any) => ({
        cartItemId: item.item_id,
        productId: item.item_id,
        productName: item.item_name || item.name || '상품명',
        productImage: item.main_image || item.image || 'https://placehold.co/100x100/png',
        price: item.price || 0,
        quantity: item.quantity || 1,
        stock: item.stock || 99,
        selected: true,
      }))
      setCartItems(items)
      setSelectAll(items.length > 0 && items.every((item) => item.selected))
    } catch {
      // Mock data for development
      const mockItems: CartItem[] = [
        {
          cartItemId: '1',
          productId: '1',
          productName: '프리미엄 무선 이어폰',
          productImage: 'https://placehold.co/100x100/png',
          price: 89000,
          quantity: 1,
          stock: 50,
          selected: true,
        },
        {
          cartItemId: '2',
          productId: '2',
          productName: '스마트 워치 Pro',
          productImage: 'https://placehold.co/100x100/png',
          price: 299000,
          quantity: 2,
          stock: 30,
          selected: true,
        },
        {
          cartItemId: '3',
          productId: '3',
          productName: '노이즈 캔슬링 헤드폰',
          productImage: 'https://placehold.co/100x100/png',
          price: 199000,
          quantity: 1,
          stock: 20,
          selected: true,
        },
      ]
      setCartItems(mockItems)
      setSelectAll(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setCartItems((items) => items.map((item) => ({ ...item, selected: checked })))
  }

  const handleSelectItem = (cartItemId: string, checked: boolean) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, selected: checked } : item
      )
    )
    const updatedItems = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, selected: checked } : item
    )
    setSelectAll(updatedItems.every((item) => item.selected))
  }

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId)
    if (!item) return

    if (newQuantity < 1) newQuantity = 1
    if (newQuantity > item.stock) {
      setError(`재고가 부족합니다. (최대 ${item.stock}개)`)
      return
    }

    setCartItems((items) =>
      items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: newQuantity } : i
      )
    )
  }

  const handleDeleteClick = (cartItemId: string) => {
    setItemToDelete(cartItemId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return

    try {
      await toggleCartItem(itemToDelete)
      setCartItems((items) => items.filter((item) => item.cartItemId !== itemToDelete))
    } catch {
      // Delete locally anyway for demo
      setCartItems((items) => items.filter((item) => item.cartItemId !== itemToDelete))
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleDeleteSelected = async () => {
    const selectedIds = cartItems.filter((item) => item.selected).map((item) => item.cartItemId)
    if (selectedIds.length === 0) {
      setError('선택된 상품이 없습니다.')
      return
    }

    try {
      // 선택된 아이템 각각 삭제
      await Promise.all(selectedIds.map((id) => toggleCartItem(id)))
      setCartItems((items) => items.filter((item) => !item.selected))
    } catch {
      // Delete locally anyway for demo
      setCartItems((items) => items.filter((item) => !item.selected))
    }
  }

  const handleOrder = () => {
    const selectedItems = cartItems.filter((item) => item.selected)
    if (selectedItems.length === 0) {
      setError('주문할 상품을 선택해주세요.')
      return
    }
    // Navigate to order page with selected items
    navigate('/order', { state: { cartItems: selectedItems } })
  }

  const selectedItems = cartItems.filter((item) => item.selected)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + deliveryFee

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CartIcon fontSize="large" />
        장바구니
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            장바구니가 비어있습니다
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
            쇼핑하러 가기
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ overflow: 'hidden' }}>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <Typography>
                    전체 선택 ({selectedItems.length}/{cartItems.length})
                  </Typography>
                </Box>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                >
                  선택 삭제
                </Button>
              </Box>
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell>상품 정보</TableCell>
                      <TableCell align="center">수량</TableCell>
                      <TableCell align="right">가격</TableCell>
                      <TableCell align="center">삭제</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.cartItemId} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={item.selected}
                            onChange={(e) =>
                              handleSelectItem(item.cartItemId, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src={item.productImage}
                              alt={item.productName}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                cursor: 'pointer',
                              }}
                              onClick={() => navigate(`/products/${item.productId}`)}
                            />
                            <Box>
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                                sx={{
                                  cursor: 'pointer',
                                  '&:hover': { color: 'primary.main' },
                                }}
                                onClick={() => navigate(`/products/${item.productId}`)}
                              >
                                {item.productName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatPrice(item.price)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(item.cartItemId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value)
                                if (!isNaN(val))
                                  handleQuantityChange(item.cartItemId, val)
                              }}
                              inputProps={{
                                style: { textAlign: 'center', width: 40 },
                                min: 1,
                                max: item.stock,
                              }}
                              sx={{ mx: 1 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(item.cartItemId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold">
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(item.cartItemId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

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
                    <Typography>{formatPrice(totalPrice)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">배송비</Typography>
                    <Typography>
                      {deliveryFee === 0 ? (
                        <Box component="span" sx={{ color: 'success.main' }}>
                          무료
                        </Box>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </Typography>
                  </Box>
                  {deliveryFee > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      * 50,000원 이상 구매 시 무료배송
                    </Typography>
                  )}
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                      총 결제 금액
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatPrice(finalPrice)}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, py: 1.5 }}
                  onClick={handleOrder}
                  disabled={selectedItems.length === 0}
                >
                  {selectedItems.length > 0
                    ? `${selectedItems.length}개 상품 주문하기`
                    : '상품을 선택해주세요'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>상품 삭제</DialogTitle>
        <DialogContent>
          <Typography>이 상품을 장바구니에서 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CartPage

