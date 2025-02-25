import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const AnimatedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: `${fadeIn} 0.6s ease-out`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  borderRadius: 16,
  background: 'rgba(255,255,255,0.95)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const AdminLogin = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    userId: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simple credential check
      if (credentials.userId === 'Admin' && credentials.password === 'Admin123') {
        // Successful login
        localStorage.setItem('isAdminLoggedIn', 'true');
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setError('Invalid credentials');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <AnimatedPaper elevation={3}>
          <AdminPanelSettings 
            sx={{ 
              fontSize: 50, 
              color: 'primary.main',
              mb: 2 
            }} 
          />
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userId"
              label="Admin ID"
              name="userId"
              autoComplete="username"
              autoFocus
              value={credentials.userId}
              onChange={(e) => setCredentials({
                ...credentials,
                userId: e.target.value
              })}
              sx={{ mb: 2 }}
              placeholder="Enter admin user ID (Admin)"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              placeholder="Enter password (Admin123)"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={<LoginIcon />}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </StyledButton>
          </Box>
        </AnimatedPaper>
      </Box>
    </Container>
  );
};

export default AdminLogin;