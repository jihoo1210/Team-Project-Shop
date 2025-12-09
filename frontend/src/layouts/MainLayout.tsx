import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

const MainLayout = () => {
  return (
    <>
      <Header />
      <Box component="main">
        <Outlet />
      </Box>
      <Footer />
    </>
  )
}

export default MainLayout
