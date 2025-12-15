import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { createBoard, uploadBoardFiles } from '@/api/boardApi'
import { brandColors } from '@/theme/tokens'
import { useAuth } from '@/hooks/useAuth'

interface AttachedFile {
  id: string
  file: File
  preview?: string
}

const BoardWritePage = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, isLoggedIn } = useAuth()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [submitting, setSubmitting] = useState(false)

  // useAuth 훅에서 사용자 정보 가져오기
  const currentUserId = user?.userId?.toString() || ''
  const currentUserRole = (user?.role === 'ADMIN' ? 'Admin' : 'User') as 'Admin' | 'User'

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

  // 파일 첨부 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: AttachedFile[] = []
    Array.from(files).forEach((file) => {
      // 최대 5개까지만 첨부 가능
      if (attachedFiles.length + newFiles.length >= 5) {
        alert('파일은 최대 5개까지 첨부할 수 있습니다.')
        return
      }

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: 파일 크기는 10MB를 초과할 수 없습니다.`)
        return
      }

      const attachedFile: AttachedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
      }

      // 이미지인 경우 미리보기 생성
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          attachedFile.preview = event.target?.result as string
          setAttachedFiles((prev) => [...prev, attachedFile])
        }
        reader.readAsDataURL(file)
      } else {
        newFiles.push(attachedFile)
      }
    })

    if (newFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }

    // input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 첨부 파일 삭제
  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  // 파일 아이콘 반환
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon />
    }
    return <FileIcon />
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
      // 파일 업로드 처리
      let fileUrls: string[] = []
      if (attachedFiles.length > 0) {
        const files = attachedFiles.map(f => f.file)
        const uploadResult = await uploadBoardFiles(files)
        fileUrls = uploadResult.fileUrls
      }

      await createBoard({
        writer_id: currentUserId,
        title: title.trim(),
        content: content.trim(),
        board_category: category || 'qna',
        role: currentUserRole,
        files: fileUrls, // 업로드된 파일 URL 목록
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
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              {submitting ? '등록 중...' : '등록'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default BoardWritePage
