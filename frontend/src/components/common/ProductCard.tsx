import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Star from '@mui/icons-material/Star'
import { Box, Card, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { ProductSummary } from '@/types/product'

interface ProductCardProps {
  product: ProductSummary
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate()
  
  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price

  const handleCardClick = () => {
    navigate(`/products/${product.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 전파 방지
    // TODO: 찜하기 기능 구현
  }

  return (
    <Card
      onClick={handleCardClick}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        border: 'none',
        borderRadius: 0,
        bgcolor: 'transparent',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
        '&:hover img': {
          transform: 'scale(1.03)',
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 1, bgcolor: '#f5f5f5' }}>
        <CardMedia
          component="img"
          sx={{
            height: { xs: 200, sm: 260, md: 320 },
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          image={product.mainImage}
          alt={product.title}
        />
        <IconButton
          onClick={handleFavoriteClick}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'white' },
          }}
        >
          <FavoriteBorder sx={{ fontSize: 20 }} />
        </IconButton>
        {product.badges && product.badges.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ position: 'absolute', top: 12, left: 12 }}
          >
            {product.badges.map((badge) => (
              <Chip
                key={badge}
                label={badge}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  bgcolor: '#1a1a1a',
                  color: 'white',
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, px: 0.5, pt: 2, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: '#999', fontSize: '0.75rem', letterSpacing: '0.02em' }}
        >
          {product.brand}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.95rem',
            mt: 0.5,
            mb: 1,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.title}
        </Typography>
        {(product.scoreAverage || product.reviewCount) && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
            <Star sx={{ color: '#FFB800', fontSize: 16 }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
              {product.scoreAverage || 0}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#999' }}>
              ({product.reviewCount || 0})
            </Typography>
          </Stack>
        )}
        <Stack direction="row" alignItems="baseline" spacing={1}>
          {product.discountPercent && (
            <Typography sx={{ color: '#ff4444', fontWeight: 700, fontSize: '1rem' }}>
              {product.discountPercent}%
            </Typography>
          )}
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {discountedPrice.toLocaleString()}원
          </Typography>
        </Stack>
        {product.discountPercent && (
          <Typography
            sx={{
              fontSize: '0.8rem',
              color: '#bbb',
              textDecoration: 'line-through',
              mt: 0.3,
            }}
          >
            {product.price.toLocaleString()}원
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
