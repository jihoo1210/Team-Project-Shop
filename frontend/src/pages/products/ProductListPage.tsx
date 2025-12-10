import {
  Box,
  Chip,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material'
import { AccessTime as TimeIcon, FavoriteBorder as HeartIcon } from '@mui/icons-material'
import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagination from '@/components/common/Pagination'
import { fetchItems } from '@/api/itemApi'
import type { ProductSummary } from '@/types/product'

type SortOption = 'popular' | 'latest' | 'price-low' | 'price-high' | 'review'

// 메인 카테고리
const mainCategories = [
  { id: 'all', label: '전체' },
  { id: 'clothing', label: '의류' },
  { id: 'bag', label: '가방' },
  { id: 'shoes', label: '신발' },
  { id: 'accessory', label: '액세서리' },
  { id: 'beauty', label: '뷰티' },
  { id: 'life', label: '라이프' },
  { id: 'kids', label: '키즈' },
  { id: 'leisure', label: '레저' },
  { id: 'global', label: '해외브랜드' },
]

// 서브 카테고리
const subCategories: Record<string, { id: string; label: string }[]> = {
  all: [],
  clothing: [
    { id: 'all', label: '전체' },
    { id: 'outer', label: '아우터' },
    { id: 'dress', label: '원피스' },
    { id: 'blouse', label: '블라우스' },
    { id: 'shirt', label: '셔츠' },
    { id: 'tshirt', label: '티셔츠' },
    { id: 'knit', label: '니트' },
    { id: 'skirt', label: '스커트' },
    { id: 'pants', label: '팬츠' },
    { id: 'denim', label: '데님' },
    { id: 'loungewear', label: '라운지웨어' },
    { id: 'underwear', label: '언더웨어' },
  ],
  bag: [
    { id: 'all', label: '전체' },
    { id: 'tote', label: '토트백' },
    { id: 'shoulder', label: '숄더백' },
    { id: 'cross', label: '크로스백' },
    { id: 'backpack', label: '백팩' },
    { id: 'clutch', label: '클러치' },
  ],
  shoes: [
    { id: 'all', label: '전체' },
    { id: 'sneakers', label: '스니커즈' },
    { id: 'boots', label: '부츠' },
    { id: 'loafer', label: '로퍼' },
    { id: 'sandal', label: '샌들' },
    { id: 'heels', label: '힐' },
  ],
}

// 페이지 타이틀 매핑
const pageTitles: Record<string, { text: string; highlight?: string }> = {
  holiday: { text: '홀리', highlight: '데이' },
  best: { text: '베', highlight: '스트' },
  sale: { text: '세', highlight: '일' },
  new: { text: '신', highlight: '상' },
  exclusive: { text: '단', highlight: '독' },
  recommend: { text: '추', highlight: '천' },
  women: { text: '여', highlight: '성' },
  men: { text: '남', highlight: '성' },
  life: { text: '라이', highlight: '프' },
  beauty: { text: '뷰', highlight: '티' },
}

const ProductListPage = () => {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const sortParam = searchParams.get('sort')
  const searchTerm = searchParams.get('searchTerm')

  // 페이지 타이틀 결정
  const titleKey = sortParam || categoryParam || ''
  const titleData = pageTitles[titleKey]

  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [mainCategory, setMainCategory] = useState('clothing')
  const [subCategory, setSubCategory] = useState('all')
  const [ageFilter, setAgeFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('daily')

  const itemsPerPage = 12

  // 현재 시간 표시
  const currentTime = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const getSortParams = (sort: SortOption) => {
    switch (sort) {
      case 'latest':
        return { sortBy: 'created_at', sortDir: 'desc' }
      case 'price-low':
        return { sortBy: 'price', sortDir: 'asc' }
      case 'price-high':
        return { sortBy: 'price', sortDir: 'desc' }
      case 'review':
        return { sortBy: 'review_count', sortDir: 'desc' }
      case 'popular':
      default:
        return { sortBy: 'like_count', sortDir: 'desc' }
    }
  }

  const loadProducts = useCallback(async () => {
    setLoading(true)

    try {
      const sortParams = getSortParams(sortBy)
      const response = await fetchItems({
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: searchTerm || undefined,
        category: categoryParam || (mainCategory !== 'all' ? mainCategory : undefined),
        ...sortParams,
      })

      const mappedProducts: ProductSummary[] = (response.content || []).map((item) => ({
        id: item.item_id,
        title: item.item_name || item.title || '상품명',
        brand: item.brand || '',
        price: item.price,
        discountPercent: item.discount_percent,
        scoreAverage: item.score_average || item.scoreAverage,
        reviewCount: item.review_count || item.reviewCount,
        likeCount: item.like_count || item.likeCount,
        mainImage: item.main_image || item.main_image_url || 'https://placehold.co/400x500/png',
        badges: item.badges,
      }))

      setProducts(mappedProducts)
      setTotalCount(response.totalElements || 0)
    } catch (err) {
      console.error('상품 목록 로드 실패:', err)
      setProducts([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, searchTerm, categoryParam, mainCategory])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const getDiscountedPrice = (price: number, discountPercent?: number) => {
    if (!discountPercent) return price
    return Math.floor(price * (1 - discountPercent / 100))
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 페이지 타이틀 */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        {searchTerm ? (
          `"${searchTerm}" 검색 결과`
        ) : titleData ? (
          <>
            <Box component="span" sx={{ color: '#1a1a1a' }}>{titleData.text}</Box>
            <Box component="span" sx={{ color: '#ff6b00' }}>{titleData.highlight}</Box>
          </>
        ) : (
          '전체 상품'
        )}
      </Typography>

      {/* 메인 카테고리 탭 */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {mainCategories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            onClick={() => {
              setMainCategory(cat.id)
              setSubCategory('all')
              setCurrentPage(1)
            }}
            sx={{
              borderRadius: '20px',
              px: 2,
              py: 2.5,
              fontSize: '0.95rem',
              fontWeight: mainCategory === cat.id ? 600 : 400,
              bgcolor: mainCategory === cat.id ? '#1a1a1a' : '#fff',
              color: mainCategory === cat.id ? '#fff' : '#1a1a1a',
              border: '1px solid',
              borderColor: mainCategory === cat.id ? '#1a1a1a' : '#ddd',
              '&:hover': {
                bgcolor: mainCategory === cat.id ? '#333' : '#f5f5f5',
              },
            }}
          />
        ))}
      </Stack>

      {/* 서브 카테고리 */}
      {subCategories[mainCategory]?.length > 0 && (
        <Stack
          direction="row"
          spacing={3}
          sx={{
            mb: 4,
            pb: 2,
            borderBottom: '1px solid #eee',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {subCategories[mainCategory].map((sub) => (
            <Typography
              key={sub.id}
              onClick={() => {
                setSubCategory(sub.id)
                setCurrentPage(1)
              }}
              sx={{
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: subCategory === sub.id ? 600 : 400,
                color: subCategory === sub.id ? '#1a1a1a' : '#888',
                '&:hover': { color: '#1a1a1a' },
              }}
            >
              {sub.label}
            </Typography>
          ))}
        </Stack>
      )}

      {/* 필터 바 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* 좌측: 시간 정보 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <TimeIcon sx={{ fontSize: 18, color: '#888' }} />
          <Typography variant="body2" color="text.secondary">
            {currentTime} 기준
          </Typography>
        </Stack>

        {/* 우측: 필터 옵션들 */}
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="all">전체 연령</MenuItem>
              <MenuItem value="10s">10대</MenuItem>
              <MenuItem value="20s">20대</MenuItem>
              <MenuItem value="30s">30대</MenuItem>
              <MenuItem value="40s">40대</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="all">전체 성별</MenuItem>
              <MenuItem value="female">여성</MenuItem>
              <MenuItem value="male">남성</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="daily">일간</MenuItem>
              <MenuItem value="weekly">주간</MenuItem>
              <MenuItem value="monthly">월간</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* 상품 그리드 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">
            상품이 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                <Box
                  component={Link}
                  to={`/products/${product.id}`}
                  sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {/* 상품 이미지 */}
                  <Box sx={{ position: 'relative', mb: 1.5 }}>
                    {/* 순위 배지 */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        width: 28,
                        height: 28,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    >
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </Box>

                    {/* 이미지 */}
                    <Box
                      component="img"
                      src={product.mainImage}
                      alt={product.title}
                      sx={{
                        width: '100%',
                        aspectRatio: '3/4',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />

                    {/* 찜 버튼 */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: '#fff',
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HeartIcon sx={{ fontSize: 18 }} />
                    </Box>
                  </Box>

                  {/* 홀리데이 태그 */}
                  {(sortParam === 'best' || categoryParam === 'holiday') && (
                    <Chip
                      label="홀리데이"
                      size="small"
                      sx={{
                        bgcolor: '#ff6b00',
                        color: '#fff',
                        fontSize: '0.7rem',
                        height: 20,
                        mb: 0.5,
                      }}
                    />
                  )}

                  {/* 브랜드명 */}
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.brand || 'MyShop'}
                  </Typography>

                  {/* 상품명 */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.5,
                    }}
                  >
                    {product.title}
                  </Typography>

                  {/* 가격 */}
                  <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
                    {product.discountPercent && product.discountPercent > 0 && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{ textDecoration: 'line-through', color: '#999' }}
                        >
                          {formatPrice(product.price)}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="error">
                          {product.discountPercent}%
                        </Typography>
                      </>
                    )}
                    <Typography variant="body1" fontWeight={700}>
                      {formatPrice(getDiscountedPrice(product.price, product.discountPercent))}
                    </Typography>
                  </Stack>

                  {/* 평점 & 좋아요 */}
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    {product.scoreAverage && (
                      <Typography variant="caption" color="text.secondary">
                        ★ {product.scoreAverage.toFixed(1)}
                        {product.reviewCount && ` (${product.reviewCount.toLocaleString()})`}
                      </Typography>
                    )}
                    {product.likeCount && product.likeCount > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        ♥ {product.likeCount >= 9999 ? '9,999+' : product.likeCount.toLocaleString()}
                      </Typography>
                    )}
                  </Stack>

                  {/* 뱃지들 */}
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label="쿠폰" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    {index % 3 === 0 && (
                      <Chip label="단독" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                    {index % 4 === 0 && (
                      <Chip label="오늘출발" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18, color: '#2196f3', borderColor: '#2196f3' }} />
                    )}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Container>
  )
}

export default ProductListPage
