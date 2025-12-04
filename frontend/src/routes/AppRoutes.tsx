import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import AdminLayout from '@/layouts/AdminLayout'
import MainLayout from '@/layouts/MainLayout'
import MyPageLayout from '@/layouts/MyPageLayout'


/*호출할때 받아오는 페이지들*/
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductListPage = lazy(() => import('@/pages/products/ProductListPage'))
const ProductDetailPage = lazy(() => import('@/pages/products/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/cart/CartPage'))
const OrderPage = lazy(() => import('@/pages/order/OrderPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const MyProfilePage = lazy(() => import('@/pages/mypage/MyProfilePage'))
const MyOrdersPage = lazy(() => import('@/pages/mypage/MyOrdersPage'))
const MyPostsPage = lazy(() => import('@/pages/mypage/MyPostsPage'))
const BoardListPage = lazy(() => import('@/pages/board/BoardListPage'))
const BoardDetailPage = lazy(() => import('@/pages/board/BoardDetailPage'))
const BoardWritePage = lazy(() => import('@/pages/board/BoardWritePage'))
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
        { path: 'cart', element: <CartPage /> },
        { path: 'order', element: <OrderPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
        { path: 'board', element: <BoardListPage /> },
        { path: 'board/:category', element: <BoardListPage /> },
        { path: 'board/:category/:id', element: <BoardDetailPage /> },
        { path: 'board/:category/write', element: <BoardWritePage /> },
      ],
    },
    {
      path: '/mypage',
      element: <MyPageLayout />,
      children: [
        { index: true, element: <Navigate to="profile" replace /> },
        { path: 'profile', element: <MyProfilePage /> },
        { path: 'orders', element: <MyOrdersPage /> },
        { path: 'posts', element: <MyPostsPage /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
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
