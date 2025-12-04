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
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'soldout' | 'hidden';
  category: string;
  createdAt: string;
}

const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/admin/products', {
        params: { page, search: searchTerm },
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      // Mock data for development
      const mockProducts: Product[] = [
        { id: 1, name: '프리미엄 무선 이어폰', brand: 'TechBrand', price: 89000, stock: 50, status: 'active', category: '전자기기', createdAt: '2024-01-15' },
        { id: 2, name: '스마트 워치 Pro', brand: 'SmartLife', price: 299000, stock: 30, status: 'active', category: '전자기기', createdAt: '2024-01-10' },
        { id: 3, name: '노이즈 캔슬링 헤드폰', brand: 'AudioMax', price: 199000, stock: 0, status: 'soldout', category: '전자기기', createdAt: '2024-01-05' },
        { id: 4, name: '블루투스 스피커', brand: 'SoundWave', price: 79000, stock: 100, status: 'active', category: '전자기기', createdAt: '2024-01-01' },
        { id: 5, name: '무선 충전기', brand: 'ChargePlus', price: 35000, stock: 200, status: 'active', category: '액세서리', createdAt: '2023-12-20' },
      ];
      setProducts(mockProducts);
      setTotalPages(3);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    setEditingProduct(product || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosClient.delete(`/api/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      // Delete locally for demo
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { label: string; color: 'success' | 'error' | 'default' }> = {
      active: { label: '판매중', color: 'success' },
      soldout: { label: '품절', color: 'error' },
      hidden: { label: '숨김', color: 'default' },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          상품 관리
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          상품 등록
        </Button>
      </Box>

      {/* 검색 영역 */}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 2, mb: 3 }}>
        <TextField
          placeholder="상품명, 브랜드 검색"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Paper>

      {/* 상품 테이블 */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>상품명</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>브랜드</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">가격</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">재고</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">상태</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{product.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.category}
                  </Typography>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell align="right">{formatPrice(product.price)}</TableCell>
                <TableCell align="center">{product.stock}</TableCell>
                <TableCell align="center">{getStatusChip(product.status)}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* 상품 등록/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? '상품 수정' : '상품 등록'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="상품명" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="브랜드" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>카테고리</InputLabel>
                <Select label="카테고리" defaultValue="">
                  <MenuItem value="electronics">전자기기</MenuItem>
                  <MenuItem value="fashion">패션</MenuItem>
                  <MenuItem value="home">홈/리빙</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="가격" type="number" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="재고" type="number" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="상품 설명" fullWidth multiline rows={4} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {editingProduct ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProductListPage;

