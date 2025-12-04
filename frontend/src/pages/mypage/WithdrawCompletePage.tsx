import { Container, Typography, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material'

/**
 * 회원탈퇴 완료 페이지
 * SPEC: 탈퇴 완료 확인 페이지("언제든지 돌아오세요!" 메시지)
 */
const WithdrawCompletePage = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <SadIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
        
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          회원 탈퇴 완료
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          그동안 MyShop을 이용해 주셔서 감사합니다.
        </Typography>
        
        <Typography variant="h6" color="primary" sx={{ mb: 4 }}>
          언제든지 돌아오세요! 🙏
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          회원님의 모든 정보가 안전하게 삭제되었습니다.
          <br />
          다시 만나뵐 수 있기를 바랍니다.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{ minWidth: 200 }}
        >
          홈으로 돌아가기
        </Button>
      </Paper>
    </Container>
  )
}

export default WithdrawCompletePage
