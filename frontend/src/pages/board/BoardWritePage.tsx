import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { createBoard } from '@/api/boardApi'
import { brandColors } from '@/theme/tokens'

const BoardWritePage = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // TODO: 실제 로그인 사용자 정보 연동
  const currentUserId = localStorage.getItem('user_id') || ''
  const currentUserRole = (localStorage.getItem('role') || 'User') as 'Admin' | 'User'

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      notice: '공지사항',
      event: 'EVENT',
      qna: 'QnA',
    }
    return labels[cat] || cat
  }

  const handleBack = () => {
    navigate(`/board/${category}`)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      await createBoard({
        writer_id: currentUserId,
        title: title.trim(),
        content: content.trim(),
        board_category: category || 'qna',
        role: currentUserRole,
      })
      alert('게시글이 등록되었습니다.')
      navigate(`/board/${category}`)
    } catch (error) {
      console.error('게시글 등록 실패:', error)
      alert('게시글 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 뒤로가기 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2, color: brandColors.primary }}
      >
        {getCategoryLabel(category || '')} 목록
      </Button>

      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          {category === 'qna' ? '질문 작성' : '게시글 작성'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 카테고리 표시 */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                bgcolor: brandColors.primary,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {getCategoryLabel(category || '')}
            </Typography>
          </Box>

          {/* 제목 */}
          <TextField
            label="제목"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
          />

          {/* 내용 */}
          <TextField
            label="내용"
            fullWidth
            multiline
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
          />

          {/* 버튼 */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleBack}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !content.trim()}
              sx={{
                bgcolor: brandColors.primary,
                '&:hover': { bgcolor: '#374151' },
              }}
            >
              {submitting ? '등록 중...' : '등록'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default BoardWritePage
