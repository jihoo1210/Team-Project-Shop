import { Box, CircularProgress } from '@mui/material'

/**
 * 전체 화면 로딩 컴포넌트
 * Lazy loading 페이지 전환 시 사용
 */
const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={48} thickness={4} />
    </Box>
  )
}

export default LoadingScreen
