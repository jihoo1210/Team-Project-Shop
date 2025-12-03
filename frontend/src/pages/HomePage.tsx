import { Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MainBanner from '@/components/home/MainBanner'
import ProductSection from '@/components/home/ProductSection'
import type { ProductSummary } from '@/types/product'

const mockProducts: ProductSummary[] = [
  {
    id: 'SKU-1001',
    title: '에센셜 후드 티셔츠',
    brand: 'MyShop Originals',
    price: 89000,
    discountPercent: 15,
    scoreAverage: 4.8,
    reviewCount: 124,
    likeCount: 52,
    mainImage: 'https://placehold.co/600x400/png',
    badges: ['신규', '한정수량'],
  },
  {
    id: 'SKU-1002',
    title: '클래식 체크 코트',
    brand: 'Premium Line',
    price: 219000,
    discountPercent: 10,
    scoreAverage: 4.6,
    reviewCount: 87,
    likeCount: 33,
    mainImage: 'https://placehold.co/601x400/png',
    badges: ['베스트'],
  },
  {
    id: 'SKU-1003',
    title: '데일리 스니커즈',
    brand: 'Flexfit',
    price: 129000,
    scoreAverage: 4.9,
    reviewCount: 210,
    likeCount: 89,
    mainImage: 'https://placehold.co/602x400/png',
    badges: ['추천'],
  },
  {
    id: 'SKU-1004',
    title: '미니멀 백팩',
    brand: 'Urban Style',
    price: 79000,
    discountPercent: 20,
    scoreAverage: 4.7,
    reviewCount: 156,
    likeCount: 45,
    mainImage: 'https://placehold.co/603x400/png',
    badges: ['베스트'],
  },
  {
    id: 'SKU-1005',
    title: '프리미엄 청바지',
    brand: 'Denim Pro',
    price: 159000,
    scoreAverage: 4.5,
    reviewCount: 98,
    likeCount: 67,
    mainImage: 'https://placehold.co/604x400/png',
    badges: ['신규'],
  },
  {
    id: 'SKU-1006',
    title: '캐주얼 스웨터',
    brand: 'Cozy Wear',
    price: 69000,
    discountPercent: 25,
    scoreAverage: 4.8,
    reviewCount: 189,
    likeCount: 102,
    mainImage: 'https://placehold.co/605x400/png',
    badges: ['추천', '한정수량'],
  },
]

const newProducts: ProductSummary[] = [
  {
    id: 'SKU-2001',
    title: '트렌디 크롭 재킷',
    brand: 'Fashion Hub',
    price: 199000,
    scoreAverage: 4.9,
    reviewCount: 45,
    likeCount: 78,
    mainImage: 'https://placehold.co/606x400/png',
    badges: ['신규'],
  },
  {
    id: 'SKU-2002',
    title: '레트로 운동화',
    brand: 'Sporty Walk',
    price: 139000,
    discountPercent: 10,
    scoreAverage: 4.6,
    reviewCount: 67,
    likeCount: 54,
    mainImage: 'https://placehold.co/607x400/png',
    badges: ['신규'],
  },
  {
    id: 'SKU-2003',
    title: '스마트 크로스백',
    brand: 'Modern Bag',
    price: 89000,
    scoreAverage: 4.7,
    reviewCount: 23,
    likeCount: 34,
    mainImage: 'https://placehold.co/608x400/png',
    badges: ['신규', '추천'],
  },
]

const HomePage = () => {
  return (
    <Stack spacing={{ xs: 6, md: 8 }}>
      <MainBanner />

      {/* 베스트 상품 섹션 */}
      <ProductSection
        title="베스트 & 인기 상품"
        subtitle="오늘 가장 인기 있는 상품을 만나보세요"
        products={mockProducts}
        viewAllLink="/products?sort=best"
      />

      {/* 신규 상품 섹션 */}
      <ProductSection
        title="NEW 신규 상품"
        subtitle="따끈따끈한 새로운 상품을 확인해보세요"
        products={newProducts}
        viewAllLink="/products?sort=new"
      />

      {/* 카테고리별 추천 영역 */}
      <Paper
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
            >
              카테고리별 추천
            </Typography>
            <Typography color="text.secondary" paragraph sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              장바구니, 즐겨찾기, 추천 카테고리를 빠르게 탐색하세요.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/cart" variant="contained" color="primary" size="large">
                장바구니 바로가기
              </Button>
              <Button component={Link} to="/products" variant="outlined" size="large">
                즐겨찾기 보기
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {[
                { name: '아우터', link: '/products?category=outer' },
                { name: '스니커즈', link: '/products?category=sneakers' },
                { name: '라이프스타일', link: '/products?category=lifestyle' },
                { name: '리빙', link: '/products?category=living' },
              ].map((category) => (
                <Button
                  key={category.name}
                  component={Link}
                  to={category.link}
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  }}
                >
                  {category.name} 추천 상품 보기
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  )
}

export default HomePage
