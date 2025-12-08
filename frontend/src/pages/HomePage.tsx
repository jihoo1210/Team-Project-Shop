import ArrowForward from '@mui/icons-material/ArrowForward'
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material'
import MainBanner from '@/components/home/MainBanner'
import ProductCard from '@/components/common/ProductCard'
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
]

const HomePage = () => {
  return (
    <Stack spacing={8}>
      <MainBanner />

      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              베스트 & 신규 상품
            </Typography>
            <Typography color="text.secondary">오늘 가장 인기 있는 상품을 만나보세요</Typography>
          </Box>
          <Button endIcon={<ArrowForward />} variant="text">
            전체보기
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {mockProducts.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              카테고리별 추천
            </Typography>
            <Typography color="text.secondary" paragraph>
              장바구니, 즐겨찾기, 추천 카테고리를 빠르게 탐색하세요.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="primary">
                장바구니 바로가기
              </Button>
              <Button variant="outlined">즐겨찾기 보기</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              {['아우터', '스니커즈', '라이프스타일', '리빙'].map((category) => (
                <Button key={category} variant="outlined" size="large">
                  {category} 추천 상품 보기
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
