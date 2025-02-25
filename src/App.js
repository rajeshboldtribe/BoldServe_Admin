import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Orders from './components/Orders';
import Users from './components/Users';
import Payments from './components/Payments';
import AdminLogin from './components/AdminLogin';
import Profile from './components/Profile';
import AdminProductList from './components/AdminProduct';

// Protected Route component
const ProtectedRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            {!isAuthenticated ? (
                <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            ) : (
                <Box sx={{ display: 'flex' }}>
                    <Header setIsAuthenticated={setIsAuthenticated} />
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        <Routes>
                            <Route path="/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
                            
                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/services"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Services />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/products"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <AdminProductList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Orders />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Users />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/payments"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Payments />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Box>
                </Box>
            )}
        </Router>
    );
}

export default App;