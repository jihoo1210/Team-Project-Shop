import {
  Box,
  Breadcrumbs,
  Container,
  FormControl,
  Grid,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryFilter, { type FilterState } from '@/components/common/CategoryFilter'
import Pagination from '@/components/common/Pagination'
import ProductCard from '@/components/common/ProductCard'
import { fetchItems } from '@/api/itemApi'
import type { ProductSummary } from '@/types/product'

type SortOption = 'popular' | 'latest' | 'price-low' | 'price-high' | 'review'

const ProductListPage = () => {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchTerm = searchParams.get('searchTerm')

  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [filters, setFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 500000],
    brands: [],
    badges: [],
  })

  const itemsPerPage = 12

  // 정렬 옵션을 API 파라미터로 변환
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
    setError(null)

    try {
      const sortParams = getSortParams(sortBy)
      const response = await fetchItems({
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: searchTerm || undefined,
        category: filters.categories.length > 0 ? filters.categories[0] : undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 500000 ? filters.priceRange[1] : undefined,
        ...sortParams,
      })

      // API 응답 형식에 따라 데이터 매핑
      const mappedProducts: ProductSummary[] = (response.content || []).map((item) => ({
        id: item.item_id,
        title: item.item_name || item.title || '상품명',
        brand: item.brand || '',
        price: item.price,
        discountPercent: item.discount_percent,
        scoreAverage: item.score_average || item.scoreAverage,
        reviewCount: item.review_count || item.reviewCount,
        likeCount: item.like_count || item.likeCount,
        mainImage: item.main_image || item.main_image_url || 'https://placehold.co/600x400/png',
        badges: item.badges,
      }))

      setProducts(mappedProducts)
      setTotalCount(response.totalElements || 0)
    } catch (err) {
      console.error('상품 목록 로드 실패:', err)
      // Fallback to mock data for development
      const mockProducts: ProductSummary[] = Array.from({ length: 24 }, (_, i) => ({
        id: `SKU-${1000 + i}`,
        title: `상품 ${i + 1}`,
        brand: ['MyShop Originals', 'Premium Line', 'Flexfit', 'Urban Style'][i % 4],
        price: Math.floor(Math.random() * 200000) + 50000,
        discountPercent: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : undefined,
        scoreAverage: Number((Math.random() * 1 + 4).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 200) + 10,
        likeCount: Math.floor(Math.random() * 100) + 5,
        mainImage: `https://placehold.co/${600 + i}x400/png`,
        badges:
          i % 4 === 0
            ? ['신규']
            : i % 3 === 0
              ? ['베스트']
              : i % 5 === 0
                ? ['한정수량']
                : undefined,
      }))
      setProducts(mockProducts)
      setTotalCount(mockProducts.length)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, searchTerm, filters])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // 카테고리 파라미터 변경 시 필터 업데이트
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [categoryParam],
      }))
    }
  }, [categoryParam])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          홈
        </MuiLink>
        <Typography color="text.primary">상품 목록</Typography>
      </Breadcrumbs>

      {/* 페이지 제목 */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          {searchTerm ? `"${searchTerm}" 검색 결과` : '전체 상품'}
        </Typography>
        <Typography color="text.secondary">
          총 {totalCount}개의 상품
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 좌측 필터 영역 */}
        <Grid item xs={12} md={3}>
          <CategoryFilter onFilterChange={handleFilterChange} />
        </Grid>

        {/* 우측 상품 목록 영역 */}
        <Grid item xs={12} md={9}>
          {/* 정렬 옵션 */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {products.length}개 상품 표시 중
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
              >
                <MenuItem value="popular">인기순</MenuItem>
                <MenuItem value="latest">최신순</MenuItem>
                <MenuItem value="price-low">낮은 가격순</MenuItem>
                <MenuItem value="price-high">높은 가격순</MenuItem>
                <MenuItem value="review">리뷰 많은순</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* 로딩 상태 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">
                검색 조건에 맞는 상품이 없습니다.
              </Typography>
            </Box>
          ) : (
            <>
              {/* 상품 카드 그리드 */}
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product.id}>
                    <ProductCard product={product} />
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
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductListPage
