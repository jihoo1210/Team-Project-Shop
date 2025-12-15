import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Avatar,
  Divider,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { createReview, updateReview, deleteReview } from '@/api/reviewApi'
import type { ReviewListItem } from '@/types/api'
import { brandColors } from '@/theme/tokens'
import { useAuth } from '@/hooks/useAuth'

interface ReviewSectionProps {
  itemId: string
  reviews: ReviewListItem[]
  onReviewChange: () => void
}

/**
 * 리뷰 섹션 컴포넌트
 * - 리뷰 목록 표시
 * - 리뷰 작성/수정/삭제 기능
 */
const ReviewSection = ({ itemId, reviews, onReviewChange }: ReviewSectionProps) => {
  const { user, isLoggedIn } = useAuth()

  // useAuth 훅에서 사용자 정보 가져오기
  const currentUserId = user?.userId?.toString() || ''
  const currentUserRole = user?.role || 'User'

  // 리뷰 작성 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [writeScore, setWriteScore] = useState<number>(5)
  const [writeContent, setWriteContent] = useState('')
  const [writeSubmitting, setWriteSubmitting] = useState(false)

  // 리뷰 수정 상태
  const [editingReview, setEditingReview] = useState<ReviewListItem | null>(null)
  const [editScore, setEditScore] = useState<number>(5)
  const [editContent, setEditContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)

  // 평균 별점 계산
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length
    : 0

  // 리뷰 작성 핸들러
  const handleWriteSubmit = async () => {
    if (!writeContent.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }
    if (!isLoggedIn || !currentUserId) {
      alert('로그인이 필요합니다.')
      return
    }

    setWriteSubmitting(true)
    try {
      await createReview(itemId, {
        writer_id: currentUserId,
        score: writeScore,
        content: writeContent.trim(),
      })
      alert('리뷰가 등록되었습니다.')
      setIsWriteModalOpen(false)
      setWriteScore(5)
      setWriteContent('')
      onReviewChange()
    } catch (error) {
      console.error('리뷰 등록 실패:', error)
      alert('리뷰 등록에 실패했습니다.')
    } finally {
      setWriteSubmitting(false)
    }
  }

  // 리뷰 수정 시작
  const handleEditStart = (review: ReviewListItem) => {
    setEditingReview(review)
    setEditScore(review.score)
    setEditContent(review.content)
  }

  // 리뷰 수정 핸들러
  const handleEditSubmit = async () => {
    if (!editingReview) return
    if (!editContent.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    setEditSubmitting(true)
    try {
      await updateReview(editingReview.review_no, {
        writer_id: currentUserId,
        score: editScore,
        content: editContent.trim(),
        role: currentUserRole as 'Admin' | 'User',
      })
      alert('리뷰가 수정되었습니다.')
      setEditingReview(null)
      onReviewChange()
    } catch (error) {
      console.error('리뷰 수정 실패:', error)
      alert('리뷰 수정에 실패했습니다.')
    } finally {
      setEditSubmitting(false)
    }
  }

  // 리뷰 삭제 핸들러
  const handleDelete = async (review: ReviewListItem) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return

    try {
      await deleteReview(review.review_no)
      alert('리뷰가 삭제되었습니다.')
      onReviewChange()
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)
      alert('리뷰 삭제에 실패했습니다.')
    }
  }

  // 사용자가 이미 리뷰를 작성했는지 확인
  const hasUserReview = reviews.some((r) => r.writer_id === currentUserId)

  return (
    <Box sx={{ minHeight: 300 }}>
      {/* 리뷰 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            상품 리뷰
          </Typography>
          {reviews.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Rating value={averageRating} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({averageRating.toFixed(1)}) · {reviews.length}개 리뷰
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* 리뷰 작성 버튼 - 로그인하고 아직 리뷰 안 쓴 경우만 */}
        {currentUserId && !hasUserReview && (
          <Button
            variant="contained"
            onClick={() => setIsWriteModalOpen(true)}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: brandColors.primaryHover },
            }}
          >
            리뷰 작성
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 리뷰 목록 */}
      {reviews.length > 0 ? (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Box
              key={review.review_no}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: brandColors.primary }}>
                    {review.writer_id.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} fontSize="0.875rem">
                      {review.writer_id}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating value={review.score} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* 수정/삭제 버튼 */}
                {(review.writer_id === currentUserId || currentUserRole === 'Admin') && (
                  <Stack direction="row" spacing={0.5}>
                    {review.writer_id === currentUserId && (
                      <IconButton size="small" onClick={() => handleEditStart(review)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => handleDelete(review)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </Box>

              <Typography sx={{ mt: 2, lineHeight: 1.6 }}>{review.content}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">아직 작성된 리뷰가 없습니다.</Typography>
          {currentUserId && (
            <Button
              variant="outlined"
              onClick={() => setIsWriteModalOpen(true)}
              sx={{ mt: 2 }}
            >
              첫 리뷰를 작성해보세요!
            </Button>
          )}
        </Box>
      )}

      {/* 리뷰 작성 모달 */}
      <Dialog
        open={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          리뷰 작성
          <IconButton
            onClick={() => setIsWriteModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography gutterBottom>별점</Typography>
            <Rating
              value={writeScore}
              onChange={(_, value) => setWriteScore(value || 5)}
              size="large"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="리뷰 내용"
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
              value={writeContent}
              onChange={(e) => setWriteContent(e.target.value)}
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWriteModalOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleWriteSubmit}
            disabled={writeSubmitting || !writeContent.trim()}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: brandColors.primaryHover },
            }}
          >
            {writeSubmitting ? '등록 중...' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 리뷰 수정 모달 */}
      <Dialog
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          리뷰 수정
          <IconButton
            onClick={() => setEditingReview(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography gutterBottom>별점</Typography>
            <Rating
              value={editScore}
              onChange={(_, value) => setEditScore(value || 5)}
              size="large"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="리뷰 내용"
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingReview(null)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={editSubmitting || !editContent.trim()}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: brandColors.primaryHover },
            }}
          >
            {editSubmitting ? '수정 중...' : '수정'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ReviewSection
