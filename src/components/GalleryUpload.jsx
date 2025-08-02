import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';

const GalleryUpload = ({ open, onClose, onUploadSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.public.getContentByType('gallery-category');
        const categoryData = Array.isArray(response) ? response : (response?.data || []);
        setCategories(categoryData);
        if (categoryData.length > 0 && !selectedCategory) {
          setSelectedCategory(categoryData[0]._id);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError('');
    const uploadPromises = [];
    const progress = {};

    // Initialize progress tracking
    selectedFiles.forEach((_, index) => {
      progress[index] = 0;
    });
    setUploadProgress({ ...progress });

    // Upload each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);
      formData.append('title', file.name.split('.')[0]); // Use filename as title

      try {
        const response = await api.admin.uploadGalleryImage(formData, (progressEvent) => {
          // Update progress for this file
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({
            ...prev,
            [i]: percentCompleted
          }));
        });
        
        uploadPromises.push(response);
      } catch (err) {
        console.error(`Error uploading file ${file.name}:`, err);
        // Continue with other files even if one fails
      }
    }

    try {
      await Promise.all(uploadPromises);
      onUploadSuccess?.();
      handleClose();
    } catch (err) {
      setError('Some files failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload Gallery Images</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
            disabled={uploading}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2} mb={2}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="gallery-upload"
            multiple
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="gallery-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Select Images
            </Button>
          </label>
          <Typography variant="caption" display="block" gutterBottom>
            Select multiple images to upload
          </Typography>
        </Box>

        {selectedFiles.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files ({selectedFiles.length}):
            </Typography>
            <Paper variant="outlined" style={{ maxHeight: 200, overflow: 'auto' }}>
              <Grid container spacing={1} p={1}>
                {selectedFiles.map((file, index) => (
                  <Grid item key={index} xs={12} sm={6}>
                    <Paper
                      elevation={1}
                      style={{
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography noWrap style={{ maxWidth: '70%' }}>
                        {file.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                    {uploadProgress[index] !== undefined && (
                      <Box mt={0.5}>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[index] || 0}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {uploadProgress[index]}% uploaded
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={selectedFiles.length === 0 || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GalleryUpload;
