import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsPage } from './pages/TermsPage'
import { RefundPolicyPage } from './pages/RefundPolicyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminOverview } from './components/admin/AdminOverview'
import { AdminProducts } from './components/admin/AdminProducts'
import { AdminServices } from './components/admin/AdminServices'
import { AdminOrders } from './components/admin/AdminOrders'

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <>
          <ScrollToTop />
          <Layout />
        </>
      </AuthProvider>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <ProductDetailPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/services/:slug', element: <ServiceDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/auth', element: <AuthPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute redirectTo="/auth">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/purchases',
        element: (
          <ProtectedRoute redirectTo="/auth">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPolicyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/refunds', element: <RefundPolicyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <AdminLayout />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'orders', element: <AdminOrders /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}