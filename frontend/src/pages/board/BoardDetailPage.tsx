import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Link,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import { fetchBoardDetail, fetchComments, createComment, updateComment, deleteBoard, deleteComment, getBoardImageUrl, downloadBoardFile, type BoardDetail } from '@/api/boardApi'
import type { CommentListItem } from '@/types/api'
import { brandColors } from '@/theme/tokens'
import { useAuth } from '@/hooks/useAuth'

const BoardDetailPage = () => {
  const { category, id } = useParams<{ category: string; id: string }>()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()

  const [post, setPost] = useState<BoardDetail | null>(null)
  const [comments, setComments] = useState<CommentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  // useAuth 훅에서 사용자 정보 가져오기
  const currentUserId = user?.userId?.toString() || ''
  const currentUserRole = user?.role || 'User'

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [postData, commentsData] = await Promise.all([
          fetchBoardDetail(id),
          fetchComments(id),
        ])
        setPost(postData)
        setComments(commentsData)
      } catch (error) {
        console.error('게시글 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleBack = () => {
    navigate(`/board/${category}`)
  }

  const handleDelete = async () => {
    if (!post || !window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteBoard(post.board_no.toString())
      alert('삭제되었습니다.')
      navigate(`/board/${category}`)
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  // 파일 다운로드 핸들러
  const handleFileDownload = async (fileNo: number, filename: string) => {
    try {
      const blob = await downloadBoardFile(fileNo)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('파일 다운로드 실패:', error)
      alert('파일 다운로드에 실패했습니다.')
    }
  }

  // 이미지 파일 여부 확인
  const isImageFile = (ext: string) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase())
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !id) return
    setSubmitting(true)
    try {
      await createComment(id, { coComment: newComment })
      setNewComment('')
      // 댓글 새로고침
      const commentsData = await fetchComments(id)
      setComments(commentsData)
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (coNo: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await deleteComment(coNo)
      // 댓글 새로고침
      if (id) {
        const commentsData = await fetchComments(id)
        setComments(commentsData)
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
    }
  }

  // 댓글 수정 시작
  const handleEditCommentStart = (comment: CommentListItem) => {
    setEditingCommentId(comment.co_no.toString())
    setEditingCommentContent(comment.co_comment)
  }

  // 댓글 수정 취소
  const handleEditCommentCancel = () => {
    setEditingCommentId(null)
    setEditingCommentContent('')
  }

  // 댓글 수정 제출
  const handleEditCommentSubmit = async () => {
    if (!editingCommentId || !editingCommentContent.trim()) return
    setEditSubmitting(true)
    try {
      await updateComment(editingCommentId, { coComment: editingCommentContent.trim() })
      // 댓글 새로고침
      if (id) {
        const commentsData = await fetchComments(id)
        setComments(commentsData)
      }
      setEditingCommentId(null)
      setEditingCommentContent('')
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
    } finally {
      setEditSubmitting(false)
    }
  }

  // 게시글 수정 페이지로 이동
  const handleEditPost = () => {
    navigate(`/board/${category}/${id}/edit`, { state: { post } })
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      notice: '공지사항',
      event: 'EVENT',
      qna: 'QnA',
    }
    return labels[cat] || cat
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography color="text.secondary">게시글을 찾을 수 없습니다.</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          목록으로 돌아가기
        </Button>
      </Container>
    )
  }

  const isAuthor = post.writer_id.toString() === currentUserId
  const canDelete = isAuthor || currentUserRole === 'Admin'

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

      {/* 게시글 헤더 */}
      <Paper elevation={0} sx={{ border: `1px solid ${brandColors.border}`, p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              bgcolor: brandColors.primary,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
            }}
          >
            {getCategoryLabel(post.board_category)}
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          {post.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography color="text.secondary" fontSize="0.875rem">
              작성자: {post.writer_name}
            </Typography>
            <Typography color="text.secondary" fontSize="0.875rem">
              {new Date(post.reg_date).toLocaleDateString('ko-KR')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" fontSize="0.875rem">
                {post.view}
              </Typography>
            </Box>
          </Box>

          {canDelete && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isAuthor && (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditPost}
                >
                  수정
                </Button>
              )}
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                삭제
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* 게시글 내용 */}
      <Paper elevation={0} sx={{ border: `1px solid ${brandColors.border}`, p: 3, mb: 3 }}>
        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            minHeight: 200,
          }}
        >
          {post.content}
        </Typography>

        {/* 이미지 미리보기 */}
        {post.files && post.files.filter(f => isImageFile(f.file_ext)).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              첨부 이미지
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {post.files.filter(f => isImageFile(f.file_ext)).map((file) => (
                <Box
                  key={file.file_no}
                  component="img"
                  src={getBoardImageUrl(file.file_no)}
                  alt={file.origin_filename}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    borderRadius: 1,
                    border: `1px solid ${brandColors.border}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => window.open(getBoardImageUrl(file.file_no), '_blank')}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 첨부파일 목록 */}
        {post.files && post.files.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttachFileIcon fontSize="small" />
              첨부파일 ({post.files.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {post.files.map((file) => (
                <Box
                  key={file.file_no}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    bgcolor: brandColors.background,
                    borderRadius: 1,
                  }}
                >
                  <Typography fontSize="0.875rem">
                    {file.origin_filename} ({(file.file_size / 1024).toFixed(1)} KB)
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleFileDownload(file.file_no, file.origin_filename)}
                    title="다운로드"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* 댓글 섹션 (QnA만) */}
      {category === 'qna' && (
        <Paper elevation={0} sx={{ border: `1px solid ${brandColors.border}`, p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            답변 ({comments.length})
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              아직 답변이 없습니다.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {comments.map((comment) => (
                <Box
                  key={comment.co_no}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    bgcolor: brandColors.background,
                    borderRadius: 1,
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: brandColors.primary }}>
                    {comment.writer_name?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={600} fontSize="0.875rem">
                        {comment.writer_name}
                      </Typography>
                      {(comment.writer_id.toString() === currentUserId ||
                        currentUserRole === 'Admin') && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {comment.writer_id.toString() === currentUserId && (
                            <IconButton
                              size="small"
                              onClick={() => handleEditCommentStart(comment)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(comment.co_no.toString())}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    {/* 수정 모드 */}
                    {editingCommentId === comment.co_no.toString() ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                          size="small"
                        />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button size="small" onClick={handleEditCommentCancel}>
                            취소
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleEditCommentSubmit}
                            disabled={editSubmitting || !editingCommentContent.trim()}
                            sx={{
                              bgcolor: brandColors.primary,
                              '&:hover': { bgcolor: brandColors.primaryHover },
                            }}
                          >
                            {editSubmitting ? '수정 중...' : '수정'}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography fontSize="0.875rem">{comment.co_comment}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* 댓글 작성 폼 */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="답변을 작성해주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isLoggedIn}
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={submitting || !newComment.trim() || !isLoggedIn}
              sx={{
                bgcolor: brandColors.primary,
                '&:hover': { bgcolor: brandColors.primaryHover },
                minWidth: 100,
                alignSelf: 'flex-end',
              }}
            >
              {submitting ? '작성 중...' : '등록'}
            </Button>
          </Box>
          {!isLoggedIn && (
            <Typography color="text.secondary" fontSize="0.875rem" sx={{ mt: 1 }}>
              답변을 작성하려면{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ color: brandColors.primary, fontWeight: 600 }}
              >
                로그인
              </Link>
              이 필요합니다.
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  )
}

export default BoardDetailPage
