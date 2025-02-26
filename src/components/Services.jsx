import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { categoriesWithSubs } from '../utils/categories';
import axios from '../utils/axios'; // Use the configured axios instance
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';
import { styled as muiStyled } from '@mui/material/styles';

const VALID_CATEGORIES = {
  'Office Stationaries': [
    'Notebooks & Papers',
    'Adhesive & Glue',
    'Pen & Pencil Kits',
    'Whitener & Markers',
    'Stapler & Scissors',
    'Calculator'
  ]
};

const StyledPaper = styled(Paper)({
  padding: '32px',
  marginTop: '32px',
  borderRadius: '16px',
  maxHeight: '75vh',
  minHeight: '500px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#2193b0',
    borderRadius: '4px',
    '&:hover': {
      background: '#1c7a94',
    },
  },
});

const Services = () => {
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    productName: '',
    price: '',
    description: '',
    offers: '',
    review: '',
    rating: '',
    images: new Array(6).fill(null), // Changed to 6 slots
    imageUrl: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryChange = (event) => {
    setFormData({ 
      ...formData, 
      category: event.target.value,
      subCategory: '' // Reset subcategory when category changes
    });
  };

  // Handle individual image upload
  const handleSingleImageChange = (index) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({
        ...formData,
        images: newImages
      });
    }
  };

  // Clear individual image
  const handleClearImage = (index) => () => {
    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Match the exact API data structure
      const serviceData = {
        name: formData.productName,           // Required field from API
        productName: formData.productName,    // Same as name
        category: formData.category,
        subCategory: "Adhesive & Glue",       // Required field
        price: Number(formData.price),
        description: formData.description,
        offers: "0",                          // Required field
        review: "0",                          // Required field
        rating: 0,                            // Required field
        images: [formData.imageUrl],          // Array format required
        isAvailable: true,                    // Required field
        duration: 0                           // Required field
      };

      const response = await axios.post('/api/services', serviceData);
      
      if (response.data) {
        console.log('Service created:', response.data);
        setSuccess(true);
        // Reset form
        setFormData({
          productName: '',
          description: '',
          price: '',
          category: '',
          imageUrl: ''
        });
      }
    } catch (error) {
      console.error('Error creating service:', {
        message: error.message,
        response: error.response?.data,
        data: error.response?.data
      });
      setError('Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update validation to include name and duration
  const validateForm = () => {
    const errors = [];
    
    if (!formData.productName) errors.push('Product name is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.subCategory) errors.push('Sub-category is required');
    if (!formData.price) errors.push('Price is required');
    if (!formData.description) errors.push('Description is required');
    
    if (formData.price && isNaN(parseFloat(formData.price))) {
        errors.push('Price must be a valid number');
    }
    
    return errors;
  };

  // Add this to your JSX before the submit button
  // const renderValidationErrors = () => {
  //     const errors = validateForm();
  //     if (errors.length > 0) {
  //         return (
  //             <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
  //                 <ul style={{ margin: 0, paddingLeft: 20 }}>
  //                     {errors.map((error, index) => (
  //                         <li key={index}>{error}</li>
  //                     ))}
  //                 </ul>
  //             </Alert>
  //         );
  //     }
  //     return null;
  // };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      mt: 4,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      marginLeft: '120px',
    }}>
      <Container maxWidth="md" sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <StyledPaper elevation={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%'
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#2193b0', fontWeight: 600 }}>
            Add New Service
          </Typography>

          {/* {renderValidationErrors()} */}

          <form onSubmit={handleSubmit} style={{ flex: 1, width: '100%' }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    label="Category"
                  >
                    {Object.keys(categoriesWithSubs).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Sub Category</InputLabel>
                  <Select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    label="Sub Category"
                    disabled={!formData.category}
                  >
                    {formData.category && categoriesWithSubs[formData.category].map((subCategory) => (
                      <MenuItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  sx={{ mb: 2 }}
                  value={formData.productName}
                  onChange={handleChange}
                  name="productName"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price (INR)"
                  type="number"
                  sx={{ mb: 2 }}
                  value={formData.price}
                  onChange={handleChange}
                  name="price"
                  InputProps={{
                    startAdornment: '₹',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Offers"
                  sx={{ mb: 2 }}
                  value={formData.offers}
                  onChange={handleChange}
                  name="offers"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Review"
                  sx={{ mb: 2 }}
                  value={formData.review}
                  onChange={handleChange}
                  name="review"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                  sx={{ mb: 2 }}
                  value={formData.rating}
                  onChange={handleChange}
                  name="rating"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  sx={{ mb: 2 }}
                  value={formData.imageUrl}
                  onChange={handleChange}
                  name="imageUrl"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upload Additional Images (Max 6)
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {formData.images.map((image, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            p: 2,
                            mb: 2,
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Image {index + 1}
                          </Typography>
                          
                          {image ? (
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" noWrap>
                                {image.name}
                              </Typography>
                              <Box sx={{ mt: 1, flex: 1, position: 'relative' }}>
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              </Box>
                              <Button
                                size="small"
                                color="error"
                                onClick={handleClearImage(index)}
                                sx={{ mt: 1 }}
                              >
                                Remove
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ 
                              flex: 1, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}>
                              <input
                                accept="image/*"
                                type="file"
                                id={`image-upload-${index}`}
                                style={{ display: 'none' }}
                                onChange={handleSingleImageChange(index)}
                              />
                              <label htmlFor={`image-upload-${index}`}>
                                <Button
                                  component="span"
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    width: '100%',
                                    height: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      Click to Upload
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      Image {index + 1}
                                    </Typography>
                                  </Box>
                                </Button>
                              </label>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                  sx={{
                    mt: 2,
                    height: 56,
                    background: 'linear-gradient(45deg, #2193b0, #6dd5ed)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1c7a94, #5bb8cc)'
                    },
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none'
                  }}
                >
                  {loading ? 'Creating Service...' : 'Create Service'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>

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
            Service created successfully!
          </Typography>
        </Snackbar>

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

export default Services;