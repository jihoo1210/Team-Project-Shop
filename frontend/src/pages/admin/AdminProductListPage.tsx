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
  Grid,
  Pagination,
  CircularProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { fetchItems } from '@/api/itemApi'
import type { ItemSummary, PaginatedResponse } from '@/types/api'
import { brandColors } from '@/theme/tokens'

const AdminProductListPage = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<PaginatedResponse<ItemSummary> | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ItemSummary | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchItems({
          page: page - 1,
          size: 15,
          searchField: 'title',
          searchTerm: search || undefined,
        })
        setProducts(data)
      } catch (error) {
        console.error('?ÅÌíà Î™©Î°ù Î°úÎìú ?§Ìå®:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const handleAdd = () => {
    setEditProduct(null)
    setDialogOpen(true)
  }

  const handleEdit = (product: ItemSummary) => {
    setEditProduct(product)
    setDialogOpen(true)
  }

  const handleDelete = async (sku: string) => {
    if (!window.confirm('?ïÎßê ??†ú?òÏãúÍ≤†Ïäµ?àÍπå?')) return
    try {
      // TODO: API ?∞Îèô
      // await deleteItem(sku)
      alert('??†ú?òÏóà?µÎãà??')
    } catch (error) {
      console.error('??†ú ?§Ìå®:', error)
      alert('??†ú???§Ìå®?àÏäµ?àÎã§.')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '??
  }

  const getStatusChip = (status: string) => {
    const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
      active: { label: '?êÎß§Ï§?, color: 'success' },
      soldout: { label: '?àÏ†à', color: 'error' },
      hidden: { label: '?®Í?', color: 'warning' },
    }
    const config = statusMap[status] || { label: status, color: 'warning' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          ?ÅÌíà Í¥ÄÎ¶?
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
          ?ÅÌíà ?±Î°ù
        </Button>
      </Box>

      {/* Í≤Ä??*/}
      <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="?ÅÌíàÎ™?Í≤Ä??
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
            Í≤Ä??
          </Button>
        </Box>
      </Paper>

      {/* ?ÅÌíà Î™©Î°ù ?åÏù¥Î∏?*/}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, width: 80 }}>?¥Î?ÏßÄ</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>?ÅÌíàÎ™?/TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }}>Î∏åÎûú??/TableCell>
              <TableCell sx={{ fontWeight: 600, width: 120 }} align="right">
                Í∞ÄÍ≤?
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                ?†Ïù∏??
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 80 }} align="center">
                ?ÅÌÉú
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 100 }} align="center">
                Í¥ÄÎ¶?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : products?.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">?±Î°ù???ÅÌíà???ÜÏäµ?àÎã§.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              products?.content.map((product) => (
                <TableRow key={product.sku} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.main_image_url || '/placeholder.jpg'}
                      alt={product.title}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 1,
                        bgcolor: '#F3F4F6',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{product.title}</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      SKU: {product.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell align="right">{formatPrice(product.price)}</TableCell>
                  <TableCell align="center">
                    {product.discount_percent > 0 ? `${product.discount_percent}%` : '-'}
                  </TableCell>
                  <TableCell align="center">{getStatusChip(product.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.sku)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ?òÏù¥ÏßÄ?§Ïù¥??*/}
      {products && products.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={products.totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}

      {/* ?ÅÌíà ?±Î°ù/?òÏ†ï ?§Ïù¥?ºÎ°úÍ∑?*/}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={600}>
          {editProduct ? '?ÅÌíà ?òÏ†ï' : '?ÅÌíà ?±Î°ù'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="?ÅÌíàÎ™? fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Î∏åÎûú?? fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="SKU" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Í∞ÄÍ≤? type="number" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="?†Ïù∏??(%)" type="number" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="?ÅÌíà ?§Î™Ö" fullWidth multiline rows={4} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Ï∑®ÏÜå</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: brandColors.primary, '&:hover': { bgcolor: '#374151' } }}
          >
            {editProduct ? '?òÏ†ï' : '?±Î°ù'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProductListPage

