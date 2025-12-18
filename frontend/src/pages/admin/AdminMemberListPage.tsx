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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
  Avatar,
} from '@mui/material'
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { brandColors } from '@/theme/tokens'

// 회원 타입
interface Member {
  user_no: number
  user_id: string
  user_name: string
  user_email: string
  user_phone: string
  role: string
  status: 'active' | 'blocked'
  created_at: string
}

const AdminMemberListPage = () => {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const pageSize = 15

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true)
      try {
        // TODO: 실제 API 연동
        // const data = await fetchMembers({ page: page - 1, size: pageSize, search })
        setMembers([])
      } catch (error) {
        console.error('회원 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMembers()
  }, [page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleViewDetail = (member: Member) => {
    setSelectedMember(member)
    setDetailOpen(true)
  }

  const handleToggleBlock = async (member: Member) => {
    const action = member.status === 'active' ? '차단' : '차단 해제'
    if (!window.confirm(`${member.user_name}님을 ${action}하시겠습니까?`)) return
    try {
      // TODO: API 연동
      alert(`${action}되었습니다.`)
    } catch (error) {
      console.error(`${action} 실패:`, error)
    }
  }

  const handleDelete = async (member: Member) => {
    if (!window.confirm(`${member.user_name}님을 삭제하시겠습니까?`)) return
    try {
      // TODO: API 연동
      alert('삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  const getRoleChip = (role: string) => {
    const roleMap: Record<string, { label: string; color: 'primary' | 'default' }> = {
      Admin: { label: '관리자', color: 'primary' },
      User: { label: '일반회원', color: 'default' },
    }
    const config = roleMap[role] || { label: role, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getStatusChip = (status: 'active' | 'blocked') => {
    return status === 'active' ? (
      <Chip label="정상" color="success" size="small" />
    ) : (
      <Chip label="차단됨" color="error" size="small" />
    )
  }

  const filteredMembers = members.filter(
    (m) =>
      m.user_name.includes(search) ||
      m.user_id.includes(search) ||
      m.user_email.includes(search)
  )
  const totalPages = Math.ceil(filteredMembers.length / pageSize)
  const displayedMembers = filteredMembers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        회원 관리
      </Typography>

      {/* 검색 */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="이름, 아이디, 이메일 검색"
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

      {/* 회원 목록 테이블 */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, width: 60 }}></TableCell>
              <TableCell sx={{ fontWeight: 600 }}>이름</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>아이디</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>이메일</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                권한
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                상태
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                가입일
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }} align="center">
                관리
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : displayedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">등록된 회원이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedMembers.map((member) => (
                <TableRow key={member.user_no} hover>
                  <TableCell>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: brandColors.primary }}>
                      {member.user_name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontWeight={500}
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => handleViewDetail(member)}
                    >
                      {member.user_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{member.user_id}</TableCell>
                  <TableCell>{member.user_email}</TableCell>
                  <TableCell align="center">{getRoleChip(member.role)}</TableCell>
                  <TableCell align="center">{getStatusChip(member.status)}</TableCell>
                  <TableCell align="center">
                    {new Date(member.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleToggleBlock(member)}
                      title={member.status === 'active' ? '차단' : '차단 해제'}
                    >
                      {member.status === 'active' ? (
                        <BlockIcon fontSize="small" color="warning" />
                      ) : (
                        <CheckCircleIcon fontSize="small" color="success" />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(member)}
                      title="삭제"
                    >
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

      {/* 회원 상세 다이얼로그 */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>회원 상세 정보</DialogTitle>
        <DialogContent dividers>
          {selectedMember && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: brandColors.primary, fontSize: '1.5rem' }}>
                  {selectedMember.user_name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {selectedMember.user_name}
                  </Typography>
                  <Typography color="text.secondary">@{selectedMember.user_id}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  이메일
                </Typography>
                <Typography>{selectedMember.user_email}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  연락처
                </Typography>
                <Typography>{selectedMember.user_phone}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  권한
                </Typography>
                {getRoleChip(selectedMember.role)}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  상태
                </Typography>
                {getStatusChip(selectedMember.status)}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  가입일
                </Typography>
                <Typography>
                  {new Date(selectedMember.created_at).toLocaleString('ko-KR')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminMemberListPage
