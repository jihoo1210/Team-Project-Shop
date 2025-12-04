import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { fetchBoardDetail, updateBoard } from '@/api/boardApi'
import { brandColors } from '@/theme/tokens'

/**
 * 게시글 수정 페이지
 * - 기존 게시글 데이터 로드
 * - 제목/내용 수정
 * - 수정 완료 후 상세 페이지로 이동
 */
const BoardEditPage = () => {
  const { category, id } = useParams<{ category: string; id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 현재 로그인 사용자 정보
  const currentUserId = localStorage.getItem('user_id') || ''
  const currentUserRole = (localStorage.getItem('role') || 'User') as 'Admin' | 'User'

  // 기존 게시글 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return
      setLoading(true)
      try {
        // location.state에서 전달된 데이터가 있으면 사용
        if (location.state?.post) {
          const post = location.state.post
          setTitle(post.title)
          setContent(post.content)
        } else {
          // 없으면 API 호출
          const postData = await fetchBoardDetail(id)
          setTitle(postData.title)
          setContent(postData.content)
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error)
        alert('게시글을 불러오는데 실패했습니다.')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id, location.state, navigate])

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      notice: '공지사항',
      event: 'EVENT',
      qna: 'QnA',
    }
    return labels[cat] || cat
  }

  const handleBack = () => {
    navigate(`/board/${category}/${id}`)
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
      await updateBoard({
        board_no: id!,
        writer_id: currentUserId,
        title: title.trim(),
        content: content.trim(),
        board_category: category || 'qna',
        role: currentUserRole,
      })
      alert('게시글이 수정되었습니다.')
      navigate(`/board/${category}/${id}`)
    } catch (error) {
      console.error('게시글 수정 실패:', error)
      alert('게시글 수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 뒤로가기 */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2, color: brandColors.primary }}
      >
        상세 페이지로 돌아가기
      </Button>

      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          게시글 수정
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
              {submitting ? '수정 중...' : '수정 완료'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default BoardEditPage
