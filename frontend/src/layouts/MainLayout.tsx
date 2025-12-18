import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import SupportChatWidget from '@/components/support/SupportChatWidget'

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <SupportChatWidget />
    </Box>
  )
}

export default MainLayout
