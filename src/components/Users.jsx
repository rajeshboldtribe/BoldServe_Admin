import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Container
} from '@mui/material';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        // Simple GET request without additional configuration
        const response = await fetch('https://boldservebackend-production.up.railway.app/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data); // Debug log

        if (data && Array.isArray(data)) {
          setUsers(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          throw new Error('Invalid data format received');
        }

      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        width: '100%',
        mt: 8
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      marginLeft: '120px',
      mt: -4
    }}>
      <Container maxWidth="lg" sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            width: '100%',
            maxWidth: '1000px',
            mx: 'auto',
            overflow: 'hidden',
            maxHeight: '600px'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              color: '#2193b0', 
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Registered Users
          </Typography>
          
          <TableContainer sx={{ 
            maxHeight: '450px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#2193b0',
              borderRadius: '4px',
              '&:hover': {
                background: '#1c7a94'
              }
            }
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Mobile</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow 
                      key={user._id || index}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 147, 176, 0.1)',
                          transform: 'scale(1.01)'
                        }
                      }}
                    >
                      <TableCell>{user.fullName || 'N/A'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.mobile || 'N/A'}</TableCell>
                      <TableCell>{user.address || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {error ? (
                        <Typography color="error">
                          {error}
                          <br />
                          <small>Please check the network connection or try refreshing the page.</small>
                        </Typography>
                      ) : (
                        'No users found'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default Users;