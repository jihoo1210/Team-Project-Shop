import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { layoutTokens } from '@/theme/tokens'

const MainLayout = () => {
  return (
    <>
      <Header />
      <Container component="main" sx={{ py: layoutTokens.sectionSpacing }}>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

export default MainLayout
