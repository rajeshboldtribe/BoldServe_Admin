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
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

// Define the API URL based on environment
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://boldservebackend-production.up.railway.app'
    : 'http://localhost:8003';

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://boldservebackend-production.up.railway.app/api/services');
                const data = await response.json();
                console.log('Fetched products:', data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle delete operation
    const handleDelete = async () => {
        if (!selectedProduct?._id) return;

        try {
            setLoading(true);
            setError(null);

            // Log delete attempt
            console.log('Attempting to delete product:', {
                id: selectedProduct._id,
                name: selectedProduct.productName
            });

            // Update the delete URL to match the backend route
            const deleteUrl = `https://boldservebackend-production.up.railway.app/api/services/admin/products/${selectedProduct._id}`;
            console.log('Delete URL:', deleteUrl);

            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            // Log the complete response
            console.log('Delete Response:', {
                status: deleteResponse.status,
                statusText: deleteResponse.statusText,
                ok: deleteResponse.ok
            });

            if (!deleteResponse.ok) {
                throw new Error(`Delete failed with status: ${deleteResponse.status}`);
            }

            // On successful delete
            setProducts(prevProducts => 
                prevProducts.filter(p => p._id !== selectedProduct._id)
            );
            
            setSuccessMessage('Product deleted successfully!');
            setSuccess(true);

            // Refresh the products list
            const getResponse = await fetch('https://boldservebackend-production.up.railway.app/api/services');
            const updatedProducts = await getResponse.json();
            
            if (Array.isArray(updatedProducts)) {
                setProducts(updatedProducts);
                console.log('Products list updated:', updatedProducts);
            }

        } catch (error) {
            console.error('Delete operation failed:', error);
            setError('Failed to delete product. Please try again.');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    // Handle delete button click
    const handleDeleteClick = (product) => {
        console.log('Selected product for deletion:', {
            id: product._id,
            name: product.productName
        });
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleLoginRedirect = () => {
        navigate('/admin/login'); // Adjust this path according to your login route
    };

    const getImageUrl = (imagePathArray) => {
        if (imagePathArray && Array.isArray(imagePathArray) && imagePathArray.length > 0) {
            const imagePath = imagePathArray[0];
            return `${API_URL}${imagePath}`;
        }
        return 'https://via.placeholder.com/300';
    };

    if (error?.includes('login')) {
        return (
            <Box sx={{ p: 3 }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLoginRedirect}
                            sx={{ mt: 2 }}
                        >
                            Go to Login
                        </Button>
                    </Paper>
                </Container>
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
        <Box sx={{ p: 3 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 3, color: '#2193b0', fontWeight: 600, textAlign: 'center' }}>
                        Product Management
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell>
                                                {product.images && product.images[0] && (
                                                    <img
                                                        src={`https://boldservebackend-production.up.railway.app${product.images[0]}`}
                                                        alt={product.name}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/50';
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>{product.productName}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>₹{product.price}</TableCell>
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteClick(product)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                <Dialog 
                    open={deleteDialogOpen} 
                    onClose={() => !loading && setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete "{selectedProduct?.productName}"?
                            <br />
                            Product ID: {selectedProduct?._id}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDelete} 
                            color="error" 
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={success || !!error}
                    autoHideDuration={6000}
                    onClose={() => {
                        setSuccess(false);
                        setError(null);
                    }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Paper
                        sx={{
                            padding: '12px 24px',
                            backgroundColor: success ? 'success.main' : 'error.main',
                            color: 'white',
                        }}
                    >
                        <Typography>
                            {success ? successMessage : error}
                        </Typography>
                    </Paper>
                </Snackbar>
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