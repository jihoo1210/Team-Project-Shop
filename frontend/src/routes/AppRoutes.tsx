import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import { AuthGuard, AdminGuard, GuestGuard } from '@/components/auth/AuthGuard'
import AdminLayout from '@/layouts/AdminLayout'
import MainLayout from '@/layouts/MainLayout'
import MyPageLayout from '@/layouts/MyPageLayout'


/*호출할때 받아오는 페이지들*/
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductListPage = lazy(() => import('@/pages/products/ProductListPage'))
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'))
const WishlistPage = lazy(() => import('@/pages/products/WishlistPage'))
const CartPage = lazy(() => import('@/pages/cart/CartPage'))
const OrderPage = lazy(() => import('@/pages/order/OrderPage'))
const OrderCompletePage = lazy(() => import('@/pages/OrderCompletePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const MyProfilePage = lazy(() => import('@/pages/mypage/MyProfilePage'))
const MyOrdersPage = lazy(() => import('@/pages/mypage/MyOrdersPage'))
const MyPostsPage = lazy(() => import('@/pages/mypage/MyPostsPage'))
const BoardListPage = lazy(() => import('@/pages/board/BoardListPage'))
const BoardDetailPage = lazy(() => import('@/pages/board/BoardDetailPage'))
const BoardWritePage = lazy(() => import('@/pages/board/BoardWritePage'))
const BoardEditPage = lazy(() => import('@/pages/board/BoardEditPage'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductListPage = lazy(() => import('@/pages/admin/AdminProductListPage'))
const AdminMemberListPage = lazy(() => import('@/pages/admin/AdminMemberListPage'))
const AdminBoardPage = lazy(() => import('@/pages/admin/AdminBoardPage'))
const AdminBannerPage = lazy(() => import('@/pages/admin/AdminBannerPage'))

const AppRoutes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'products', element: <ProductListPage /> },
        { path: 'products/:id', element: <ProductDetailPage /> },
        { 
          path: 'wishlist', 
          element: (
            <AuthGuard>
              <WishlistPage />
            </AuthGuard>
          ) 
        },
        { path: 'cart', element: <CartPage /> },
        { 
          path: 'order', 
          element: (
            <AuthGuard>
              <OrderPage />
            </AuthGuard>
          ) 
        },
        { 
          path: 'order/complete', 
          element: (
            <AuthGuard>
              <OrderCompletePage />
            </AuthGuard>
          ) 
        },
        { 
          path: 'login', 
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ) 
        },
        { 
          path: 'signup', 
          element: (
            <GuestGuard>
              <SignupPage />
            </GuestGuard>
          ) 
        },
        { path: 'board', element: <BoardListPage /> },
        { path: 'board/:category', element: <BoardListPage /> },
        { path: 'board/:category/:id', element: <BoardDetailPage /> },
        { 
          path: 'board/:category/write', 
          element: (
            <AuthGuard>
              <BoardWritePage />
            </AuthGuard>
          ) 
        },
        { 
          path: 'board/:category/:id/edit', 
          element: (
            <AuthGuard>
              <BoardEditPage />
            </AuthGuard>
          ) 
        },
      ],
    },
    {
      path: '/mypage',
      element: (
        <AuthGuard>
          <MyPageLayout />
        </AuthGuard>
      ),
      children: [
        { index: true, element: <Navigate to="profile" replace /> },
        { path: 'profile', element: <MyProfilePage /> },
        { path: 'orders', element: <MyOrdersPage /> },
        { path: 'posts', element: <MyPostsPage /> },
        { path: 'wishlist', element: <WishlistPage /> },
      ],
    },
    {
      path: '/admin',
      element: (
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      ),
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'products', element: <AdminProductListPage /> },
        { path: 'members', element: <AdminMemberListPage /> },
        { path: 'board', element: <AdminBoardPage /> },
        { path: 'banners', element: <AdminBannerPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])

  return (
    <Suspense fallback={<LoadingScreen />}>
      {element ?? <Outlet />}
    </Suspense>
  )
}

export default AppRoutes
