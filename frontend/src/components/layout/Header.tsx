import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
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
} from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * 공통 헤더 컴포넌트
 * SPEC: 로고, 검색창, 로그인/회원가입, 마이페이지, 장바구니(아이콘 + 뱃지)
 */
const Header = () => {
  const navigate = useNavigate()
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  
  // TODO: 장바구니 개수 상태 연동 (Context 또는 API)
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
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          {/* 좌측: 로고 */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              textDecoration: 'none',
              flexShrink: 0,
              '&:hover': { opacity: 0.8 },
            }}
          >
            MyShop
          </Typography>

          {/* 중앙: 검색창 */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              width: '100%', 
              maxWidth: 500,
              mx: 4,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="상품을 검색하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'background.default',
                borderRadius: 999,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                },
              }}
            />
          </Box>

          {/* 우측: 네비게이션 버튼 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
            {/* 게시판 버튼 - 항상 표시 */}
            <Button
              component={Link}
              to="/board/notice"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              게시판
            </Button>

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Button
                    component={Link}
                    to="/admin"
                    color="inherit"
                    sx={{ fontWeight: 600 }}
                  >
                    관리자
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/mypage"
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                >
                  마이페이지
                </Button>
                <Button
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                >
                  로그인
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  회원가입
                </Button>
              </>
            )}

            {/* 장바구니 아이콘 + 뱃지 */}
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
