import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsPage } from './pages/TermsPage'
import { RefundPolicyPage } from './pages/RefundPolicyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminOverview } from './components/admin/AdminOverview'
import { AdminProducts } from './components/admin/AdminProducts'
import { AdminOrders } from './components/admin/AdminOrders'

const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <ProductDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPolicyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/refunds', element: <RefundPolicyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
