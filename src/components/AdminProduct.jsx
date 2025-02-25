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
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE_URL = 'https://boldservebackend-production.up.railway.app';

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE_URL}/api/services`);
            console.log('Products API Response:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setProducts(response.data.data);
            } else {
                setProducts([]); // Set empty array if no products
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('No products available. Please add some products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/services/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
            setDeleteDialogOpen(false);
            setSuccessMessage('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const getImageUrl = (imagePathArray) => {
        if (imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0) {
            const imagePath = imagePathArray[0];
            return `${API_BASE_URL}${imagePath}`;
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
            p: 3,
            marginLeft: '240px',
            width: 'calc(100% - 240px)',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1a237e', fontWeight: 600, textAlign: 'center' }}>
                Products Management
            </Typography>

            {/* Snackbars */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage('')}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Products Grid */}
            <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <Box sx={{
                                        height: '200px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#f8f8f8',
                                        padding: 2,
                                        overflow: 'hidden'
                                    }}>
                                        <CardMedia
                                            component="img"
                                            image={getImageUrl(product.images)}
                                            alt={product.productName}
                                            sx={{ 
                                                width: 'auto',
                                                height: '140px', // Decreased from 200px
                                                objectFit: 'contain',
                                                margin: 'auto'
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Category: {product.category}
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                            ₹{product.price?.toLocaleString()}
                                        </Typography>
                                        <IconButton 
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setDeleteDialogOpen(true);
                                            }}
                                            color="error"
                                            sx={{ mt: 1 }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {selectedProduct?.productName}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={() => handleDelete(selectedProduct?._id)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
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

export default AdminProductList;