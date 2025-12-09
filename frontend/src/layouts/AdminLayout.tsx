import { AppBar, Box, Button, Drawer, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

const adminNav = [
  { label: '대시보드', to: '/admin' },
  { label: '상품 관리', to: '/admin/products' },
  { label: '회원 관리', to: '/admin/members' },
  { label: '게시판 관리', to: '/admin/board' },
  { label: '배너 관리', to: '/admin/banners' },
]

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ ml: 240 }} color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            운영자 콘솔
          </Typography>
          <Button color="inherit" component={NavLink} to="/">
            서비스로 이동
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', pt: 8 },
        }}
      >
        <List>
          {adminNav.map((item) => (
            <ListItemButton key={item.to} component={NavLink} to={item.to}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50', p: 4, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminLayout
