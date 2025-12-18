import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Rating,
  CircularProgress,
  Pagination,
} from '@mui/material'
import { brandColors } from '@/theme/tokens'

// 내가 쓴 글 타입
interface MyPost {
  board_no: string
  title: string
  board_category: string
  view: number
  created_at: string
}

// 내가 쓴 리뷰 타입
interface MyReview {
  review_id: string
  item_title: string
  content: string
  score: number
  created_at: string
}

const MyPostsPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<MyPost[]>([])
  const [reviews, setReviews] = useState<MyReview[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // TODO: 실제 API 연동
        // const postsData = await fetchMyPosts()
        // const reviewsData = await fetchMyReviews()
        setPosts([])
        setReviews([])
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    setPage(1)
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      notice: '공지사항',
      event: 'EVENT',
      qna: 'QnA',
    }
    return labels[cat] || cat
  }

  const currentData = tab === 0 ? posts : reviews
  const totalPages = Math.ceil(currentData.length / pageSize)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        내가 쓴 글/리뷰
      </Typography>

      {/* 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: brandColors.primary },
            '& .MuiTabs-indicator': { backgroundColor: brandColors.primary },
          }}
        >
          <Tab label={`게시글 (${posts.length})`} />
          <Tab label={`리뷰 (${reviews.length})`} />
        </Tabs>
      </Box>

      {/* 게시글 탭 */}
      {tab === 0 && (
        <>
          {posts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ border: '1px solid #E5E7EB', p: 8, textAlign: 'center' }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                작성한 게시글이 없습니다.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/board/qna')}
                sx={{
                  bgcolor: brandColors.primary,
                  '&:hover': { bgcolor: '#374151' },
                }}
              >
                게시판 바로가기
              </Button>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: '1px solid #E5E7EB' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: 600, width: 100 }}>카테고리</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                      조회
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">
                      작성일
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.slice((page - 1) * pageSize, page * pageSize).map((post) => (
                    <TableRow
                      key={post.board_no}
                      hover
                      onClick={() =>
                        navigate(`/board/${post.board_category}/${post.board_no}`)
                      }
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{getCategoryLabel(post.board_category)}</TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell align="center">{post.view}</TableCell>
                      <TableCell align="center">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* 리뷰 탭 */}
      {tab === 1 && (
        <>
          {reviews.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ border: '1px solid #E5E7EB', p: 8, textAlign: 'center' }}
            >
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                작성한 리뷰가 없습니다.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{
                  bgcolor: brandColors.primary,
                  '&:hover': { bgcolor: '#374151' },
                }}
              >
                상품 둘러보기
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {reviews
                .slice((page - 1) * pageSize, page * pageSize)
                .map((review) => (
                  <Paper
                    key={review.review_id}
                    elevation={0}
                    sx={{ border: '1px solid #E5E7EB', p: 3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={600}>{review.item_title}</Typography>
                      <Rating value={review.score} readOnly size="small" />
                    </Box>
                    <Typography fontSize="0.875rem" color="text.secondary" sx={{ mb: 1 }}>
                      {review.content}
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.disabled">
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </Typography>
                  </Paper>
                ))}
            </Box>
          )}
        </>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}
    </>
  )
}

export default MyPostsPage
