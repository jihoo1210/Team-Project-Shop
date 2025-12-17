import { Box, Grid, Link as MuiLink, Stack, Typography, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import { YouTube, Facebook, Instagram, LinkedIn } from '@mui/icons-material'

// X(Twitter) 아이콘 커스텀
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// 소셜 미디어 링크
const socialLinks = {
  youtube: 'https://youtube.com',
  x: 'https://x.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
}

const footerLinks = {
  Resources: [
    { label: 'FAQ', path: '/faq' },
    { label: '배송 안내', path: '/shipping' },
    { label: '교환/반품', path: '/returns' },
    { label: '제휴 문의', path: '/partnership' },
  ],
  Community: [
    { label: '자유게시판', path: '/board/free' },
    { label: '스타일 공유', path: '/board/style' },
    { label: '질문과 답변', path: '/board/qna' },
    { label: '공지사항', path: '/board/notice' },
  ],
  Company: [
    { label: '회사 소개', path: '/about' },
    { label: '채용', path: '/careers' },
    { label: '고객센터', path: '/support' },
    { label: '문의하기', path: '/contact' },
  ],
  Legal: [
    { label: '이용약관', path: '/terms' },
    { label: '개인정보처리방침', path: '/privacy' },
  ],
}

/**
 * 공통 푸터 컴포넌트
 * SPEC: bubble.io 스타일 푸터
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#ffffff',
        pt: { xs: 8, md: 12 },
        pb: { xs: 4, md: 6 },
        mb: { xs: 2, md: 4 },
        mt: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
          {/* 로고 & 소셜 */}
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                fontSize: '1.8rem',
                color: '#111827',
                textDecoration: 'none',
                display: 'block',
                mb: 3,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              MyShop
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 4, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <IconButton
                component="a"
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  '&:hover': { color: '#111827' },
                  p: 0.8,
                }}
                aria-label="YouTube (새 창에서 열림)"
              >
                <YouTube sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                component="a"
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  '&:hover': { color: '#111827' },
                  p: 0.8,
                }}
                aria-label="X (새 창에서 열림)"
              >
                <XIcon />
              </IconButton>
              <IconButton
                component="a"
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  '&:hover': { color: '#111827' },
                  p: 0.8,
                }}
                aria-label="Facebook (새 창에서 열림)"
              >
                <Facebook sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                component="a"
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  '&:hover': { color: '#111827' },
                  p: 0.8,
                }}
                aria-label="Instagram (새 창에서 열림)"
              >
                <Instagram sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton
                component="a"
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  '&:hover': { color: '#111827' },
                  p: 0.8,
                }}
                aria-label="LinkedIn (새 창에서 열림)"
              >
                <LinkedIn sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem', mb: 2.5 }}>
              Resources
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.Resources.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#111827' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Community */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem', mb: 2.5 }}>
              Community
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.Community.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#111827' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem', mb: 2.5 }}>
              Company
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.Company.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#111827' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.875rem', mb: 2.5 }}>
              Legal
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.Legal.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#111827' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Footer
