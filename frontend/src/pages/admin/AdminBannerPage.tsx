import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material'
import { brandColors } from '@/theme/tokens'

// ë°°ë„ˆ ?€??
interface Banner {
  banner_no: number
  title: string
  image_url: string
  link_url: string
  is_active: boolean
  order: number
}

const AdminBannerPage = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<Banner[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editBanner, setEditBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    is_active: true,
  })

  useEffect(() => {
    const loadBanners = async () => {
      setLoading(true)
      try {
        // TODO: ?¤ì œ API ?°ë™
        // const data = await fetchBanners()
        setBanners([])
      } catch (error) {
        console.error('ë°°ë„ˆ ëª©ë¡ ë¡œë“œ ?¤íŒ¨:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBanners()
  }, [])

  const handleAdd = () => {
    setEditBanner(null)
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      is_active: true,
    })
    setDialogOpen(true)
  }

  const handleEdit = (banner: Banner) => {
    setEditBanner(banner)
    setFormData({
      title: banner.title,
      image_url: banner.image_url,
      link_url: banner.link_url,
      is_active: banner.is_active,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.image_url.trim()) {
      alert('?œëª©ê³??´ë?ì§€ URL???…ë ¥?´ì£¼?¸ìš”.')
      return
    }
    try {
      // TODO: API ?°ë™
      if (editBanner) {
        // await updateBanner({ ...editBanner, ...formData })
        alert('?˜ì •?˜ì—ˆ?µë‹ˆ??')
      } else {
        // await createBanner(formData)
        alert('?±ë¡?˜ì—ˆ?µë‹ˆ??')
      }
      setDialogOpen(false)
    } catch (error) {
      console.error('?€???¤íŒ¨:', error)
      alert('?€?¥ì— ?¤íŒ¨?ˆìŠµ?ˆë‹¤.')
    }
  }

  const handleDelete = async (banner: Banner) => {
    if (!window.confirm(`"${banner.title}" ë°°ë„ˆë¥??? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?`)) return
    try {
      // TODO: API ?°ë™
      // await deleteBanner(banner.banner_no)
      alert('?? œ?˜ì—ˆ?µë‹ˆ??')
    } catch (error) {
      console.error('?? œ ?¤íŒ¨:', error)
      alert('?? œ???¤íŒ¨?ˆìŠµ?ˆë‹¤.')
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      // TODO: API ?°ë™
      // await updateBanner({ ...banner, is_active: !banner.is_active })
      setBanners((prev) =>
        prev.map((b) =>
          b.banner_no === banner.banner_no ? { ...b, is_active: !b.is_active } : b
        )
      )
    } catch (error) {
      console.error('?íƒœ ë³€ê²??¤íŒ¨:', error)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    // TODO: API ?°ë™ - ?œì„œ ë³€ê²?
    const newBanners = [...banners]
    ;[newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]]
    setBanners(newBanners)
  }

  const handleMoveDown = async (index: number) => {
    if (index === banners.length - 1) return
    // TODO: API ?°ë™ - ?œì„œ ë³€ê²?
    const newBanners = [...banners]
    ;[newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]]
    setBanners(newBanners)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          ë°°ë„ˆ ê´€ë¦?
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: brandColors.primary,
            '&:hover': { bgcolor: '#374151' },
          }}
        >
          ë°°ë„ˆ ?±ë¡
        </Button>
      </Box>

      {/* ?ˆë‚´ ë¬¸êµ¬ */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 2, mb: 3, bgcolor: '#F9FAFB' }}>
        <Typography fontSize="0.875rem" color="text.secondary">
          ??ë°°ë„ˆ???±ë¡???œì„œ?€ë¡?ë©”ì¸ ?˜ì´ì§€ ?¬ë¼?´ë”???œì‹œ?©ë‹ˆ??
          <br />
          ??ê¶Œì¥ ?´ë?ì§€ ?¬ê¸°: 1920 x 600px (ê°€ë¡?x ?¸ë¡œ)
          <br />
          ??ë¹„í™œ?±í™”??ë°°ë„ˆ??ë©”ì¸ ?˜ì´ì§€???œì‹œ?˜ì? ?ŠìŠµ?ˆë‹¤.
        </Typography>
      </Paper>

      {/* ë°°ë„ˆ ëª©ë¡ */}
      {banners.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ border: '1px solid #E5E7EB', p: 8, textAlign: 'center' }}
        >
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            ?±ë¡??ë°°ë„ˆê°€ ?†ìŠµ?ˆë‹¤.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              bgcolor: brandColors.primary,
              '&:hover': { bgcolor: '#374151' },
            }}
          >
            ì²?ë°°ë„ˆ ?±ë¡?˜ê¸°
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner, index) => (
            <Grid item xs={12} md={6} key={banner.banner_no}>
              <Card elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={banner.image_url || '/placeholder-banner.jpg'}
                  alt={banner.title}
                  sx={{ bgcolor: '#F3F4F6', objectFit: 'cover' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={600}>
                      {banner.title}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={banner.is_active}
                          onChange={() => handleToggleActive(banner)}
                          size="small"
                        />
                      }
                      label={banner.is_active ? '?œì„±' : 'ë¹„í™œ??}
                    />
                  </Box>
                  {banner.link_url && (
                    <Typography fontSize="0.75rem" color="text.secondary" noWrap>
                      ë§í¬: {banner.link_url}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === banners.length - 1}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(banner)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(banner)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ë°°ë„ˆ ?±ë¡/?˜ì • ?¤ì´?¼ë¡œê·?*/}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>
          {editBanner ? 'ë°°ë„ˆ ?˜ì •' : 'ë°°ë„ˆ ?±ë¡'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="ë°°ë„ˆ ?œëª©"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <TextField
              label="?´ë?ì§€ URL"
              fullWidth
              value={formData.image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/banner.jpg"
              required
            />
            <TextField
              label="ë§í¬ URL (? íƒ)"
              fullWidth
              value={formData.link_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
              placeholder="https://example.com/event"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="?œì„±??
            />

            {/* ë¯¸ë¦¬ë³´ê¸° */}
            {formData.image_url && (
              <Box>
                <Typography fontSize="0.875rem" color="text.secondary" sx={{ mb: 1 }}>
                  ë¯¸ë¦¬ë³´ê¸°
                </Typography>
                <Box
                  component="img"
                  src={formData.image_url}
                  alt="ë¯¸ë¦¬ë³´ê¸°"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                    bgcolor: '#F3F4F6',
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = '/placeholder-banner.jpg'
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>ì·¨ì†Œ</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: brandColors.primary, '&:hover': { bgcolor: '#374151' } }}
          >
            {editBanner ? '?˜ì •' : '?±ë¡'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminBannerPage

