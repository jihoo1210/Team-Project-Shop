import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material'
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material'
import { brandColors } from '@/theme/tokens'

interface DashboardStats {
  totalMembers: number
  totalOrders: number
  totalProducts: number
  todayOrders: number
  todaySales: number
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalOrders: 0,
    totalProducts: 0,
    todayOrders: 0,
    todaySales: 0,
  })

  useEffect(() => {
    // TODO: ?§Ï†ú API ?∞Îèô
    // const loadStats = async () => {
    //   const data = await fetchDashboardStats()
    //   setStats(data)
    // }
    // loadStats()

    // ?ÑÏãú ?∞Ïù¥??
    setStats({
      totalMembers: 1234,
      totalOrders: 5678,
      totalProducts: 456,
      todayOrders: 23,
      todaySales: 1234000,
    })
  }, [])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const StatCard = ({
    title,
    value,
    icon,
    color,
    suffix = '',
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    suffix?: string
  }) => (
    <Card elevation={0} sx={{ border: '1px solid #E5E7EB', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" fontSize="0.875rem" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {formatNumber(value)}
              {suffix && (
                <Typography component="span" fontSize="1rem" fontWeight={400}>
                  {suffix}
                </Typography>
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        ?Ä?úÎ≥¥??
      </Typography>

      {/* ?µÍ≥Ñ Ïπ¥Îìú */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ï¥??åÏõê ??
            value={stats.totalMembers}
            icon={<PeopleIcon fontSize="large" />}
            color="#3B82F6"
            suffix="Î™?
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Ï¥?Ï£ºÎ¨∏ ??
            value={stats.totalOrders}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#10B981"
            suffix="Í±?
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="?±Î°ù ?ÅÌíà ??
            value={stats.totalProducts}
            icon={<InventoryIcon fontSize="large" />}
            color="#8B5CF6"
            suffix="Í∞?
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="?§Îäò Ï£ºÎ¨∏"
            value={stats.todayOrders}
            icon={<TrendingUpIcon fontSize="large" />}
            color="#F59E0B"
            suffix="Í±?
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <StatCard
            title="?§Îäò Îß§Ï∂ú"
            value={stats.todaySales}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#EF4444"
            suffix="??
          />
        </Grid>
      </Grid>

      {/* ÏµúÍ∑º ?úÎèô */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              ÏµúÍ∑º Ï£ºÎ¨∏
            </Typography>
            <Typography color="text.secondary" fontSize="0.875rem">
              ÏµúÍ∑º Ï£ºÎ¨∏ ?¥Ïó≠???¨Í∏∞???úÏãú?©Îãà??
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              ÏµúÍ∑º Í∞Ä???åÏõê
            </Typography>
            <Typography color="text.secondary" fontSize="0.875rem">
              ÏµúÍ∑º Í∞Ä???åÏõê???¨Í∏∞???úÏãú?©Îãà??
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboardPage

