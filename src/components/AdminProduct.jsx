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
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { serviceAPI } from '../utils/axios';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await serviceAPI.getAllProducts();
            console.log('Products API Response:', response); // Debug log

            if (response && response.data) {
                setProducts(Array.isArray(response.data) ? response.data : []);
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error loading products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            await serviceAPI.deleteProduct(productId);
            setProducts(products.filter(product => product._id !== productId));
            setDeleteDialogOpen(false);
            setSuccessMessage('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Failed to delete product. Please try again.');
        }
    };

    const getImageUrl = (imagePathArray) => {
        try {
            if (imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0) {
                const imagePath = imagePathArray[0];
                // Use the complete URL from the backend
                return `https://boldservebackend-production.up.railway.app${imagePath}`;
            }
            return 'https://via.placeholder.com/300';
        } catch (error) {
            console.error('Error processing image URL:', error);
            return 'https://via.placeholder.com/300';
        }
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

    return (
        <Box sx={{ 
            p: 3,
            marginLeft: '240px',
            width: 'calc(100% - 240px)',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            {/* Header */}
            <Typography variant="h4" sx={{ mb: 4, color: '#1a237e', fontWeight: 600, textAlign: 'center' }}>
                Products Management
            </Typography>

            {/* Error Snackbar */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setError(null)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* Success Snackbar */}
            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage('')}
            >
                <Alert 
                    onClose={() => setSuccessMessage('')} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Retry Button when error occurs */}
            {error && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Button 
                        variant="contained" 
                        onClick={fetchProducts}
                        sx={{ mt: 2 }}
                    >
                        Retry Loading Products
                    </Button>
                </Box>
            )}

            {/* Products Grid - Updated with center alignment */}
            <Box sx={{ 
                maxWidth: '1200px', // Limit maximum width
                margin: '0 auto',   // Center the container
                px: 2              // Add horizontal padding
            }}>
                <Grid 
                    container 
                    spacing={3} 
                    justifyContent="center" 
                    alignItems="stretch"
                >
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
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

export default AdminProductList;