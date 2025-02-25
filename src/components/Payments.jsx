import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  styled,
  Alert
} from '@mui/material';
import axios from 'axios';
import PaymentIcon from '@mui/icons-material/Payment';

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(33, 147, 176, 0.1);
    transform: scale(1.01);
  }
`;

const Payments = () => {
  const [tabValue, setTabValue] = useState(0);
  const [payments, setPayments] = useState({ successful: [], failed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://boldservebackend-production.up.railway.app/api/payments', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.success) {
          setPayments({
            successful: response.data.data.filter(payment => 
              payment.status === 'successful' || payment.status === 'completed'),
            failed: response.data.data.filter(payment => 
              payment.status === 'failed' || payment.status === 'cancelled')
          });
          setError(null);
        } else {
          throw new Error('Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to load payments. Please try again later.');
        setPayments({ successful: [], failed: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        marginLeft: '240px'
      }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading payments...
        </Typography>
      </Box>
    );
  }

  // Show empty state when no payments exist
  if (!loading && payments.successful.length === 0 && payments.failed.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        marginLeft: '240px',
        backgroundColor: '#f5f7fa'
      }}>
        <PaymentIcon sx={{ fontSize: 60, color: '#2193b0', mb: 2 }} />
        <Typography variant="h5" sx={{ color: '#2193b0', mb: 1 }}>
          No Payments Made Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Payments will appear here once customers complete their transactions
        </Typography>
      </Box>
    );
  }

  const renderPaymentTable = (payments) => (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Customer Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Service</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Amount</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <StyledTableRow key={payment._id}>
                <TableCell>{payment._id}</TableCell>
                <TableCell>{payment.customerName || 'N/A'}</TableCell>
                <TableCell>{payment.serviceName || 'N/A'}</TableCell>
                <TableCell>₹{payment.amount?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell>
                  {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: payment.status === 'successful' || payment.status === 'completed' 
                        ? 'green' 
                        : 'red',
                      fontWeight: 'bold'
                    }}
                  >
                    {payment.status?.toUpperCase() || 'N/A'}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                {error || 'No payments found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ marginLeft: '240px', padding: '24px', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            Payment Management
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab 
              label={`Successful Payments (${payments.successful.length})`}
              sx={{ fontWeight: 'bold' }}
            />
            <Tab 
              label={`Failed Payments (${payments.failed.length})`}
              sx={{ fontWeight: 'bold' }}
            />
          </Tabs>

          {tabValue === 0 && renderPaymentTable(payments.successful)}
          {tabValue === 1 && renderPaymentTable(payments.failed)}
        </Paper>
      </Container>
    </Box>
  );
};

export default Payments; 