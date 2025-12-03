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
} from '@mui/material'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CategoryFilter, { FilterState } from '@/components/common/CategoryFilter'
import Pagination from '@/components/common/Pagination'
import ProductCard from '@/components/common/ProductCard'
import type { ProductSummary } from '@/types/product'

// Mock 데이터 - 실제로는 API에서 가져올 데이터
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

type SortOption = 'popular' | 'latest' | 'price-low' | 'price-high' | 'review'

const ProductListPage = () => {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchTerm = searchParams.get('searchTerm')

  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [filters, setFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    priceRange: [0, 500000],
    brands: [],
    badges: [],
  })

  const itemsPerPage = 12
  const totalPages = Math.ceil(mockProducts.length / itemsPerPage)

  // 필터링 및 정렬 로직
  const filteredAndSortedProducts = mockProducts
    .filter((product) => {
      // 카테고리 필터
      if (filters.categories.length > 0) {
        // 실제로는 product.category와 비교
        // 현재는 Mock이므로 모든 상품 표시
      }

      // 가격 필터
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // 브랜드 필터
      if (filters.brands.length > 0) {
        // 실제로는 product.brandId와 비교
      }

      // 검색어 필터
      if (searchTerm && !product.title.includes(searchTerm)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return b.id.localeCompare(a.id)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'review':
          return b.reviewCount - a.reviewCount
        case 'popular':
        default:
          return b.likeCount - a.likeCount
      }
    })

  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로
  }

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort)
    setCurrentPage(1) // 정렬 변경 시 첫 페이지로
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
          총 {filteredAndSortedProducts.length}개의 상품
        </Typography>
      </Stack>

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
              {paginatedProducts.length}개 상품 표시 중
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

          {/* 상품 카드 그리드 */}
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => (
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
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductListPage
