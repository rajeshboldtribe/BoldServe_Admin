import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    DialogContentText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Define the API URL based on environment
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://boldservebackend-production.up.railway.app'
    : 'http://localhost:8003';

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://boldservebackend-production.up.railway.app/api/services', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data); // Debug log

                // Handle the data whether it's an array or wrapped in a data property
                const productsData = Array.isArray(data) ? data : (data.data || []);
                setProducts(productsData);
                setError(null);
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct?._id) return;

        try {
            setLoading(true);
            const response = await fetch(`https://boldservebackend-production.up.railway.app/api/services/${selectedProduct._id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setProducts(products.filter(p => p._id !== selectedProduct._id));
            setSuccessMessage('Product deleted successfully!');
            setSuccess(true);
        } catch (error) {
            console.error('Delete error:', error);
            setError('Failed to delete product. Please try again.');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    const getImageUrl = (imagePathArray) => {
        if (imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0) {
            const imagePath = imagePathArray[0];
            return `${API_URL}${imagePath}`;
        }
        return 'https://via.placeholder.com/300';
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                marginLeft: '240px'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // Show empty state when no products
    if (!loading && products.length === 0) {
        return (
            <Box sx={{ 
                p: 3,
                marginLeft: '240px',
                width: 'calc(100% - 240px)',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                    No Products Available
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#888' }}>
                    Start by adding some products to your inventory
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => window.location.href = '/admin/services'}
                >
                    Add New Product
                </Button>
            </Box>
        );
    }

    // Rest of your existing return statement for showing products
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
            <Container maxWidth="lg">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        overflow: 'hidden',
                        maxHeight: '80vh'
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
                        Manage Products
                    </Typography>
                    
                    <TableContainer sx={{ 
                        maxHeight: 'calc(80vh - 100px)',
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
                                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Product Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow 
                                        key={product._id}
                                        sx={{
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(33, 147, 176, 0.1)'
                                            }
                                        }}
                                    >
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>₹{product.price?.toLocaleString()}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(product)}
                                                sx={{
                                                    textTransform: 'none',
                                                    boxShadow: 'none'
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete {selectedProduct?.productName}? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success Snackbar */}
                <Snackbar
                    open={success}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Typography 
                        sx={{ 
                            bgcolor: 'success.main',
                            color: 'white',
                            p: 2,
                            borderRadius: 1
                        }}
                    >
                        {successMessage}
                    </Typography>
                </Snackbar>

                {/* Error Snackbar */}
                {error && (
                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={() => setError(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Typography 
                            sx={{ 
                                bgcolor: 'error.main',
                                color: 'white',
                                p: 2,
                                borderRadius: 1
                            }}
                        >
                            {error}
                        </Typography>
                    </Snackbar>
                )}
            </Container>
        </Box>
    );
};

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get('https://boldservebackend-production.up.railway.app/api/users');
            console.log('Users API Response:', response.data);

            if (response.data && response.data.success && Array.isArray(response.data.data)) {
                setUsers(response.data.data);
            } else {
                setUsers([]); // Set empty array if no users
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error loading users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                marginLeft: '240px'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!loading && users.length === 0) {
        return (
            <Box sx={{ 
                p: 3,
                marginLeft: '240px',
                width: 'calc(100% - 240px)',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                    No Users Available
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: 3,
            marginLeft: '240px',
            width: 'calc(100% - 240px)',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1a237e', fontWeight: 600, textAlign: 'center' }}>
                User Management
            </Typography>

            <Box sx={{ maxWidth: '800px', margin: '0 auto', px: 2 }}>
                <List>
                    {users.map((user) => (
                        <React.Fragment key={user._id}>
                            <Card sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                        </Grid>
                                        <Grid item xs={12} sm>
                                            <Typography variant="h6" component="div">
                                                {user.fullName}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.mobile}
                                                </Typography>
                                            </Box>
                                            {user.address && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {user.address}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default AdminProduct;