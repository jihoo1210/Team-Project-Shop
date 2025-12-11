import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  Stack,
  Divider,
} from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// 카테고리 메뉴 데이터 (백엔드 MajorCategoryEnum 기준)
const categoryMenus = [
  { label: '베스트', link: '/products?sort=best', isHot: true },
  { label: '신상', link: '/products?sort=new' },
  { label: '세일', link: '/products?sort=sale' },
  { label: '여성', link: '/products?category=WOMEN' },
  { label: '남성', link: '/products?category=MEN' },
  { label: '키즈', link: '/products?category=KIDS' },
  { label: '슈즈', link: '/products?category=SHOES' },
  { label: '가방', link: '/products?category=BAGS' },
  { label: '액세서리', link: '/products?category=ACCESSORIES' },
]

const Header = () => {
  const navigate = useNavigate()
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const cartItemCount = 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?searchTerm=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
      {/* 상단: 로고 + 검색 + 아이콘 */}
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, minHeight: 'auto' }}>
          {/* 좌측: 햄버거 메뉴 + 로고 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: '#1a1a1a' }}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: '#1a1a1a',
                textDecoration: 'none',
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                letterSpacing: '-0.5px',
                '&:hover': { opacity: 0.7 },
              }}
            >
              MyShop
            </Typography>
          </Box>

          {/* 검색창 - 완전 가운데 */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 500,
              px: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="상품을 검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  bgcolor: '#f8f8f8',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: '1px solid #1a1a1a' },
                },
              }}
            />
          </Box>

          {/* 우측: 아이콘 */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    size="small"
                    sx={{ color: '#1a1a1a', fontSize: '0.85rem', display: { xs: 'none', md: 'flex' } }}
                  >
                    관리자
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/board/notice"
                  size="small"
                  sx={{ color: '#1a1a1a', fontSize: '0.85rem', display: { xs: 'none', md: 'flex' } }}
                >
                  게시판
                </Button>
                <Button
                  onClick={handleLogout}
                  size="small"
                  sx={{ color: '#1a1a1a', fontSize: '0.85rem', display: { xs: 'none', md: 'flex' } }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  size="small"
                  sx={{ color: '#1a1a1a', fontSize: '0.85rem', display: { xs: 'none', md: 'flex' } }}
                >
                  로그인
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  size="small"
                  sx={{ color: '#1a1a1a', fontSize: '0.85rem', display: { xs: 'none', md: 'flex' } }}
                >
                  회원가입
                </Button>
              </>
            )}

            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', md: 'flex' } }} />

            <IconButton component={Link} to="/mypage/favorites" sx={{ color: '#1a1a1a' }}>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton component={Link} to="/mypage" sx={{ color: '#1a1a1a' }}>
              <PersonOutlineIcon />
            </IconButton>
            <IconButton component={Link} to="/cart" sx={{ color: '#1a1a1a' }}>
              <Badge badgeContent={cartItemCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* 하단: 카테고리 메뉴 */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', display: { xs: 'none', md: 'block' } }}>
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={0}
            sx={{
              py: 1,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {categoryMenus.map((menu, index) => (
              <Button
                key={index}
                component={Link}
                to={menu.link}
                sx={{
                  color: '#1a1a1a',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  position: 'relative',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#666',
                  },
                }}
              >
                {menu.label}
                {menu.isHot && (
                  <Box
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 4,
                      width: 6,
                      height: 6,
                      bgcolor: '#ff4444',
                      borderRadius: '50%',
                    }}
                  />
                )}
                {menu.isNew && (
                  <Box
                    component="span"
                    sx={{
                      ml: 0.5,
                      fontSize: '0.65rem',
                      color: '#ff4444',
                      fontWeight: 700,
                    }}
                  >
                    N
                  </Box>
                )}
              </Button>
            ))}

            {/* 검색 아이콘 (우측) */}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" sx={{ color: '#1a1a1a' }}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Stack>
        </Container>
      </Box>
    </AppBar>
  )
}

export default Header
