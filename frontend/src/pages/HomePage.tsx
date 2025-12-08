import { useState, useEffect } from 'react'
import { Box, Button, Grid, Typography, CircularProgress, Stack, IconButton, TextField, Snackbar, Alert } from '@mui/material'
import { AutoAwesome, KeyboardArrowUp } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '@/components/common/ProductCard'
import { fetchItems } from '@/api/itemApi'
import { useAiRecommend } from '@/hooks/useAiRecommend'
import type { ProductSummary } from '@/types/product'

// 히어로 섹션 캐러셀 카드 데이터 (회전용)
const carouselCards = [
  { id: 1, image: 'https://picsum.photos/id/1005/400/500', title: 'MEINE' },
  { id: 2, image: 'https://picsum.photos/id/1012/400/500', title: 'DOUBT' },
  { id: 3, image: 'https://picsum.photos/id/1027/400/500', title: 'CLASSIC' },
  { id: 4, image: 'https://picsum.photos/id/1035/400/500', title: 'WINTER' },
  { id: 5, image: 'https://picsum.photos/id/1074/400/500', title: 'STREET' },
  { id: 6, image: 'https://picsum.photos/id/1082/400/500', title: 'CASUAL' },
]

// 상품 이미지 - picsum
const FASHION_IMAGES = {
  hoodie: 'https://picsum.photos/id/96/400/500',
  sweater: 'https://picsum.photos/id/103/400/500',
  trousers: 'https://picsum.photos/id/119/400/500',
  tshirt: 'https://picsum.photos/id/129/400/500',
  dress: 'https://picsum.photos/id/145/400/500',
  jacket: 'https://picsum.photos/id/157/400/500',
  coat: 'https://picsum.photos/id/164/400/500',
  shirt: 'https://picsum.photos/id/177/400/500',
}

