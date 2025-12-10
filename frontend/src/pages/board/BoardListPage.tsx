import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  Chip,
} from '@mui/material'
import { Create as CreateIcon } from '@mui/icons-material'
import { fetchBoardList } from '@/api/boardApi'
import type { BoardListItem, PaginatedResponse } from '@/types/api'
import { brandColors } from '@/theme/tokens'

const BOARD_CATEGORIES = [
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: 'EVENT' },
  { value: 'qna', label: 'QnA' },
] as const

type BoardCategory = (typeof BOARD_CATEGORIES)[number]['value']

const BoardListPage = () => {
  const { category } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentCategory = (category || 'notice') as BoardCategory
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [boardData, setBoardData] = useState<PaginatedResponse<BoardListItem> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBoardList = async () => {
      setLoading(true)
      try {
        const data = await fetchBoardList({
          category: currentCategory,
          page: currentPage - 1,
          size: 15,
        })
        setBoardData(data)
      } catch (error) {
        console.error('게시판 목록 로드 실패:', error)
        setBoardData({
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 15,
          number: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    loadBoardList()
  }, [currentCategory, currentPage])

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: BoardCategory) => {
    navigate(`/board/${newValue}`)
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: page.toString() })
  }

  const handleRowClick = (boardNo: string) => {
    navigate(`/board/${currentCategory}/${boardNo}`)
  }

  const handleWrite = () => {
    navigate(`/board/${currentCategory}/write`)
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3, color: brandColors.primary }}>
        게시판
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={currentCategory}
          onChange={handleCategoryChange}
          sx={{
            '& .MuiTab-root': { fontWeight: 600, fontSize: '1rem' },
            '& .Mui-selected': { color: brandColors.primary },
            '& .MuiTabs-indicator': { backgroundColor: brandColors.primary },
          }}
        >
          {BOARD_CATEGORIES.map((cat) => (
            <Tab key={cat.value} value={cat.value} label={cat.label} />
          ))}
        </Tabs>
      </Box>

      {currentCategory === 'qna' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={handleWrite}
            sx={{ bgcolor: brandColors.primary, '&:hover': { bgcolor: '#374151' } }}
          >
            질문하기
          </Button>
        </Box>
      )}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">번호</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">작성자</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">조회</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">로딩 중...</Typography>
                </TableCell>
              </TableRow>
            ) : !boardData?.content || boardData.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">등록된 게시글이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              boardData.content.map((post, index) => (
                <TableRow
                  key={post.board_no}
                  hover
                  onClick={() => handleRowClick(post.board_no)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="center">
                    {boardData.totalElements - (currentPage - 1) * 15 - index}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {currentCategory === 'notice' && (
                        <Chip
                          label="공지"
                          size="small"
                          sx={{ bgcolor: brandColors.primary, color: 'white', fontSize: '0.75rem', height: 22 }}
                        />
                      )}
                      {currentCategory === 'event' && (
                        <Chip label="EVENT" size="small" color="error" sx={{ fontSize: '0.75rem', height: 22 }} />
                      )}
                      <Typography sx={{ '&:hover': { textDecoration: 'underline' } }}>
                        {post.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{post.writer_id}</TableCell>
                  <TableCell align="center">{post.view}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {boardData && boardData.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={boardData.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default BoardListPage
