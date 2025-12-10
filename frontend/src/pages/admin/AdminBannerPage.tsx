import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  is_active: boolean;
  startDate: string;
  endDate: string;
}

const AdminBannerPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/admin/banners');
      setBanners(response.data);
    } catch (err) {
      console.error('배너 로드 실패:', err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        startDate: banner.startDate,
        endDate: banner.endDate,
        is_active: banner.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        imageUrl: '',
        linkUrl: '',
        startDate: '',
        endDate: '',
        is_active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.imageUrl) {
      setError('제목과 이미지 URL은 필수입니다.');
      return;
    }

    try {
      if (editingBanner) {
        await axiosClient.put(`/api/admin/banners/${editingBanner.id}`, formData);
        setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
      } else {
        const newBanner: Banner = {
          id: Date.now(),
          ...formData,
          order: banners.length + 1,
        };
        setBanners([...banners, newBanner]);
      }
      handleCloseDialog();
    } catch (err) {
      // Save locally for demo
      if (editingBanner) {
        setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
      } else {
        const newBanner: Banner = {
          id: Date.now(),
          ...formData,
          order: banners.length + 1,
        };
        setBanners([...banners, newBanner]);
      }
      handleCloseDialog();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosClient.delete(`/api/admin/banners/${id}`);
      setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      // Delete locally for demo
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await axiosClient.patch(`/api/admin/banners/${banner.id}`, { is_active: !banner.is_active });
      setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    } catch (err) {
      // Toggle locally for demo
      setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    }
  };

  const handleMoveOrder = async (id: number, direction: 'up' | 'down') => {
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === banners.length - 1) return;

    const newBanners = [...banners];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
    
    // Update order numbers
    newBanners.forEach((b, i) => {
      b.order = i + 1;
    });
    
    setBanners(newBanners);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          배너 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          배너 등록
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, width: 60 }}>순서</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>미리보기</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>제목</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>기간</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">상태</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((banner, index) => (
              <TableRow key={banner.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleMoveOrder(banner.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleMoveOrder(banner.id, 'down')}
                      disabled={index === banners.length - 1}
                    >
                      <ArrowDownIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={banner.imageUrl}
                    alt={banner.title}
                    sx={{ width: 160, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{banner.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {banner.linkUrl}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {banner.startDate} ~ {banner.endDate}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Switch
                      checked={banner.is_active}
                      onChange={() => handleToggleActive(banner)}
                      size="small"
                    />
                    <Typography variant="body2" color={banner.is_active ? 'success.main' : 'text.secondary'}>
                      {banner.is_active ? '활성' : '비활성'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpenDialog(banner)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(banner.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 배너 등록/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBanner ? '배너 수정' : '배너 등록'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="제목"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="이미지 URL"
                fullWidth
                required
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                helperText="권장 크기: 1200x400px"
              />
            </Grid>
            {formData.imageUrl && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  미리보기
                </Typography>
                <Box
                  component="img"
                  src={formData.imageUrl}
                  alt="Preview"
                  sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1 }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="링크 URL"
                fullWidth
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="시작일"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="종료일"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                }
                label="활성화"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingBanner ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBannerPage;

