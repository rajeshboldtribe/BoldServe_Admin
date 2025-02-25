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
        // Create axios instance with default config
        const axiosInstance = axios.create({
          baseURL: 'https://boldservebackend-production.up.railway.app',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if you have it
          },
          withCredentials: false // Important for CORS
        });

        const response = await axiosInstance.get('/api/users');
        console.log('API Response:', response); // Debug log

        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
          setError(null);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          setError(null);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching users:', error.response || error);
        setError(error.response?.data?.message || 'Failed to load users. Please try again later.');
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
                      {error || 'No users found'}
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