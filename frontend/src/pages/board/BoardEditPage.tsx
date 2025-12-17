import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material'
import { fetchBoardDetail, updateBoard } from '@/api/boardApi'
import { brandColors } from '@/theme/tokens'
import { useAuth } from '@/hooks/useAuth'

interface AttachedFile {
  id: string
  file: File
  preview?: string
}

const BoardEditPage = () => {
  const { category, id } = useParams<{ category: string; id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, isLoggedIn } = useAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  // useAuth 훅에서 사용자 정보 가져오기
  const currentUserId = user?.userId?.toString() || ''
  const currentUserRole = (user?.role === 'ADMIN' ? 'Admin' : 'User') as 'Admin' | 'User'

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

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const maxFiles = 5
    const maxFileSize = 10 * 1024 * 1024 // 10MB

    const remainingSlots = maxFiles - attachedFiles.length
    if (remainingSlots <= 0) {
      alert('최대 5개까지 첨부할 수 있습니다.')
      return
    }

    const newFiles: AttachedFile[] = []
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]
      if (file.size > maxFileSize) {
        alert(`파일 "${file.name}"이 10MB를 초과합니다.`)
        continue
      }
      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
    }

    setAttachedFiles((prev) => [...prev, ...newFiles])
    event.target.value = ''
  }

  // 파일 제거
  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  // 파일 아이콘 반환
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon />
    if (file.type === 'application/pdf') return <PdfIcon />
    return <FileIcon />
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleBack = () => {
    navigate(`/board/${category}/${id}`)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (!isLoggedIn || !currentUserId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      await updateBoard(id!, {
        title: title.trim(),
        content: content.trim(),
        board_category: category || 'qna',
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
    <Container maxWidth="md" sx={{ py: 4 }}>
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

          {/* 파일 첨부 */}
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={attachedFiles.length >= 5}
            >
              파일 첨부 ({attachedFiles.length}/5)
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              최대 5개, 파일당 10MB까지
            </Typography>

            {/* 첨부된 파일 목록 */}
            {attachedFiles.length > 0 && (
              <List dense sx={{ mt: 1 }}>
                {attachedFiles.map((attached) => (
                  <ListItem key={attached.id} sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getFileIcon(attached.file)}
                    </ListItemIcon>
                    <ListItemText
                      primary={attached.file.name}
                      secondary={formatFileSize(attached.file.size)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => handleRemoveFile(attached.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

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
