import React, { useState, useEffect, useRef } from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
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
  imageUrl?: string;
}

interface ProductImage {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
}

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string; // 이미지 URL 직접 입력용
}

// 이미지 URL 처리 유틸 함수
const getImageSrc = (url?: string): string => {
  if (!url) return '/placeholder.jpg';
  // 절대 URL이면 그대로 사용
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // 상대 경로면 백엔드 기본 URL 붙이기
  return url.startsWith('/') ? url : `/${url}`;
};

// 이미지 로드 실패 시 fallback 처리
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = '/placeholder.jpg';
  e.currentTarget.onerror = null; // 무한 루프 방지
};

const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // 이미지 업로드 관련 상태
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
  });
  // URL 미리보기용 상태
  const [urlPreview, setUrlPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 백엔드 ItemController의 /api/item 사용
      const response = await axiosClient.get('/item', {
        params: {
          page: page - 1,
          size: 10,
          searchField: 'title',
          searchTerm: searchTerm || undefined,
        },
      });
      const data = response.data.result;
      // 백엔드 응답을 프론트엔드 Product 형식으로 변환
      const mappedProducts = data.content.map((item: { id: number; title: string; brand: string; price: number; discountPercent: number; mainImageUrl: string }) => ({
        id: item.id,
        name: item.title,
        brand: item.brand,
        price: item.price,
        stock: 100, // 백엔드에 stock 필드가 없으므로 기본값
        status: 'active' as const,
        category: '패션',
        createdAt: new Date().toISOString().split('T')[0],
        imageUrl: item.mainImageUrl,
      }));
      setProducts(mappedProducts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('상품 목록 로드 실패:', err);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    setEditingProduct(product || null);
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: '',
        imageUrl: product.imageUrl || '',
      });
      // 기존 이미지 URL이 있으면 미리보기 설정
      setUrlPreview(product.imageUrl || '');
    } else {
      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: '',
      });
      setUrlPreview('');
    }
    setProductImages([]);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setProductImages([]);
    setUrlPreview('');
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      imageUrl: '',
    });
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxImages = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const remainingSlots = maxImages - productImages.length;

    if (remainingSlots <= 0) {
      alert('최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    const newImages: ProductImage[] = [];
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      
      // 이미지 파일만 허용
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}"은 이미지 파일이 아닙니다.`);
        continue;
      }
      
      if (file.size > maxFileSize) {
        alert(`"${file.name}"이 5MB를 초과합니다.`);
        continue;
      }

      newImages.push({
        id: `${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        isMain: productImages.length === 0 && newImages.length === 0, // 첫 번째 이미지를 대표 이미지로
      });
    }

    setProductImages((prev) => [...prev, ...newImages]);
    event.target.value = '';
  };

  // 이미지 제거
  const handleRemoveImage = (imageId: string) => {
    setProductImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      // 대표 이미지가 삭제되면 첫 번째 이미지를 대표로 설정
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  // 대표 이미지 설정
  const handleSetMainImage = (imageId: string) => {
    setProductImages((prev) =>
      prev.map((img) => ({
        ...img,
        isMain: img.id === imageId,
      }))
    );
  };

  // 폼 데이터 변경 핸들러
  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 이미지 URL 변경 시 미리보기 업데이트
    if (field === 'imageUrl') {
      setUrlPreview(value);
    }
  };

  // 상품 저장
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price) {
      alert('상품명, 가격은 필수입니다.');
      return;
    }

    try {
      const submitFormData = new FormData();

      // 백엔드 ItemResistraionRequest 형식에 맞게 data 객체 생성
      // 파일 업로드가 없고 URL만 입력된 경우 URL 사용
      const mainImageUrl = productImages.length === 0 && formData.imageUrl
        ? formData.imageUrl
        : '';

      const itemData = {
        title: formData.name,
        price: parseInt(formData.price) || 0,
        discountPercent: 0,
        sku: '',
        brand: formData.brand,
        description: formData.description,
        colorList: [],
        sizeList: [],
        mainImageUrl: mainImageUrl,
        imageList: [],
      };

      // data를 JSON Blob으로 추가
      submitFormData.append('data', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));

      // 대표 이미지와 추가 이미지 분리
      const mainImage = productImages.find(img => img.isMain);
      const otherImages = productImages.filter(img => !img.isMain);

      if (mainImage) {
        submitFormData.append('mainImage', mainImage.file);
      }

      otherImages.forEach((img) => {
        submitFormData.append('images', img.file);
      });

      if (editingProduct) {
        await axiosClient.put(`/admin/${editingProduct.id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosClient.post('/admin', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchProducts();
      handleCloseDialog();
      alert(editingProduct ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.');
    } catch (err) {
      console.error('상품 저장 실패:', err);
      alert('상품 저장에 실패했습니다.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosClient.delete(`/admin/${id}`);
      setProducts(products.filter(p => p.id !== id));
      alert('상품이 삭제되었습니다.');
    } catch (err) {
      console.error('상품 삭제 실패:', err);
      alert('상품 삭제에 실패했습니다.');
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
              <TableCell sx={{ fontWeight: 600, width: 60 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }}>이미지</TableCell>
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
                  <Box
                    component="img"
                    src={getImageSrc(product.imageUrl)}
                    onError={handleImageError}
                    alt={product.name}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 1,
                      bgcolor: '#f5f5f5',
                    }}
                  />
                </TableCell>
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? '상품 수정' : '상품 등록'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* 이미지 업로드 영역 */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                상품 이미지 (파일 업로드 또는 URL 입력)
              </Typography>

              {/* 파일 업로드 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={productImages.length >= 5}
                sx={{ mb: 2, mr: 2 }}
              >
                파일 업로드 ({productImages.length}/5)
              </Button>

              {/* 업로드된 이미지 미리보기 */}
              {productImages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {productImages.map((img) => (
                    <Box
                      key={img.id}
                      sx={{
                        position: 'relative',
                        border: img.isMain ? '3px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Avatar
                        src={img.preview}
                        variant="rounded"
                        sx={{ width: 100, height: 100, cursor: 'pointer' }}
                        onClick={() => handleSetMainImage(img.id)}
                      />
                      {img.isMain && (
                        <Chip
                          label="대표"
                          size="small"
                          color="primary"
                          sx={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      )}
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                        onClick={() => handleRemoveImage(img.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                * 클릭하여 대표 이미지를 선택하세요 (최대 5개, 5MB 이하)
              </Typography>

              {/* 이미지 URL 입력 */}
              <TextField
                label="이미지 URL (파일 업로드 대신 URL 입력 가능)"
                fullWidth
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                disabled={productImages.length > 0}
                helperText={productImages.length > 0 ? '파일이 업로드되면 URL은 무시됩니다' : '외부 이미지 URL을 입력하세요'}
                sx={{ mb: 2 }}
              />

              {/* URL 이미지 미리보기 */}
              {urlPreview && productImages.length === 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    URL 이미지 미리보기:
                  </Typography>
                  <Box
                    component="img"
                    src={getImageSrc(urlPreview)}
                    onError={handleImageError}
                    alt="미리보기"
                    sx={{
                      width: 150,
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="상품명"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="브랜드"
                fullWidth
                value={formData.brand}
                onChange={(e) => handleFormChange('brand', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>카테고리</InputLabel>
                <Select
                  label="카테고리"
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                >
                  <MenuItem value="electronics">전자기기</MenuItem>
                  <MenuItem value="fashion">패션</MenuItem>
                  <MenuItem value="home">홈/리빙</MenuItem>
                  <MenuItem value="beauty">뷰티</MenuItem>
                  <MenuItem value="sports">스포츠</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="가격"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="재고"
                type="number"
                fullWidth
                required
                value={formData.stock}
                onChange={(e) => handleFormChange('stock', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">개</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="상품 설명"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {editingProduct ? '수정' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProductListPage;

