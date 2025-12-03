import { Box, Container, Divider, Link as MuiLink, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

/**
 * 공통 푸터 컴포넌트
 * SPEC: 회사 정보, 약관, 개인정보처리방침, 고객센터
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* 로고 & 설명 */}
          <Box>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              MyShop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이커머스 & 커뮤니티 통합 쇼핑몰
            </Typography>
          </Box>

          <Divider />

          {/* 링크 섹션 */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            flexWrap="wrap"
          >
            <MuiLink
              component={Link}
              to="/terms"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              이용약관
            </MuiLink>
            <MuiLink
              component={Link}
              to="/privacy"
              color="text.secondary"
              underline="hover"
              variant="body2"
              fontWeight={600}
            >
              개인정보처리방침
            </MuiLink>
            <MuiLink
              component={Link}
              to="/board/notice"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              공지사항
            </MuiLink>
            <MuiLink
              component={Link}
              to="/support"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              고객센터
            </MuiLink>
          </Stack>

          <Divider />

          {/* 회사 정보 */}
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              상호명: (주)마이샵 | 대표: 홍길동
            </Typography>
            <Typography variant="body2" color="text.secondary">
              사업자등록번호: 123-45-67890 | 통신판매업신고: 2025-서울강남-12345
            </Typography>
            <Typography variant="body2" color="text.secondary">
              주소: 서울특별시 강남구 테헤란로 123 (역삼동)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              고객센터: 1588-0000 | 이메일: support@myshop.com
            </Typography>
          </Stack>

          <Divider />

          {/* 저작권 */}
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 MyShop. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
