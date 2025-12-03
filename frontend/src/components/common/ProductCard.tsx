import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Star from '@mui/icons-material/Star'
import { Box, Card, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from '@mui/material'
import type { ProductSummary } from '@/types/product'

interface ProductCardProps {
  product: ProductSummary
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={product.mainImage}
          alt={product.title}
          sx={{ objectFit: 'cover' }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <FavoriteBorder />
        </IconButton>
        {product.badges && product.badges.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: 'absolute', top: 8, left: 8 }}
          >
            {product.badges.map((badge) => (
              <Chip
                key={badge}
                label={badge}
                size="small"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {product.title}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Star sx={{ color: 'warning.main', fontSize: 18 }} />
          <Typography variant="body2" fontWeight={600}>
            {product.scoreAverage}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({product.reviewCount})
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {product.discountPercent && (
            <Typography variant="h6" color="error" fontWeight={700}>
              {product.discountPercent}%
            </Typography>
          )}
          <Typography variant="h6" fontWeight={700}>
            {discountedPrice.toLocaleString()}원
          </Typography>
        </Stack>
        {product.discountPercent && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            {product.price.toLocaleString()}원
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
