import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { fetchBoardList, deleteBoard, createBoard } from '@/api/boardApi'
import type { BoardListItem, PaginatedResponse } from '@/types/api'
import { brandColors } from '@/theme/tokens'

const CATEGORIES = [
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: 'EVENT' },
  { value: 'qna', label: 'QnA' },
] as const

const AdminBoardPage = () => {
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('notice')
  const [boardData, setBoardData] = useState<PaginatedResponse<BoardListItem> | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    const loadBoard = async () => {
      setLoading(true)
      try {
        const data = await fetchBoardList({ category, page: page - 1, size: 15 })
        setBoardData(data)
      } catch (error) {
        console.error('게시판 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBoard()
  }, [category, page])

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setCategory(newValue)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 검색 로직 추가
  }

  const handleAdd = () => {
    setFormData({ title: '', content: '' })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }
    try {
      await createBoard({
        title: formData.title,
        content: formData.content,
        board_category: category,
      })
      alert('등록되었습니다.')
      setDialogOpen(false)
      // 새로고침
      const data = await fetchBoardList({ category, page: page - 1, size: 15 })
      setBoardData(data)
    } catch (error) {
      console.error('등록 실패:', error)
      alert('등록에 실패했습니다.')
    }
  }

  const handleDelete = async (post: BoardListItem) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteBoard(post.board_no)
      alert('삭제되었습니다.')
      // 새로고침
      const data = await fetchBoardList({ category, page: page - 1, size: 15 })
      setBoardData(data)
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const getCategoryLabel = (cat: string) => {
    return CATEGORIES.find((c) => c.value === cat)?.label || cat
  }

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          게시판 관리
        </Typography>
        {(category === 'notice' || category === 'event') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: '#374151' },
            }}
          >
            {getCategoryLabel(category)} 작성
          </Button>
        )}
      </Box>

      {/* 카테고리 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={category}
          onChange={handleCategoryChange}
          sx={{
            '& .MuiTab-root': { fontWeight: 600 },
            '& .Mui-selected': { color: brandColors.primary },
            '& .MuiTabs-indicator': { backgroundColor: brandColors.primary },
          }}
        >
          {CATEGORIES.map((cat) => (
            <Tab key={cat.value} value={cat.value} label={cat.label} />
          ))}
        </Tabs>
      </Box>

      {/* 검색 */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="제목 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button type="submit" variant="outlined">
            검색
          </Button>
        </Box>
      </Paper>

      {/* 게시글 목록 테이블 */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                번호
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">
                작성자
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                조회
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                관리
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : boardData?.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">등록된 게시글이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              boardData?.content.map((post, index) => (
                <TableRow key={post.board_no} hover>
                  <TableCell align="center">
                    {boardData.totalElements - (page - 1) * 15 - index}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category === 'notice' && (
                        <Chip
                          label="공지"
                          size="small"
                          sx={{
                            bgcolor: brandColors.primary,
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      )}
                      {category === 'event' && (
                        <Chip label="EVENT" size="small" color="error" sx={{ fontSize: '0.7rem', height: 20 }} />
                      )}
                      <Typography>{post.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{post.writer_id}</TableCell>
                  <TableCell align="center">{post.view}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => {/* TODO: 수정 */}}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(post)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      {boardData && boardData.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={boardData.totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}

      {/* 게시글 작성 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={600}>
          {getCategoryLabel(category)} 작성
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="제목"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="내용"
              fullWidth
              multiline
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: brandColors.primary, '&:hover': { bgcolor: '#374151' } }}
          >
            등록
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminBoardPage
