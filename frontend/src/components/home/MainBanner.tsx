import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { Box, Button, Container, IconButton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface BannerSlide {
  id: number
  title: string
  subtitle: string
  gradient: string
  ctaText: string
  ctaLink: string
}

const slides: BannerSlide[] = [
  {
    id: 1,
    title: '새로운 쇼핑 경험',
    subtitle: '최신 트렌드와 베스트 상품을 만나보세요',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ctaText: '지금 쇼핑하기',
    ctaLink: '/products',
  },
  {
    id: 2,
    title: '겨울 시즌 특가',
    subtitle: '따뜻한 겨울을 위한 특별한 할인',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    ctaText: '특가 상품 보기',
    ctaLink: '/products',
  },
  {
    id: 3,
    title: '신규 회원 혜택',
    subtitle: '가입하고 10% 할인 쿠폰 받으세요',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    ctaText: '쿠폰 받기',
    ctaLink: '/products',
  },
]

const MainBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const slide = slides[currentSlide]

  return (
    <Box
      sx={{
        position: 'relative',
        background: slide.gradient,
        color: 'white',
        py: { xs: 6, md: 10 },
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'background 0.5s ease',
      }}
    >
      <Container>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.75rem' } }}>
            {slide.title}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, fontSize: { xs: '1rem', md: '1.5rem' } }}>
            {slide.subtitle}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button
              component={Link}
              to={slide.ctaLink}
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              {slide.ctaText}
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.200' } }}
            >
              더 알아보기
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* 이전/다음 버튼 */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.5)' },
        }}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 16 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.5)' },
        }}
      >
        <ChevronRight />
      </IconButton>

      {/* 인디케이터 */}
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: currentSlide === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default MainBanner
