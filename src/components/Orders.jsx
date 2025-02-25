import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Container,
  Typography,
  styled,
  CircularProgress
} from '@mui/material';
import { paymentAPI } from '../utils/axios';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import axios from 'axios';

// Styled components for animations
const AnimatedTableContainer = styled(TableContainer)`
  transition: all 0.3s ease-in-out;
  opacity: 0;
  transform: translateY(20px);
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: 20px;
  .MuiTabs-indicator {
    height: 3px;
    background: linear-gradient(45deg, #2193b0, #6dd5ed);
  }
`;

const StyledTab = styled(Tab)`
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: #2193b0;
  }
  &.Mui-selected {
    color: #2193b0;
    font-weight: bold;
  }
`;

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(33, 147, 176, 0.1);
    transform: scale(1.01);
  }
`;

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState({ accepted: [], cancelled: [] });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variables for API URLs
  const API_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PRODUCTION_API_URL
    : process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all orders
        const response = await paymentAPI.getAllPayments();
        console.log('Orders API Response:', response);

        if (response && response.success) {
          const allOrders = response.data || [];
          setOrders({
            accepted: allOrders.filter(order => 
              order.status === 'accepted' || 
              order.paymentStatus === 'successful'),
            cancelled: allOrders.filter(order => 
              order.status === 'cancelled' || 
              order.paymentStatus === 'failed')
          });
        } else {
          setOrders({ accepted: [], cancelled: [] });
        }
        
        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.response?.status === 404 
          ? 'No orders found. The system is ready to receive new orders.'
          : 'Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  const handleTabChange = (event, newValue) => {
    setIsVisible(false);
    setTimeout(() => {
      setTab(newValue);
      setIsVisible(true);
    }, 300);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{
        marginLeft: '240px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Empty state with custom message
  if (!loading && orders.accepted.length === 0 && orders.cancelled.length === 0) {
    return (
      <Box sx={{
        marginLeft: '240px',
        padding: '24px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ShoppingBasketIcon sx={{ fontSize: 60, color: '#2193b0', mb: 2 }} />
        <Typography variant="h5" sx={{ color: '#2193b0', mb: 1 }}>
          No Orders Available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error || 'Orders will appear here once customers start placing them'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      marginLeft: '240px',
      padding: '24px',
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
    }}>
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Paper elevation={3} sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            background: 'white',
            p: 3,
          }}>
            <StyledTabs 
              value={tab} 
              onChange={handleTabChange}
              centered
              sx={{ mb: 3 }}
            >
              <StyledTab label={`Successful Payments (${orders.accepted.length})`} />
              <StyledTab label={`Failed Payments (${orders.cancelled.length})`} />
            </StyledTabs>

            <AnimatedTableContainer
              className={isVisible ? 'visible' : ''}
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(33, 147, 176, 0.3)',
                  borderRadius: '4px',
                },
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Payment ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(tab === 0 ? orders.accepted : orders.cancelled).map((order) => (
                    <StyledTableRow key={order._id || order.paymentId}>
                      <TableCell>{order.paymentId || order._id || 'N/A'}</TableCell>
                      <TableCell>{order.customerName || order.customer || 'N/A'}</TableCell>
                      <TableCell>{order.serviceName || order.service || 'N/A'}</TableCell>
                      <TableCell>₹{order.amount?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: order.status === 'successful' ? 'green' : 'red',
                            fontWeight: 'bold'
                          }}
                        >
                          {order.status || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </AnimatedTableContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Orders;