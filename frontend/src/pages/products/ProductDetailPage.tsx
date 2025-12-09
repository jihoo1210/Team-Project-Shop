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
import { fetchItemDetail, toggleFavoriteItem } from '@/api/itemApi'
import { useCart } from '@/hooks/useCart'
import ReviewSection from '@/components/review/ReviewSection'
import type { ItemDetail, ReviewListItem } from '@/types/api'

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

// Mock 상품 데이터 (백엔드 미실행 시 fallback용)
const mockProducts: Record<string, ItemDetail> = {
  'SKU-1001': {
    sku: 'SKU-1001',
    title: '에센셜 후드 티셔츠',
    price: 89000,
    discount_percent: 15,
    brand: 'MyShop Originals',
    description: '부드러운 코튼 소재의 에센셜 후드 티셔츠입니다. 편안한 착용감과 세련된 디자인으로 일상에서 편하게 입을 수 있습니다.',
    colorList: ['블랙', '화이트', '그레이'],
    sizeList: ['S', 'M', 'L', 'XL'],
    imageList: ['https://placehold.co/600x600/png', 'https://placehold.co/600x601/png', 'https://placehold.co/600x602/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  'SKU-1002': {
    sku: 'SKU-1002',
    title: '클래식 체크 코트',
    price: 219000,
    discount_percent: 10,
    brand: 'Premium Line',
    description: '클래식한 체크 패턴의 고급스러운 코트입니다. 겨울철 따뜻하게 입을 수 있는 보온성 좋은 소재로 제작되었습니다.',
    colorList: ['베이지', '브라운'],
    sizeList: ['S', 'M', 'L'],
    imageList: ['https://placehold.co/600x600/png', 'https://placehold.co/600x601/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  'SKU-1003': {
    sku: 'SKU-1003',
    title: '데일리 스니커즈',
    price: 129000,
    discount_percent: 0,
    brand: 'Flexfit',
    description: '편안한 착화감의 데일리 스니커즈입니다. 가볍고 쿠션감이 좋아 오래 걸어도 편안합니다.',
    colorList: ['화이트', '블랙'],
    sizeList: ['230', '240', '250', '260', '270', '280'],
    imageList: ['https://placehold.co/600x600/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  'SKU-1004': {
    sku: 'SKU-1004',
    title: '미니멀 백팩',
    price: 79000,
    discount_percent: 20,
    brand: 'Urban Style',
    description: '심플하고 실용적인 미니멀 백팩입니다. 넉넉한 수납공간과 편안한 착용감을 제공합니다.',
    colorList: ['블랙', '네이비', '그레이'],
    sizeList: [],
    imageList: ['https://placehold.co/600x600/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  'SKU-1005': {
    sku: 'SKU-1005',
    title: '프리미엄 청바지',
    price: 159000,
    discount_percent: 0,
    brand: 'Denim Pro',
    description: '프리미엄 데님 소재의 청바지입니다. 편안한 핏과 내구성이 뛰어납니다.',
    colorList: ['인디고', '라이트블루'],
    sizeList: ['28', '30', '32', '34', '36'],
    imageList: ['https://placehold.co/600x600/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  'SKU-1006': {
    sku: 'SKU-1006',
    title: '캐주얼 스웨터',
    price: 69000,
    discount_percent: 25,
    brand: 'Cozy Wear',
    description: '부드러운 니트 소재의 캐주얼 스웨터입니다. 따뜻하고 포근한 착용감을 제공합니다.',
    colorList: ['크림', '베이지', '차콜'],
    sizeList: ['S', 'M', 'L', 'XL'],
    imageList: ['https://placehold.co/600x600/png'],
    reviewList: [],
    savedInLikes: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // 장바구니 훅
  const { addToCart } = useCart()

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
      console.error('API 에러:', err)
      // Mock 데이터로 fallback (백엔드 미실행 시)
      const mockData = mockProducts[id]
      if (mockData) {
        setProduct(mockData)
        setIsFavorite(mockData.savedInLikes ?? false)
        setReviews([])
        if (mockData.colorList?.length > 0) {
          setSelectedColor(mockData.colorList[0])
        }
        if (mockData.sizeList?.length > 0) {
          setSelectedSize(mockData.sizeList[0])
        }
      } else {
        setError('상품 정보를 불러오는데 실패했습니다.')
      }
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
    if (!id || !product) return
    // 옵션이 있는 경우에만 선택 체크
    const hasColorOption = product?.colorList && product.colorList.length > 0
    const hasSizeOption = product?.sizeList && product.sizeList.length > 0

    if (hasColorOption && !selectedColor) {
      alert('색상을 선택해주세요.')
      return
    }
    if (hasSizeOption && !selectedSize) {
      alert('사이즈를 선택해주세요.')
      return
    }
    try {
      // useCart 훅을 사용하여 장바구니에 추가
      // 원가와 할인율을 별도로 저장하여 Whop 결제 시 정확한 정보 전달
      const cartItem = {
        productId: id,
        productName: product.title,
        productImage: product.imageList?.[0] || 'https://placehold.co/100x100/png',
        price: product.price ?? 0, // 원가
        quantity: quantity,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        discountRate: product.discount_percent ?? 0, // 할인율
      }
      await addToCart(cartItem)
      alert('장바구니에 담았습니다.')
    } catch (err) {
      console.error('장바구니 담기 실패:', err)
      alert('장바구니 담기에 실패했습니다.')
    }
  }

  // 바로구매: 장바구니에 담고 /cart로 이동
  // SPEC [중요 UX 규칙]: OrderPage는 항상 CartPage에서 "주문하기"를 통해서만 진입
  const handleBuyNow = async () => {
    if (!id || !product) return
    // 옵션이 있는 경우에만 선택 체크
    const hasColorOption = product?.colorList && product.colorList.length > 0
    const hasSizeOption = product?.sizeList && product.sizeList.length > 0

    if (hasColorOption && !selectedColor) {
      alert('색상을 선택해주세요.')
      return
    }
    if (hasSizeOption && !selectedSize) {
      alert('사이즈를 선택해주세요.')
      return
    }
    try {
      // useCart 훅을 사용하여 장바구니에 추가 후 이동
      // 원가와 할인율을 별도로 저장하여 Whop 결제 시 정확한 정보 전달
      const cartItem = {
        productId: id,
        productName: product.title,
        productImage: product.imageList?.[0] || 'https://placehold.co/100x100/png',
        price: product.price ?? 0, // 원가
        quantity: quantity,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        discountRate: product.discount_percent ?? 0, // 할인율
      }
      await addToCart(cartItem)
      navigate('/cart')
    } catch (err) {
      console.error('바로구매 실패:', err)
      alert('처리에 실패했습니다.')
    }
  }

  // 로딩 또는 product가 없는 경우 early return
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

  // 에러 상태 또는 상품 없음 - product가 null/undefined인 경우
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

  // 여기서 product는 확실히 존재 - 가격 계산
  const productPrice = product.price ?? 0
  const discountPercent = product.discount_percent ?? 0
  const finalPrice = discountPercent > 0 
    ? productPrice * (1 - discountPercent / 100) 
    : productPrice

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
            {discountPercent > 0 && (
              <Chip
                label={`${discountPercent}% OFF`}
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
            {discountPercent > 0 && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {productPrice.toLocaleString()}원
                </Typography>
                <Chip
                  label={`${discountPercent}%`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            )}
            <Typography variant="h4" fontWeight={800} color="primary">
              {finalPrice.toLocaleString()}원
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
                {(finalPrice * quantity).toLocaleString()}원
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
