import CreditCardIcon from '@mui/icons-material/CreditCard'
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material'
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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Paper sx={{ width: { xs: '100%', md: 280 }, p: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              마이페이지
            </Typography>
            <List>
              {myMenu.map((item) => (
                <ListItemButton
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon>
                <CreditCardIcon />
              </ListItemIcon>
              <ListItemText primary="주소/결제수단" />
            </ListItemButton>
            <ListItemButton sx={{ borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItemButton>
          </Paper>

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
