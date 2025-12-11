import {
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  AccessTime as TimeIcon,
  FavoriteBorder as HeartIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagination from '@/components/common/Pagination'
import { fetchItems } from '@/api/itemApi'
import type { ProductSummary } from '@/types/product'
import { COLORS, type ColorKey } from '@/constants/colors'

type SortOption = 'popular' | 'latest' | 'price-low' | 'price-high' | 'review'

// 사이즈 옵션
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE'] as const

// 가격 범위 옵션
const PRICE_RANGES = [
  { label: '전체', min: 0, max: null },
  { label: '~5만원', min: 0, max: 50000 },
  { label: '5~10만원', min: 50000, max: 100000 },
  { label: '10~20만원', min: 100000, max: 200000 },
  { label: '20~30만원', min: 200000, max: 300000 },
  { label: '30만원~', min: 300000, max: null },
] as const

// 대분류 (MajorCategoryEnum)
const mainCategories = [
  { id: 'all', label: '전체' },
  { id: 'WOMEN', label: '여성' },
  { id: 'MEN', label: '남성' },
  { id: 'KIDS', label: '키즈' },
  { id: 'SHOES', label: '슈즈' },
  { id: 'BAGS', label: '가방' },
  { id: 'ACCESSORIES', label: '액세서리' },
]

// 중분류 (MiddleCategoryEnum)
const subCategories: Record<string, { id: string; label: string }[]> = {
  all: [],
  WOMEN: [
    { id: 'all', label: '전체' },
    { id: 'TOP', label: '상의' },
    { id: 'BOTTOM', label: '하의' },
    { id: 'OUTER', label: '아우터' },
    { id: 'DRESS', label: '원피스' },
    { id: 'SUIT', label: '정장' },
    { id: 'UNDERWEAR', label: '언더웨어' },
    { id: 'SPORTSWEAR', label: '스포츠웨어' },
  ],
  MEN: [
    { id: 'all', label: '전체' },
    { id: 'TOP', label: '상의' },
    { id: 'BOTTOM', label: '하의' },
    { id: 'OUTER', label: '아우터' },
    { id: 'SUIT', label: '정장' },
    { id: 'UNDERWEAR', label: '언더웨어' },
    { id: 'SPORTSWEAR', label: '스포츠웨어' },
  ],
  KIDS: [
    { id: 'all', label: '전체' },
    { id: 'TOP', label: '상의' },
    { id: 'BOTTOM', label: '하의' },
    { id: 'OUTER', label: '아우터' },
    { id: 'DRESS', label: '원피스' },
  ],
  SHOES: [
    { id: 'all', label: '전체' },
    { id: 'SNEAKERS', label: '스니커즈' },
    { id: 'BOOTS', label: '부츠' },
    { id: 'SANDALS', label: '샌들' },
    { id: 'LOAFERS', label: '로퍼' },
    { id: 'HEELS', label: '힐' },
  ],
  BAGS: [
    { id: 'all', label: '전체' },
    { id: 'BACKPACK', label: '백팩' },
    { id: 'CROSSBODY', label: '크로스백' },
    { id: 'TOTE', label: '토트백' },
    { id: 'CLUTCH', label: '클러치' },
    { id: 'WALLET', label: '지갑' },
  ],
  ACCESSORIES: [
    { id: 'all', label: '전체' },
    { id: 'HAT', label: '모자' },
    { id: 'SCARF', label: '스카프' },
    { id: 'BELT', label: '벨트' },
    { id: 'JEWELRY', label: '주얼리' },
    { id: 'WATCH', label: '시계' },
    { id: 'SUNGLASSES', label: '선글라스' },
  ],
}

// 페이지 타이틀 매핑
const pageTitles: Record<string, { text: string }> = {
  best: { text: '베스트' },
  sale: { text: '세일' },
  new: { text: '신상' },
  WOMEN: { text: '여성' },
  MEN: { text: '남성' },
  KIDS: { text: '키즈' },
  SHOES: { text: '슈즈' },
  BAGS: { text: '가방' },
  ACCESSORIES: { text: '액세서리' },
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
  const [mainCategory, setMainCategory] = useState('all')
  const [subCategory, setSubCategory] = useState('all')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])

  const itemsPerPage = 12

  // URL의 category 파라미터로 mainCategory 동기화
  useEffect(() => {
    if (categoryParam && mainCategories.some(cat => cat.id === categoryParam)) {
      setMainCategory(categoryParam)
      setSubCategory('all')
    }
  }, [categoryParam])

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

      // 필터 파라미터 구성
      const filterParams: Record<string, string | number | undefined> = {
        page: currentPage - 1,
        size: itemsPerPage,
        searchTerm: searchTerm || undefined,
        ...sortParams,
      }

      // 카테고리 필터
      if (mainCategory !== 'all') {
        filterParams.majorCategory = mainCategory
      }
      if (subCategory !== 'all') {
        filterParams.middleCategory = subCategory
      }

      // 색상 필터 (첫 번째 선택된 색상만 전달 - 백엔드가 단일 값만 지원)
      if (selectedColors.length > 0) {
        filterParams.color = selectedColors[0]
      }

      // 사이즈 필터 (첫 번째 선택된 사이즈만 전달)
      if (selectedSizes.length > 0) {
        filterParams.size = selectedSizes[0]
      }

      // 가격 필터 (최대 가격이 50만원 미만일 때만 전달)
      if (priceRange[1] < 500000) {
        filterParams.maxPrice = priceRange[1]
      }

      const response = await fetchItems(filterParams)

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
  }, [currentPage, sortBy, searchTerm, mainCategory, subCategory, selectedColors, selectedSizes, priceRange])

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
          </>
        ) : (
          '전체 상품'
        )}
      </Typography>

      {/* 모바일 필터 버튼 */}
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={() => setMobileFilterOpen(true)}
        sx={{
          display: { xs: 'flex', md: 'none' },
          mb: 2,
          borderColor: '#ddd',
          color: '#333',
        }}
      >
        필터
      </Button>

      {/* 모바일 필터 드로어 */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 3 }}>
          {/* 드로어 헤더 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>필터</Typography>
            <IconButton onClick={() => setMobileFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 메인 카테고리 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            카테고리
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 4 }}>
            {mainCategories.map((cat) => (
              <Typography
                key={cat.id}
                onClick={() => {
                  setMainCategory(cat.id)
                  setSubCategory('all')
                  setCurrentPage(1)
                }}
                sx={{
                  cursor: 'pointer',
                  py: 0.5,
                  fontSize: '0.9rem',
                  fontWeight: mainCategory === cat.id ? 600 : 400,
                  color: mainCategory === cat.id ? '#1a1a1a' : '#666',
                  '&:hover': { color: '#1a1a1a' },
                }}
              >
                {cat.label}
              </Typography>
            ))}
          </Stack>

          {/* 서브 카테고리 */}
          {subCategories[mainCategory]?.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                세부 카테고리
              </Typography>
              <Stack spacing={0.5} sx={{ mb: 4 }}>
                {subCategories[mainCategory].map((sub) => (
                  <Typography
                    key={sub.id}
                    onClick={() => {
                      setSubCategory(sub.id)
                      setCurrentPage(1)
                    }}
                    sx={{
                      cursor: 'pointer',
                      py: 0.5,
                      fontSize: '0.9rem',
                      fontWeight: subCategory === sub.id ? 600 : 400,
                      color: subCategory === sub.id ? '#1a1a1a' : '#666',
                      '&:hover': { color: '#1a1a1a' },
                    }}
                  >
                    {sub.label}
                  </Typography>
                ))}
              </Stack>
            </>
          )}

          {/* 색상 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            색상
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {(Object.keys(COLORS) as ColorKey[]).map((colorKey) => {
              const color = COLORS[colorKey]
              const isSelected = selectedColors.includes(colorKey)
              return (
                <Box
                  key={colorKey}
                  onClick={() => {
                    setSelectedColors(prev =>
                      isSelected
                        ? prev.filter(c => c !== colorKey)
                        : [...prev, colorKey]
                    )
                    setCurrentPage(1)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: isSelected ? '3px solid #1a1a1a' : '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  title={color.name}
                />
              )
            })}
          </Box>

          {/* 사이즈 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            사이즈
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size)
              return (
                <Chip
                  key={size}
                  label={size}
                  onClick={() => {
                    setSelectedSizes(prev =>
                      isSelected
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    )
                    setCurrentPage(1)
                  }}
                  sx={{
                    borderRadius: '4px',
                    fontWeight: isSelected ? 600 : 400,
                    bgcolor: isSelected ? '#1a1a1a' : '#fff',
                    color: isSelected ? '#fff' : '#666',
                    border: '1px solid',
                    borderColor: isSelected ? '#1a1a1a' : '#ddd',
                  }}
                />
              )
            })}
          </Box>

          {/* 가격 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            가격
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value / 10000).toFixed(0)}만원`}
              min={0}
              max={500000}
              step={10000}
              sx={{ color: '#1a1a1a' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {(priceRange[0] / 10000).toFixed(0)}만원
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(priceRange[1] / 10000).toFixed(0)}만원
              </Typography>
            </Box>
          </Box>

          {/* 적용 버튼 */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMobileFilterOpen(false)}
            sx={{ mt: 4, bgcolor: '#1a1a1a', '&:hover': { bgcolor: '#333' } }}
          >
            적용하기
          </Button>
        </Box>
      </Drawer>

      {/* 좌측 사이드바 + 우측 상품 그리드 레이아웃 */}
      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* 좌측 사이드바 */}
        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
          }}
        >
          {/* 메인 카테고리 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            카테고리
          </Typography>
          <Stack spacing={0.5} sx={{ mb: 4 }}>
            {mainCategories.map((cat) => (
              <Typography
                key={cat.id}
                onClick={() => {
                  setMainCategory(cat.id)
                  setSubCategory('all')
                  setCurrentPage(1)
                }}
                sx={{
                  cursor: 'pointer',
                  py: 0.5,
                  fontSize: '0.9rem',
                  fontWeight: mainCategory === cat.id ? 600 : 400,
                  color: mainCategory === cat.id ? '#1a1a1a' : '#666',
                  '&:hover': { color: '#1a1a1a' },
                }}
              >
                {cat.label}
              </Typography>
            ))}
          </Stack>

          {/* 서브 카테고리 */}
          {subCategories[mainCategory]?.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                세부 카테고리
              </Typography>
              <Stack spacing={0.5} sx={{ mb: 4 }}>
                {subCategories[mainCategory].map((sub) => (
                  <Typography
                    key={sub.id}
                    onClick={() => {
                      setSubCategory(sub.id)
                      setCurrentPage(1)
                    }}
                    sx={{
                      cursor: 'pointer',
                      py: 0.5,
                      fontSize: '0.9rem',
                      fontWeight: subCategory === sub.id ? 600 : 400,
                      color: subCategory === sub.id ? '#1a1a1a' : '#666',
                      '&:hover': { color: '#1a1a1a' },
                    }}
                  >
                    {sub.label}
                  </Typography>
                ))}
              </Stack>
            </>
          )}

          {/* 색상 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            색상
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {(Object.keys(COLORS) as ColorKey[]).map((colorKey) => {
              const color = COLORS[colorKey]
              const isSelected = selectedColors.includes(colorKey)
              return (
                <Box
                  key={colorKey}
                  onClick={() => {
                    setSelectedColors(prev =>
                      isSelected
                        ? prev.filter(c => c !== colorKey)
                        : [...prev, colorKey]
                    )
                    setCurrentPage(1)
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: isSelected ? '3px solid #1a1a1a' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  title={color.name}
                />
              )
            })}
          </Box>

          {/* 사이즈 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            사이즈
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
            {SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size)
              return (
                <Chip
                  key={size}
                  label={size}
                  onClick={() => {
                    setSelectedSizes(prev =>
                      isSelected
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    )
                    setCurrentPage(1)
                  }}
                  sx={{
                    borderRadius: '4px',
                    fontWeight: isSelected ? 600 : 400,
                    bgcolor: isSelected ? '#1a1a1a' : '#fff',
                    color: isSelected ? '#fff' : '#666',
                    border: '1px solid',
                    borderColor: isSelected ? '#1a1a1a' : '#ddd',
                    '&:hover': {
                      bgcolor: isSelected ? '#333' : '#f5f5f5',
                    },
                  }}
                />
              )
            })}
          </Box>

          {/* 가격 필터 */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            가격
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value / 10000).toFixed(0)}만원`}
              min={0}
              max={500000}
              step={10000}
              sx={{
                color: '#1a1a1a',
                '& .MuiSlider-thumb': {
                  bgcolor: '#fff',
                  border: '2px solid #1a1a1a',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {(priceRange[0] / 10000).toFixed(0)}만원
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(priceRange[1] / 10000).toFixed(0)}만원
              </Typography>
            </Box>
          </Box>
          <Stack spacing={0.5} sx={{ mb: 4 }}>
            {PRICE_RANGES.map((range, idx) => (
              <Typography
                key={idx}
                onClick={() => {
                  setPriceRange([range.min, range.max ?? 500000])
                  setCurrentPage(1)
                }}
                sx={{
                  cursor: 'pointer',
                  py: 0.5,
                  fontSize: '0.85rem',
                  color: '#666',
                  '&:hover': { color: '#1a1a1a' },
                }}
              >
                {range.label}
              </Typography>
            ))}
          </Stack>

        </Box>

        {/* 우측 상품 영역 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* 상단 정보 바 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #eee',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TimeIcon sx={{ fontSize: 18, color: '#888' }} />
              <Typography variant="body2" color="text.secondary">
                {currentTime} 기준
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                총 {totalCount.toLocaleString()}개
              </Typography>
            </Stack>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="popular">인기순</MenuItem>
                <MenuItem value="latest">최신순</MenuItem>
                <MenuItem value="price-low">낮은 가격순</MenuItem>
                <MenuItem value="price-high">높은 가격순</MenuItem>
                <MenuItem value="review">리뷰 많은순</MenuItem>
              </Select>
            </FormControl>
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
                  <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
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
        </Box>
      </Box>
    </Container>
  )
}

export default ProductListPage
