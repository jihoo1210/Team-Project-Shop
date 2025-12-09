import { Box } from '@mui/material'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppRoutes />
    </Box>
  )
}

export default App
