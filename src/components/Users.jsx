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

const API_URL = 'https://boldservebackend-production.up.railway.app';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/users`);
        
        // Handle the specific response structure from your API
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
          console.log('Users loaded:', response.data.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message || 'Failed to load users');
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
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      p: 3,
      marginLeft: '240px'
    }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
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
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mobile</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow 
                      key={user._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(33, 147, 176, 0.1)'
                        }
                      }}
                    >
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>{user.address || 'Not provided'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {error ? (
                        <Typography color="error">
                          {error}
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