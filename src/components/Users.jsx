import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  styled
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { userAPI } from '../utils/axios';  // Make sure to import userAPI

// Create styled component for main content
const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: '240px', // Width of the sidebar
  width: 'calc(100% - 240px)', // Adjust width accounting for sidebar
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

// Style the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

// Add this constant at the top of your file
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://boldservebackend-production.up.railway.app'
  : 'http://localhost:8003';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching users...');
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      
      console.log('Raw API Response:', response);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <MainContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ 
          borderRadius: 2, 
          boxShadow: 3,
          backgroundColor: 'background.paper'
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography 
                variant="h5" 
                component="h1" 
                fontWeight="bold" 
                color="primary"
                sx={{ pl: 1 }}
              >
                Users List ({users.length})
              </Typography>
              <Tooltip title="Refresh users">
                <IconButton 
                  onClick={fetchUsers} 
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                action={
                  <Button color="inherit" size="small" onClick={fetchUsers}>
                    RETRY
                  </Button>
                }
                sx={{ mb: 3, mx: 2 }}
              >
                {error}
              </Alert>
            )}

            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 1,
                mx: 2,
                width: 'auto',
                overflow: 'hidden',
                '& .MuiTable-root': {
                  borderCollapse: 'separate',
                  borderSpacing: '0 4px'
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Mobile</StyledTableCell>
                    <StyledTableCell>Address</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow 
                        key={user._id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            transition: 'background-color 0.2s'
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{user._id}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile || 'N/A'}</TableCell>
                        <TableCell>{user.address || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={5} 
                        align="center" 
                        sx={{ 
                          py: 8,
                          color: 'text.secondary'
                        }}
                      >
                        <Typography variant="body1">
                          No users found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </MainContent>
  );
};

export default Users;