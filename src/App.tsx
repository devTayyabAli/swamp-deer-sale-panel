import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SalesDashboard from './pages/SalesDashboard';
import SalesHistory from './pages/SalesHistory';
import CreateInvestor from './pages/CreateInvestor';
import LogSale from './pages/LogSale';
import UserLayout from './layouts/UserLayout';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected User Routes */}
        <Route element={<UserLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <SalesDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <SalesHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-investor" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <CreateInvestor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/log-sale" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <LogSale />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <UpdateProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/change-password" 
              element={
                <ProtectedRoute allowedRoles={['sales_rep', 'branch_manager', 'super_admin']}>
                  <ChangePassword />
                </ProtectedRoute>
              } 
            />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
