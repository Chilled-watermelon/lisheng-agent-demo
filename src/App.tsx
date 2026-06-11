import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLicenseValid } from './lib/license'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import SalesMonitor from './pages/SalesMonitor'
import Integrations from './pages/Integrations'
import AiCenter from './pages/AiCenter'
import Analyze from './pages/Analyze'

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!sessionStorage.getItem('ls_auth') || !isLicenseValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/sales" element={<SalesMonitor />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/ai" element={<AiCenter />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
