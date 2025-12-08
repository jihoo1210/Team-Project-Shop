import CreditCardIcon from '@mui/icons-material/CreditCard'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const myMenu = [
  { label: '내 정보', to: 'profile', icon: <HomeIcon /> },
  { label: '주문 내역', to: 'orders', icon: <ShoppingBagIcon /> },
  { label: '내가 쓴 글/리뷰', to: 'posts', icon: <StarIcon /> },
  { label: '찜한 상품', to: 'wishlist', icon: <FavoriteIcon /> },
]

const MyPageLayout = () => {
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
              {myMenu.map((item) => (
                <ListItemButton
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{
                    py: 1.5,
                    px: 0,
                    '&:hover': { bgcolor: 'transparent', color: '#1a1a1a' },
                    '&.active': { color: '#1a1a1a', fontWeight: 600 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                </ListItemButton>
              ))}
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
