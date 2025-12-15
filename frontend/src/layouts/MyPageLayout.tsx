import CreditCardIcon from '@mui/icons-material/CreditCard'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const myMenu = [
  { label: '내 정보', to: 'profile', icon: <HomeIcon /> },
  { label: '주문 내역', to: 'orders', icon: <ShoppingBagIcon /> },
  { label: '내가 쓴 글/리뷰', to: 'posts', icon: <StarIcon /> },
  { label: '찜한 상품', to: 'wishlist', icon: <FavoriteIcon /> },
  { label: '장바구니', to: '/cart', icon: <ShoppingCartIcon /> },
]

const MyPageLayout = () => {
  const location = useLocation()

  const isActiveMenu = (menuTo: string) => {
    // 절대 경로인 경우 (예: /cart)
    if (menuTo.startsWith('/')) {
      return location.pathname === menuTo
    }
    // 상대 경로인 경우
    return location.pathname.endsWith(menuTo) || location.pathname.includes(`/${menuTo}`)
  }

  return (
    <>
      <Header />
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box sx={{ width: { xs: '100%', md: 240 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#1a1a1a' }}>
              마이페이지
            </Typography>
            <List disablePadding>
              {myMenu.map((item) => {
                const isActive = isActiveMenu(item.to)
                return (
                  <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    sx={{
                      py: 1.5,
                      px: 0,
                      bgcolor: isActive ? '#f5f5f5' : 'transparent',
                      borderLeft: isActive ? '3px solid #1a1a1a' : '3px solid transparent',
                      pl: 1,
                      '&:hover': { bgcolor: '#f5f5f5', color: '#1a1a1a' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#1a1a1a' : 'inherit' }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#1a1a1a' : 'inherit',
                      }}
                    />
                  </ListItemButton>
                )
              })}
            </List>
            <Divider sx={{ my: 2 }} />
            <ListItemButton
              sx={{
                py: 1.5,
                px: 0,
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary="주소/결제수단" primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItemButton>
            <ListItemButton
              sx={{
                py: 1.5,
                px: 0,
                color: 'error.main',
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="로그아웃" primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItemButton>
          </Box>

          <Box flex={1}>
            <Outlet />
          </Box>
        </Stack>
      </Box>
      <Footer />
    </>
  )
}

export default MyPageLayout