// Mock data
const mockProducts: ProductSummary[] = [
  { id: 'SKU-1001', title: 'Black Hoodie', brand: 'MyShop', price: 65000, discountPercent: 20, mainImage: FASHION_IMAGES.hoodie },
  { id: 'SKU-1002', title: 'Beige Knit', brand: 'MyShop', price: 45000, mainImage: FASHION_IMAGES.sweater },
  { id: 'SKU-1003', title: 'Wide Trousers', brand: 'MyShop', price: 55000, discountPercent: 15, mainImage: FASHION_IMAGES.trousers },
  { id: 'SKU-1004', title: 'Basic Tshirt', brand: 'MyShop', price: 25000, mainImage: FASHION_IMAGES.tshirt },
  { id: 'SKU-1005', title: 'Long Dress', brand: 'MyShop', price: 89000, discountPercent: 30, mainImage: FASHION_IMAGES.dress },
  { id: 'SKU-1006', title: 'Denim Jacket', brand: 'MyShop', price: 79000, mainImage: FASHION_IMAGES.jacket },
  { id: 'SKU-1007', title: 'Wool Coat', brand: 'MyShop', price: 159000, discountPercent: 25, mainImage: FASHION_IMAGES.coat },
  { id: 'SKU-1008', title: 'Stripe Shirt', brand: 'MyShop', price: 49000, mainImage: FASHION_IMAGES.shirt },
]

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [aiPrompt, setAiPrompt] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  })
  const { getRecommendation, loading: isAiLoading } = useAiRecommend()

  // 캐러셀 자동 회전
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselCards.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchItems({ page: 0, size: 8 })
        const mapped: ProductSummary[] = (response.content || []).map((item: any, index: number) => ({
          id: item.item_id,
          title: item.item_name || item.title,
          brand: item.brand || 'MyShop',
          price: item.price,
          discountPercent: item.discount_percent,
          mainImage: item.main_image || Object.values(FASHION_IMAGES)[index % 8],
        }))
        setProducts(mapped.length > 0 ? mapped : mockProducts)
      } catch {
        setProducts(mockProducts)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim() || isAiLoading || aiPrompt.length < 25) return

    try {
      const result = await getRecommendation(aiPrompt)

      if (result) {
        // AI 추천 결과로 상품 검색 페이지로 이동
        const searchParams = new URLSearchParams()
        searchParams.set('ai', encodeURIComponent(aiPrompt))
        if (result.keywords.length > 0) {
          searchParams.set('keywords', result.keywords.join(','))
        }
        if (result.category) {
          searchParams.set('category', result.category)
        }

        setSnackbar({
          open: true,
          message: result.description || 'AI 추천이 완료되었습니다!',
          severity: 'success'
        })

        // 잠시 후 페이지 이동
        setTimeout(() => {
          navigate(`/products?${searchParams.toString()}`)
        }, 1000)
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'AI 추천 중 오류가 발생했습니다. 다시 시도해주세요.',
        severity: 'error'
      })
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // 좌측 카드 (펼쳐진 스택 형태)
  const renderLeftCard = (card: typeof carouselCards[0], index: number) => {
    // 0, 1, 2번 카드만 좌측에 표시
    const adjustedIndex = (index - carouselIndex + carouselCards.length) % carouselCards.length
    if (adjustedIndex >= 3) return null

    // 더 펼쳐진 스택: 뒤에서 앞으로
    const positions = [
      { x: -60, y: 0, rotate: -12, scale: 0.8, zIndex: 1, opacity: 0.5 },
      { x: -30, y: 0, rotate: -6, scale: 0.9, zIndex: 2, opacity: 0.75 },
      { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 3, opacity: 1 },
    ]
    const style = positions[adjustedIndex]

    return (
      <Box
        key={card.id}
        sx={{
          position: 'absolute',
          width: { xs: 100, sm: 130, md: 160 },
          height: { xs: 140, sm: 170, md: 210 },
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(${style.x}%) rotate(${style.rotate}deg) scale(${style.scale})`,
          zIndex: style.zIndex,
          opacity: style.opacity,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          right: '100%',
          mr: 4,
          top: '50%',
          marginTop: { xs: '-70px', sm: '-85px', md: '-105px' },
        }}
      >
        <Box
          component="img"
          src={card.image}
          alt={card.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            p: 1.2,
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.8rem' } }}>
            {card.title}
          </Typography>
        </Box>
      </Box>
    )
  }

  // 우측 카드 (좌측과 대칭되는 펼쳐진 스택)
  const renderRightCard = (card: typeof carouselCards[0], index: number) => {
    // 3, 4, 5번 카드만 우측에 표시
    const adjustedIndex = (index - carouselIndex + carouselCards.length) % carouselCards.length
    if (adjustedIndex < 3) return null

    const posIndex = adjustedIndex - 3
    // 좌측과 대칭 (반대 방향으로 펼침)
    const positions = [
      { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 3, opacity: 1 },
      { x: 30, y: 0, rotate: 6, scale: 0.9, zIndex: 2, opacity: 0.75 },
      { x: 60, y: 0, rotate: 12, scale: 0.8, zIndex: 1, opacity: 0.5 },
    ]
    const style = positions[posIndex]

    return (
      <Box
        key={card.id}
        sx={{
          position: 'absolute',
          width: { xs: 100, sm: 130, md: 160 },
          height: { xs: 140, sm: 170, md: 210 },
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(${style.x}%) rotate(${style.rotate}deg) scale(${style.scale})`,
          zIndex: style.zIndex,
          opacity: style.opacity,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          left: '100%',
          ml: 4,
          top: '50%',
          marginTop: { xs: '-70px', sm: '-85px', md: '-105px' },
        }}
      >
        <Box
          component="img"
          src={card.image}
          alt={card.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            p: 1.2,
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.8rem' } }}>
            {card.title}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#fff' }}>
      {/* 히어로 섹션 - 회전 캐러셀 + AI 프롬프트 */}
      <Box sx={{ position: 'relative', bgcolor: '#f5f5f5', py: { xs: 6, md: 10 }, overflow: 'hidden' }}>
        {/* 상단 어필 문구 */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            sx={{
              color: '#1a1a1a',
              fontSize: { xs: '1.3rem', md: '1.8rem' },
              fontWeight: 700,
              mb: 1,
            }}
          >
            원하는 스타일을 말해주세요!
          </Typography>
          <Typography
            sx={{
              color: '#666',
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            AI가 당신만의 완벽한 코디를 추천해드릴게요
          </Typography>
        </Box>

        {/* 중앙 AI 입력창 + 양옆 회전 캐러셀 */}
        <Box
          sx={{
            position: 'relative',
            mx: 'auto',
            width: { xs: '90%', sm: '70%', md: '40%' },
            maxWidth: 500,
          }}
        >
          {/* 좌측 회전 캐러셀 - 부채꼴 세로 배치 */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {carouselCards.map((card, index) => renderLeftCard(card, index))}
          </Box>

          {/* AI 프롬프트 입력창 */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              bgcolor: 'white',
              borderRadius: 2,
              p: 2.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
            }}
          >
            {/* 상단 AI 라벨 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
              <AutoAwesome sx={{ color: '#6366F1', fontSize: 16 }} />
              <Typography sx={{ color: '#1a1a1a', fontSize: '0.8rem', fontWeight: 600 }}>
                MyShop AI
              </Typography>
            </Box>

            {/* 텍스트 입력 영역 */}
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="예: 데이트룩 추천해줘, 출근할 때 입을 깔끔한 코디, 겨울에 따뜻한 캐주얼 스타일..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value.slice(0, 1000))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAiSubmit()
                }
              }}
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
              }}
            />

            {/* 하단 영역: 글자수 + 전송버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
              <Typography sx={{ color: '#bbb', fontSize: '0.75rem' }}>
                최소 25자  {aiPrompt.length} / 1000
              </Typography>
              <IconButton
                onClick={handleAiSubmit}
                disabled={isAiLoading || aiPrompt.length < 25}
                size="small"
                sx={{
                  bgcolor: aiPrompt.length >= 25 ? '#6366F1' : '#f5f5f5',
                  color: aiPrompt.length >= 25 ? 'white' : '#ccc',
                  width: 28,
                  height: 28,
                  '&:hover': { bgcolor: aiPrompt.length >= 25 ? '#4F46E5' : '#eee' },
                  '&.Mui-disabled': { color: '#ccc', bgcolor: '#f5f5f5' },
                }}
              >
                {isAiLoading ? <CircularProgress size={14} color="inherit" /> : <KeyboardArrowUp sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Box>

          {/* 우측 회전 캐러셀 - 가로로 펼침 */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {carouselCards.map((card, index) => renderRightCard(card, index))}
          </Box>
        </Box>

        {/* 하단 안내 태그들 */}
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          sx={{ mt: 4, px: 2, gap: 1 }}
        >
          {['#캐주얼', '#오피스룩', '#데이트', '#스트릿', '#미니멀'].map((tag) => (
            <Box
              key={tag}
              onClick={() => setAiPrompt(prev => prev + ' ' + tag.replace('#', ''))}
              sx={{
                px: 2,
                py: 0.8,
                bgcolor: 'white',
                borderRadius: 5,
                fontSize: '0.8rem',
                color: '#666',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#6366F1',
                  color: 'white',
                  borderColor: '#6366F1',
                },
              }}
            >
              {tag}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* 오늘의 추천 - 넓은 마진 */}
      <Box sx={{ py: { xs: 6, md: 12 }, px: { xs: 3, md: 12 }, maxWidth: 1600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              오늘의 추천
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '1rem', mt: 1 }}>
              당신을 위한 큐레이션
            </Typography>
          </Box>
          <Button component={Link} to="/products" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
            전체보기 &rarr;
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {products.slice(0, 4).map((product) => (
            <Grid item xs={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 다크 섹션 - 카테고리 쇼케이스 (풀폭으로 임팩트) */}
      <Box sx={{ bgcolor: '#1a1a1a', py: { xs: 8, md: 12 }, px: { xs: 2, md: 8 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component={Link}
              to="/products?category=outer"
              sx={{
                display: 'block',
                position: 'relative',
                height: { xs: 280, md: 400 },
                borderRadius: 2,
                overflow: 'hidden',
                textDecoration: 'none',
                '&:hover img': { transform: 'scale(1.05)' },
              }}
            >
              <Box
                component="img"
                src="https://picsum.photos/id/252/800/600"
                alt="Outer"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                }}
              />
              <Box sx={{ position: 'absolute', bottom: 30, left: 30, color: 'white' }}>
                <Typography sx={{ fontSize: '0.85rem', opacity: 0.8, mb: 1, letterSpacing: '0.1em' }}>
                  WINTER ESSENTIAL
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  OUTER COLLECTION
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', opacity: 0.9, mt: 1 }}>
                  겨울을 따뜻하게, 스타일은 멋지게
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Box
                component={Link}
                to="/products?category=knit"
                sx={{
                  display: 'block',
                  position: 'relative',
                  height: { xs: 180, md: 188 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  '&:hover img': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  src="https://picsum.photos/id/256/800/400"
                  alt="Knit"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  }}
                />
                <Box sx={{ position: 'absolute', top: '50%', left: 25, transform: 'translateY(-50%)', color: 'white' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                    KNIT & SWEATER
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', opacity: 0.9, mt: 0.5 }}>
                    포근한 니트웨어
                  </Typography>
                </Box>
              </Box>
              <Box
                component={Link}
                to="/products?category=bottom"
                sx={{
                  display: 'block',
                  position: 'relative',
                  height: { xs: 180, md: 188 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  '&:hover img': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  src="https://picsum.photos/id/274/800/400"
                  alt="Bottom"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  }}
                />
                <Box sx={{ position: 'absolute', top: '50%', left: 25, transform: 'translateY(-50%)', color: 'white' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                    PANTS & SKIRTS
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', opacity: 0.9, mt: 0.5 }}>
                    데일리 하의 컬렉션
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* 베스트 상품 - 중간 마진 */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 6 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              BEST
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '1rem', mt: 1 }}>
              가장 많이 사랑받는 아이템
            </Typography>
          </Box>
          <Button component={Link} to="/products?sort=best" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
            전체보기 &rarr;
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {products.slice(0, 8).map((product, index) => (
            <Grid item xs={6} md={3} key={product.id}>
              <Box sx={{ position: 'relative' }}>
                {index < 3 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      zIndex: 1,
                      bgcolor: index === 0 ? '#ff4444' : '#1a1a1a',
                      color: 'white',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                )}
                <ProductCard product={product} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 타임세일 배너 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 12.5%, #A8A8A8 25%, #F5F5F5 37.5%, #C0C0C0 50%, #E8E8E8 62.5%, #A8A8A8 75%, #F5F5F5 100%)',
          py: 6,
          px: { xs: 2, md: 6 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: 'rgba(0,0,0,0.15)',
                px: 2,
                py: 0.5,
                borderRadius: 5,
                mb: 2,
              }}
            >
              <Typography sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.85rem' }}>
                LIMITED TIME OFFER
              </Typography>
            </Box>
            <Typography sx={{ color: '#1a1a1a', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              지금 딱! 오늘만 특가
            </Typography>
            <Typography sx={{ color: 'rgba(0,0,0,0.7)', fontSize: '1rem', mt: 1 }}>
              최대 78% 할인 + 추가 쿠폰 혜택
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/products?sort=sale"
            variant="contained"
            sx={{
              bgcolor: '#1a1a1a',
              color: 'white',
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#333' },
            }}
          >
            쇼핑하러 가기
          </Button>
        </Stack>
      </Box>

      {/* 신상품 - 좁은 마진으로 넓게 */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, md: 4 }, bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              NEW ARRIVALS
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '1rem', mt: 1 }}>
              방금 도착한 신상품
            </Typography>
          </Box>
          <Button component={Link} to="/products?sort=new" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
            전체보기 &rarr;
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {products.slice(4, 8).map((product) => (
            <Grid item xs={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 브랜드 스토리 섹션 - 넓은 패딩으로 고급스럽게 */}
      <Box sx={{ bgcolor: '#1a1a1a', py: { xs: 8, md: 12 }, px: { xs: 3, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            BRAND STORY
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            당신의 스타일을 완성하는 브랜드
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {[
            { title: 'PREMIUM', desc: '프리미엄 브랜드', img: 'https://picsum.photos/id/342/600/400' },
            { title: 'DESIGNER', desc: '디자이너 컬렉션', img: 'https://picsum.photos/id/357/600/400' },
            { title: 'LIFESTYLE', desc: '라이프스타일', img: 'https://picsum.photos/id/367/600/400' },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                component={Link}
                to="/products"
                sx={{
                  display: 'block',
                  position: 'relative',
                  height: { xs: 200, md: 280 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  '&:hover img': { transform: 'scale(1.05)' },
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'background-color 0.3s',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.5rem' }, letterSpacing: '0.1em' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem', opacity: 0.85, mt: 0.5 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AI 추천 결과 알림 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default HomePage
