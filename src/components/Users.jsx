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
  Alert,
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
        const response = await axios.get('https://boldservebackend-production.up.railway.app/api/users');
        
        if (response.data && response.data.success) {
          setUsers(response.data.data);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
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
        height: '100vh',
        width: '100%'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, width: '100%' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '1200px',
      marginLeft: '120px',
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4,
            color: '#2193b0', 
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '1.5rem'
          }}
        >
          Registered Users
        </Typography>
        
        <TableContainer sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: '#f5f5f5',
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  ID
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: '#f5f5f5',
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  Email
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: '#f5f5f5',
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: '#f5f5f5',
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  Mobile
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: '#f5f5f5',
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  Address
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow 
                    key={user._id}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 147, 176, 0.1)',
                        transform: 'scale(1.01)'
                      },
                      '& .MuiTableCell-root': {
                        fontSize: '0.95rem',
                        padding: '16px'
                      }
                    }}
                  >
                    <TableCell>{user._id || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.fullName || 'N/A'}</TableCell>
                    <TableCell>{user.mobile || 'N/A'}</TableCell>
                    <TableCell>{user.address || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={5} 
                    align="center"
                    sx={{ fontSize: '1rem', padding: '20px' }}
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Users;