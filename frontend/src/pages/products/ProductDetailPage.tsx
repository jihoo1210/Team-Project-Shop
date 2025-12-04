import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Rating,
  Select,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  FavoriteBorder,
  Favorite,
  ShoppingCartOutlined,
  LocalShipping,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { fetchItemDetail, toggleFavoriteItem, toggleCartItem } from '@/api/itemApi'
import ReviewSection from '@/components/review/ReviewSection'
import type { ItemDetail, ReviewListItem } from '@/types/api'

/**
 * 상품 상세 페이지
 * SPEC: /products/{id}
 * - 상품 이미지 슬라이더
 * - 기본 정보 영역 (상품명, 가격, 옵션, 수량)
 * - 액션 버튼 (장바구니 담기, 바로구매)
 * - 탭 구성 (상세설명, 리뷰, Q&A)
 * 
 * [중요 UX 규칙]
 * "바로구매" 버튼 클릭 시 /order로 직접 이동하지 않고,
 * 선택된 옵션/수량으로 장바구니에 담은 후 /cart 페이지로 이동한다.
 */

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 4 }}>
    {value === index && children}
  </Box>
)

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // 상품 상세 데이터
  const [product, setProduct] = useState<ItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 선택된 옵션
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  // 이미지 슬라이더
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // 탭 상태
  const [tabValue, setTabValue] = useState(0)

  // 즐겨찾기 상태
  const [isFavorite, setIsFavorite] = useState(false)

  // 리뷰 목록 (ReviewSection에서 변경 시 갱신)
  const [reviews, setReviews] = useState<ReviewListItem[]>([])

  // 상품 상세 조회 API 호출
  const loadProduct = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await fetchItemDetail(id)
      setProduct(data)
      setIsFavorite(data.savedInLikes ?? false)
      // reviewList를 ReviewListItem 형태로 변환
      setReviews(
        (data.reviewList || []).map((r, idx) => ({
          review_no: String(idx),
          writer_id: 'user',
          score: r.score,
          content: r.content,
          created_at: r.created_at,
          updated_at: r.updated_at,
        }))
      )
      
      // 기본 옵션 선택
      if (data.colorList?.length > 0) {
        setSelectedColor(data.colorList[0])
      }
      if (data.sizeList?.length > 0) {
        setSelectedSize(data.sizeList[0])
      }
    } catch (err) {
      setError('상품 정보를 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  // 리뷰 변경 시 재로드
  const handleReviewChange = () => {
    loadProduct()
  }

  // 수량 변경 핸들러
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  // 즐겨찾기 토글
  const handleToggleFavorite = async () => {
    if (!id) return
    try {
      await toggleFavoriteItem(id)
      setIsFavorite((prev) => !prev)
    } catch (err) {
      console.error('즐겨찾기 처리 실패:', err)
    }
  }

  // 장바구니 담기
  const handleAddToCart = async () => {
    if (!id) return
    if (!selectedColor || !selectedSize) {
      alert('옵션을 선택해주세요.')
      return
    }
    try {
      // SPEC: POST /api/item/cart/{itemId}/{isIgnore}
      // isIgnore가 false면 이미 있을 경우 알림, true면 무시하고 추가
      await toggleCartItem(id)
      alert('장바구니에 담았습니다.')
    } catch (err) {
      console.error('장바구니 담기 실패:', err)
      alert('장바구니 담기에 실패했습니다.')
    }
  }

  // 바로구매: 장바구니에 담고 /cart로 이동
  // SPEC [중요 UX 규칙]: OrderPage는 항상 CartPage에서 "주문하기"를 통해서만 진입
  const handleBuyNow = async () => {
    if (!id) return
    if (!selectedColor || !selectedSize) {
      alert('옵션을 선택해주세요.')
      return
    }
    try {
      await toggleCartItem(id)
      navigate('/cart')
    } catch (err) {
      console.error('바로구매 실패:', err)
      alert('처리에 실패했습니다.')
    }
  }

  // 할인가 계산
  const getDiscountedPrice = () => {
    if (!product) return 0
    if (product.discount_percent > 0) {
      return product.price * (1 - product.discount_percent / 100)
    }
    return product.price
  }

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={80} />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="30%" height={30} />
            <Skeleton variant="text" width="80%" height={50} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="50%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mt: 4 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  // 에러 상태
  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || '상품을 찾을 수 없습니다.'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          상품 목록으로 돌아가기
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs 네비게이션 */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          홈
        </Link>
        <Link component={RouterLink} to="/products" color="inherit" underline="hover">
          상품
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        {/* 좌측: 상품 이미지 슬라이더 */}
        <Grid item xs={12} md={6}>
          {/* 메인 이미지 */}
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'grey.100',
            }}
          >
            <Box
              component="img"
              src={product.imageList?.[selectedImageIndex] || '/placeholder.jpg'}
              alt={product.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* 할인 뱃지 */}
            {product.discount_percent > 0 && (
              <Chip
                label={`${product.discount_percent}% OFF`}
                color="error"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  fontWeight: 700,
                }}
              />
            )}
          </Box>

          {/* 썸네일 리스트 */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto' }}>
            {product.imageList?.map((img, index) => (
              <Box
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: selectedImageIndex === index ? '2px solid' : '1px solid',
                  borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300',
                  opacity: selectedImageIndex === index ? 1 : 0.7,
                  transition: 'all 0.2s',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* 우측: 상품 정보 영역 */}
        <Grid item xs={12} md={6}>
          {/* 브랜드 */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.brand}
          </Typography>

          {/* 상품명 */}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {product.title}
          </Typography>

          {/* 리뷰 평점 */}
          {product.reviewList && product.reviewList.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Rating
                value={
                  product.reviewList.reduce((acc, r) => acc + r.score, 0) /
                  product.reviewList.length
                }
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewList.length}개 리뷰)
              </Typography>
            </Stack>
          )}

          {/* 가격 */}
          <Box sx={{ mb: 3 }}>
            {product.discount_percent > 0 && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.price.toLocaleString()}원
                </Typography>
                <Chip
                  label={`${product.discount_percent}%`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            )}
            <Typography variant="h4" fontWeight={800} color="primary">
              {getDiscountedPrice().toLocaleString()}원
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 옵션 선택: 색상 */}
          {product.colorList && product.colorList.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>색상</InputLabel>
              <Select
                value={selectedColor}
                label="색상"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {product.colorList.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 옵션 선택: 사이즈 */}
          {product.sizeList && product.sizeList.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>사이즈</InputLabel>
              <Select
                value={selectedSize}
                label="사이즈"
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.sizeList.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* 수량 선택 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              수량
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                sx={{ border: '1px solid', borderColor: 'grey.300' }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                sx={{
                  minWidth: 50,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {quantity}
              </Typography>
              <IconButton
                onClick={() => handleQuantityChange(1)}
                sx={{ border: '1px solid', borderColor: 'grey.300' }}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* 총 금액 */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1">총 상품금액</Typography>
              <Typography variant="h5" fontWeight={800} color="primary">
                {(getDiscountedPrice() * quantity).toLocaleString()}원
              </Typography>
            </Stack>
          </Box>

          {/* 액션 버튼 */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            {/* 즐겨찾기 버튼 */}
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 1.5,
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>

            {/* 장바구니 담기 버튼 */}
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              sx={{ flex: 1, py: 1.5 }}
            >
              장바구니 담기
            </Button>

            {/* 바로구매 버튼 - SPEC: 장바구니에 담고 /cart로 이동 */}
            <Button
              variant="contained"
              size="large"
              onClick={handleBuyNow}
              sx={{ flex: 1, py: 1.5 }}
            >
              바로구매
            </Button>
          </Stack>

          {/* 배송 안내 */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary' }}>
            <LocalShipping fontSize="small" />
            <Typography variant="body2">무료배송 | 오늘 출발</Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* 탭 영역: 상세설명, 리뷰, Q&A */}
      <Box sx={{ mt: 8, borderTop: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="상세설명" />
          <Tab
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>리뷰</span>
                <Chip
                  label={product.reviewList?.length || 0}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.75rem' }}
                />
              </Stack>
            }
          />
          <Tab label="Q&A" />
        </Tabs>

        {/* 상세설명 탭 */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ minHeight: 300 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {product.description || '상품 상세 설명이 없습니다.'}
            </Typography>
          </Box>
        </TabPanel>

        {/* 리뷰 탭 */}
        <TabPanel value={tabValue} index={1}>
          <ReviewSection
            itemId={id!}
            reviews={reviews}
            onReviewChange={handleReviewChange}
          />
        </TabPanel>

        {/* Q&A 탭 */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ minHeight: 300, textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              상품 관련 문의는 게시판을 이용해주세요.
            </Typography>
            <Button
              component={RouterLink}
              to="/board/qna"
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Q&A 게시판 바로가기
            </Button>
          </Box>
        </TabPanel>
      </Box>

      {/* 연관 상품 영역 */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          이 상품과 비슷한 상품
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} sm={3} key={item}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 2 },
                }}
                onClick={() => navigate(`/products/${item}`)}
              >
                <Box
                  component="img"
                  src={`https://via.placeholder.com/300x300?text=Product+${item}`}
                  alt={`연관 상품 ${item}`}
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product?.brand || 'Brand'}
                  </Typography>
                  <Typography fontWeight={600} noWrap>
                    추천 상품 {item}
                  </Typography>
                  <Typography fontWeight={700} color="primary">
                    {(Math.floor(Math.random() * 100) * 1000 + 10000).toLocaleString()}원
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default ProductDetailPage
