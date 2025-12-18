import ArrowForward from '@mui/icons-material/ArrowForward'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import type { ProductSummary } from '@/types/product'

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: ProductSummary[]
  viewAllLink?: string
}

const ProductSection = ({ title, subtitle, products, viewAllLink = '/products' }: ProductSectionProps) => {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Button component={Link} to={viewAllLink} endIcon={<ArrowForward />} variant="text">
          전체보기
        </Button>
      </Stack>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default ProductSection
