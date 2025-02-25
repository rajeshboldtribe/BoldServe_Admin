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
                <Box sx={{ 
                    display: 'flex',
                    minHeight: '100vh',
                    backgroundColor: '#f5f7fa'
                }}>
                    <Header setIsAuthenticated={setIsAuthenticated} />
                    <Sidebar />
                    <Box 
                        component="main" 
                        sx={{ 
                            flexGrow: 1,
                            marginLeft: '240px',
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ 
                            width: '100%',
                            maxWidth: '1000px',
                            padding: '20px',
                            position: 'absolute',
                            top: '50%',
                            left: '40%',
                            transform: 'translate(-50%, -50%)',
                            marginLeft: '120px',
                            marginRight: 'auto',
                            '@media (max-width: 1200px)': {
                                left: '45%',
                            },
                            '@media (max-width: 900px)': {
                                left: '50%',
                            }
                        }}>
                            <Routes>
                                <Route path="/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
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
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <Services />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products"
                                    element={
                                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <AdminProductList />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <Orders />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <Users />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/payments"
                                    element={
                                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <Payments />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                <Profile />
                                            </Box>
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            )}
        </Router>
    );
}

export default App;