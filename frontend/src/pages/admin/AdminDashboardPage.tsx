import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  todaySales: number;
  recentOrders: RecentOrder[];
}

interface RecentOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: `${color}15`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { sx: { color, fontSize: 32 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    todaySales: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      // Mock data for development
      setStats({
        totalUsers: 1234,
        totalOrders: 567,
        totalProducts: 89,
        todaySales: 2450000,
        recentOrders: [
          { id: 1001, customerName: '홍길동', totalAmount: 189000, status: 'paid', createdAt: '2024-01-15 14:30' },
          { id: 1002, customerName: '김철수', totalAmount: 89000, status: 'shipping', createdAt: '2024-01-15 13:20' },
          { id: 1003, customerName: '이영희', totalAmount: 299000, status: 'delivered', createdAt: '2024-01-15 12:00' },
          { id: 1004, customerName: '박민수', totalAmount: 59000, status: 'paid', createdAt: '2024-01-15 11:45' },
          { id: 1005, customerName: '최수진', totalAmount: 149000, status: 'pending', createdAt: '2024-01-15 10:30' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
      pending: { label: '결제대기', color: 'warning' },
      paid: { label: '결제완료', color: 'info' },
      shipping: { label: '배송중', color: 'primary' },
      delivered: { label: '배송완료', color: 'success' },
      cancelled: { label: '취소', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        대시보드
      </Typography>

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 회원수"
            value={stats.totalUsers.toLocaleString()}
            icon={<PeopleIcon fontSize="large" />}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 주문수"
            value={stats.totalOrders.toLocaleString()}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 상품수"
            value={stats.totalProducts.toLocaleString()}
            icon={<InventoryIcon fontSize="large" />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="오늘 매출"
            value={formatPrice(stats.todaySales)}
            icon={<TrendingUpIcon fontSize="large" />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* 최근 주문 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          최근 주문
        </Typography>
        <Divider sx={{ my: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>주문번호</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>고객명</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">결제금액</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">상태</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>주문일시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell align="right">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell align="center">{getStatusChip(order.status)}</TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;

