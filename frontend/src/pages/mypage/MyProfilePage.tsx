import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  School as SchoolIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { fetchUser, updateUser, deleteUser, updatePassword } from '@/api/userApi'
import { useAuth } from '@/hooks/useAuth'
import { useDaumPostcode } from '@/hooks/useDaumPostcode'
import type { UserProfile } from '@/types/api'

// 배송지 타입
interface Address {
  id: string
  label: string
  name: string
  phone: string
  zipcode: string
  address: string
  addressDetail: string
  isDefault: boolean
}

const addressIcons: Record<string, React.ReactNode> = {
  '집': <HomeIcon />,
  '직장': <WorkIcon />,
  '학교': <SchoolIcon />,
}

/**
 * 마이페이지 - 내 정보
 * SPEC:
 * - 기본 정보 (이름, 이메일, 전화번호, 주소)
 * - 주소 관리 (기본 배송지 / 추가 배송지 최대 3개)
 * - 비밀번호 변경
 * - 회원 탈퇴
 */
const MyProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { openPostcode } = useDaumPostcode()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // 배송지 관리
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: '집',
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
  })

  // 비밀번호 변경
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // 회원탈퇴 모달
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawPassword, setWithdrawPassword] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await fetchUser()
      setProfile(data)
      setEditedProfile({
        name: data.username || '',
        phone: data.phone || '',
        email: data.email || '',
      })
      // 기본 배송지 설정
      if (data.addr) {
        setAddresses([{
          id: '1',
          label: '집',
          name: data.username || '',
          phone: data.phone || '',
          zipcode: data.zipCode || '',
          address: data.addr || '',
          addressDetail: data.addrDetail || '',
          isDefault: true,
        }])
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error)
      setSnackbar({ open: true, message: '프로필을 불러오는데 실패했습니다.', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing && profile) {
      setEditedProfile({
        name: profile.username || '',
        phone: profile.phone || '',
        email: profile.email || '',
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field: keyof typeof editedProfile) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedProfile(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await updateUser({
        username: editedProfile.name,
        phone: editedProfile.phone,
        email: editedProfile.email,
      })
      setProfile(prev => (prev ? { ...prev, username: editedProfile.name, phone: editedProfile.phone, email: editedProfile.email } : null))
      setIsEditing(false)
      setSnackbar({ open: true, message: '프로필이 저장되었습니다.', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: '프로필 저장에 실패했습니다.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // 배송지 관리
  const handleOpenAddressDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setNewAddress({
        label: address.label,
        name: address.name,
        phone: address.phone,
        zipcode: address.zipcode,
        address: address.address,
        addressDetail: address.addressDetail,
      })
    } else {
      setEditingAddress(null)
      setNewAddress({
        label: '집',
        name: editedProfile.name,
        phone: editedProfile.phone,
        zipcode: '',
        address: '',
        addressDetail: '',
      })
    }
    setAddressDialogOpen(true)
  }

  const handleSearchAddress = () => {
    openPostcode((result) => {
      setNewAddress(prev => ({
        ...prev,
        zipcode: result.zonecode,
        address: result.address,
      }))
    })
  }

  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      setSnackbar({ open: true, message: '필수 정보를 입력해주세요.', severity: 'error' })
      return
    }

    if (editingAddress) {
      // 수정
      setAddresses(prev => prev.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...newAddress }
          : addr
      ))
    } else {
      // 추가
      const newAddr: Address = {
        id: Date.now().toString(),
        ...newAddress,
        isDefault: addresses.length === 0,
      }
      setAddresses(prev => [...prev, newAddr])
    }

    setAddressDialogOpen(false)
    setSnackbar({ open: true, message: '배송지가 저장되었습니다.', severity: 'success' })
  }

  const handleDeleteAddress = (id: string) => {
    const addr = addresses.find(a => a.id === id)
    if (addr?.isDefault && addresses.length > 1) {
      setSnackbar({ open: true, message: '기본 배송지는 삭제할 수 없습니다. 다른 배송지를 기본으로 설정해주세요.', severity: 'error' })
      return
    }
    setAddresses(prev => prev.filter(a => a.id !== id))
    setSnackbar({ open: true, message: '배송지가 삭제되었습니다.', severity: 'success' })
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })))
    setSnackbar({ open: true, message: '기본 배송지가 변경되었습니다.', severity: 'success' })
  }

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    setPasswordError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSnackbar({ open: true, message: '비밀번호가 변경되었습니다.', severity: 'success' })
    } catch {
      setPasswordError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.')
    }
  }

  // 회원탈퇴 처리
  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      return
    }

    try {
      setWithdrawLoading(true)
      await deleteUser()
      logout()
      navigate('/withdraw-complete', { replace: true })
    } catch {
      setSnackbar({ open: true, message: '회원 탈퇴에 실패했습니다.', severity: 'error' })
    } finally {
      setWithdrawLoading(false)
      setWithdrawOpen(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>로딩 중...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: { xs: 3, md: 4 } }}>
        내 정보
      </Typography>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* 프로필 정보 */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                프로필 정보
              </Typography>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                onClick={handleEditToggle}
              >
                {isEditing ? '취소' : '수정'}
              </Button>
            </Box>

            {/* 아바타 - 가운데 정렬, 아래로 배치 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', mb: 2 }}>
                <PersonIcon sx={{ fontSize: 70 }} />
              </Avatar>
              {isEditing && (
                <Button variant="outlined" size="small">
                  이미지 변경
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="이메일"
                  fullWidth
                  value={editedProfile.email}
                  disabled
                  helperText="이메일은 변경할 수 없습니다"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="이름"
                  fullWidth
                  value={editedProfile.name}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="연락처"
                  fullWidth
                  value={editedProfile.phone}
                  onChange={handleInputChange('phone')}
                  disabled={!isEditing}
                  placeholder="010-0000-0000"
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : '저장'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 배송지 관리 */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                배송지 관리
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAddressDialog()}
              >
                배송지 추가
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              배송지를 등록하고 관리할 수 있습니다.
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {addresses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">등록된 배송지가 없습니다.</Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => handleOpenAddressDialog()}
                >
                  배송지 등록하기
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {addresses.map((addr) => (
                  <Card key={addr.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {addressIcons[addr.label] || <HomeIcon />}
                          <Typography fontWeight="bold">{addr.label}</Typography>
                          {addr.isDefault && (
                            <Chip label="기본" size="small" color="primary" />
                          )}
                        </Box>
                        <Box>
                          {!addr.isDefault && (
                            <Button size="small" onClick={() => handleSetDefaultAddress(addr.id)}>
                              기본으로 설정
                            </Button>
                          )}
                          <IconButton size="small" onClick={() => handleOpenAddressDialog(addr)}>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteAddress(addr.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2">{addr.name} / {addr.phone}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        [{addr.zipcode}] {addr.address} {addr.addressDetail}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* 비밀번호 변경 */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              비밀번호 변경
            </Typography>
            <Divider sx={{ my: 3 }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <TextField
                label="현재 비밀번호"
                type="password"
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <TextField
                label="새 비밀번호"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                helperText="8자 이상 입력해주세요"
              />
              <TextField
                label="새 비밀번호 확인"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
              <Button
                variant="contained"
                onClick={handlePasswordChange}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                비밀번호 변경
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* 회원 탈퇴 */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
              회원 탈퇴
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => setWithdrawOpen(true)}
            >
              회원 탈퇴
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 배송지 추가/수정 모달 */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? '배송지 수정' : '배송지 추가'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="배송지 이름"
              fullWidth
              value={newAddress.label}
              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
              SelectProps={{ native: true }}
            >
              <option value="집">집</option>
              <option value="직장">직장</option>
              <option value="학교">학교</option>
            </TextField>
            <TextField
              label="수령인"
              fullWidth
              required
              value={newAddress.name}
              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="연락처"
              fullWidth
              required
              value={newAddress.phone}
              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="우편번호"
                value={newAddress.zipcode}
                InputProps={{ readOnly: true }}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleSearchAddress} startIcon={<SearchIcon />}>
                주소 검색
              </Button>
            </Box>
            <TextField
              label="주소"
              fullWidth
              required
              value={newAddress.address}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="상세주소"
              fullWidth
              value={newAddress.addressDetail}
              onChange={(e) => setNewAddress(prev => ({ ...prev, addressDetail: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleSaveAddress}>저장</Button>
        </DialogActions>
      </Dialog>

      {/* 회원탈퇴 확인 모달 */}
      <Dialog open={withdrawOpen} onClose={() => setWithdrawOpen(false)}>
        <DialogTitle>회원 탈퇴</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            정말로 탈퇴하시겠습니까?
            <br />
            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </DialogContentText>
          <TextField
            autoFocus
            label="비밀번호 확인"
            type="password"
            fullWidth
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawOpen(false)}>취소</Button>
          <Button 
            onClick={handleWithdraw} 
            color="error"
            disabled={!withdrawPassword || withdrawLoading}
          >
            {withdrawLoading ? <CircularProgress size={20} /> : '탈퇴하기'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MyProfilePage

