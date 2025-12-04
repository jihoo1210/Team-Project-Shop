import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import { fetchUser, updateUser, deleteUser } from '@/api/userApi'
import type { UserProfile } from '@/types/api'
import { brandColors } from '@/theme/tokens'

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; address: string }) => void
      }) => { open: () => void }
    }
  }
}

const MyProfilePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    call: '',
    zipCode: '',
    addr: '',
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUser()
        setProfile(data)
        setForm({
          name: data.name,
          email: data.email,
          call: data.call,
          zipCode: data.zipCode,
          addr: data.addr,
        })
      } catch (error) {
        console.error('?„ë¡œ??ë¡œë“œ ?¤íŒ¨:', error)
        alert('ë¡œê·¸?¸ì´ ?„ìš”?©ë‹ˆ??')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [navigate])

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          addr: data.address,
        }))
      },
    }).open()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUser(form)
      alert('?•ë³´ê°€ ?˜ì •?˜ì—ˆ?µë‹ˆ??')
    } catch (error) {
      console.error('?•ë³´ ?˜ì • ?¤íŒ¨:', error)
      alert('?•ë³´ ?˜ì •???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteUser()
      localStorage.clear()
      alert('?Œì› ?ˆí‡´ê°€ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??')
      navigate('/')
    } catch (error) {
      console.error('?Œì› ?ˆí‡´ ?¤íŒ¨:', error)
      alert('?Œì› ?ˆí‡´???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
    }
    setDeleteDialogOpen(false)
  }

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
        ???•ë³´
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 4, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          ê¸°ë³¸ ?•ë³´
        </Typography>

        <Grid container spacing={3}>
          {/* ?´ë¦„ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="?´ë¦„"
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
            />
          </Grid>

          {/* ?´ë©”??*/}
          <Grid item xs={12} sm={6}>
            <TextField
              label="?´ë©”??
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
            />
          </Grid>

          {/* ?°ë½ì²?*/}
          <Grid item xs={12} sm={6}>
            <TextField
              label="?°ë½ì²?
              fullWidth
              value={form.call}
              onChange={handleChange('call')}
              placeholder="010-0000-0000"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 4, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          ë°°ì†¡ì§€ ?•ë³´
        </Typography>

        <Grid container spacing={3}>
          {/* ?°í¸ë²ˆí˜¸ */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="?°í¸ë²ˆí˜¸"
                value={form.zipCode}
                InputProps={{ readOnly: true }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddressSearch}
                sx={{ minWidth: 100 }}
              >
                ê²€??
              </Button>
            </Box>
          </Grid>

          {/* ì£¼ì†Œ */}
          <Grid item xs={12}>
            <TextField
              label="ì£¼ì†Œ"
              fullWidth
              value={form.addr}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ?€??ë²„íŠ¼ */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={saving}
          sx={{
            bgcolor: brandColors.primary,
            '&:hover': { bgcolor: '#374151' },
            px: 4,
          }}
        >
          {saving ? '?€??ì¤?..' : '?•ë³´ ?˜ì •'}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* ?Œì› ?ˆí‡´ */}
      <Paper elevation={0} sx={{ border: '1px solid #FCA5A5', p: 3, bgcolor: '#FEF2F2' }}>
        <Typography fontWeight={600} color="error" sx={{ mb: 1 }}>
          ?Œì› ?ˆí‡´
        </Typography>
        <Typography color="text.secondary" fontSize="0.875rem" sx={{ mb: 2 }}>
          ?ˆí‡´ ??ëª¨ë“  ?°ì´?°ê? ?? œ?˜ë©° ë³µêµ¬?????†ìŠµ?ˆë‹¤.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          ?Œì› ?ˆí‡´
        </Button>
      </Paper>

      {/* ?ˆí‡´ ?•ì¸ ?¤ì´?¼ë¡œê·?*/}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>?Œì› ?ˆí‡´</DialogTitle>
        <DialogContent>
          <Typography>
            ?•ë§ ?ˆí‡´?˜ì‹œê² ìŠµ?ˆê¹Œ? ???‘ì—…?€ ?˜ëŒë¦????†ìŠµ?ˆë‹¤.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ì·¨ì†Œ</Button>
          <Button color="error" onClick={handleDeleteAccount}>
            ?ˆí‡´?˜ê¸°
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default MyProfilePage

