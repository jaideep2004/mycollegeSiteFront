import React, { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Container,
	Grid,
	Typography,
	Card,
	CardMedia,
	CardContent,
	Button,
	Tabs,
	Tab,
	Fade,
	Dialog,
	DialogContent,
	IconButton,
	useTheme,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
	Paper,
	Snackbar,
	Alert,
	Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../services/api';
import GalleryUpload from '../components/GalleryUpload';

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/banner22.jpg')`,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	padding: theme.spacing(10, 0),
	textAlign: 'center',
	color: '#fff',
}));

const GalleryCard = styled(Card)(({ theme }) => ({
	height: '100%',
	cursor: 'pointer',
	overflow: 'hidden',
	transition: 'transform 0.3s',
	'&:hover': {
		transform: 'scale(1.03)',
		'& .MuiCardMedia-root': {
			transform: 'scale(1.1)',
		},
	},
	'& .MuiCardMedia-root': {
		transition: 'transform 0.5s',
	},
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
	marginBottom: theme.spacing(4),
	'& .MuiTabs-indicator': {
		backgroundColor: theme.palette.primary.main,
		height: 3,
	},
	'& .MuiTab-root': {
		textTransform: 'none',
		fontWeight: 600,
		fontSize: '1rem',
		minWidth: 100,
		'&.Mui-selected': {
			color: theme.palette.primary.main,
		},
	},
}));

const DialogNavButton = styled(IconButton)(({ theme }) => ({
	position: 'absolute',
	top: '50%',
	transform: 'translateY(-50%)',
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
	color: '#fff',
	'&:hover': {
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
}));

const UploadButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	'&.Mui-disabled': {
		backgroundColor: theme.palette.action.disabledBackground,
	},
}));

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const Gallery = () => {
	const theme = useTheme();
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [images, setImages] = useState([]);
	const [filteredImages, setFilteredImages] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [openDialog, setOpenDialog] = useState(false);
	const [currentImage, setCurrentImage] = useState(null);
	const [page, setPage] = useState(1);
	const imagesPerPage = 12;
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success',
	});
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				setLoading(true);
				
				// First fetch gallery categories
				const categoriesResponse = await api.public.getContentByType('gallery-category');
				console.log('Gallery categories response:', categoriesResponse);
				
				let categoryData = [];
				if (Array.isArray(categoriesResponse)) {
					categoryData = categoriesResponse;
				} else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
					categoryData = categoriesResponse.data;
				}
				
				// Then fetch gallery items
				const itemsResponse = await api.public.getGallery();
				console.log('Gallery items response:', itemsResponse);
				
				let itemsData = [];
				if (Array.isArray(itemsResponse)) {
					itemsData = itemsResponse;
				} else if (itemsResponse?.data && Array.isArray(itemsResponse.data)) {
					itemsData = itemsResponse.data;
				}
				
				// Set categories with 'All' as the first option
				setCategories([
					{ id: 'all', name: 'All' },
					...categoryData.map(cat => ({
						id: cat._id,
						name: cat.title,
						thumbnail: cat.thumbnailUrl || cat.fileUrl
					}))
				]);
				
				// Process images with category information
				const processedImages = itemsData.map(item => ({
					id: item._id,
					src: item.fileUrl,
					thumbnail: item.thumbnailUrl || item.fileUrl,
					title: item.title || 'Gallery Image',
					description: item.description || '',
					categoryId: item.category,
					categoryName: categoryData.find(cat => cat._id === item.category)?.title || 'Uncategorized',
					uploadedAt: item.uploadedAt
				}));
				
				console.log('Processed images:', processedImages);
				
				setImages(processedImages);
				setFilteredImages(processedImages);
				
				setLoading(false);
			} catch (error) {
				console.error('Error fetching gallery images:', error);
				
				// Show empty state on error
				setCategories([{ id: 'all', name: 'All' }]);
				setImages([]);
				setFilteredImages([]);
				setLoading(false);
				
				// Show error message
				setSnackbar({
					open: true,
					message: 'Failed to load gallery images. Please try again later.',
					severity: 'error'
				});
			}
		};

		fetchImages();
	}, []);

	// Filter images when category changes
	useEffect(() => {
		if (Array.isArray(images)) {
			if (selectedCategory === 'all') {
				setFilteredImages(images);
			} else {
				const filtered = images.filter(img => img.categoryId === selectedCategory);
				setFilteredImages(filtered);
			}
			setPage(1);
		} else {
			setFilteredImages([]);
		}
	}, [selectedCategory, images]);

	const handleTabChange = (event, newValue) => {
		setSelectedCategory(newValue);
	};

	const handleOpenImage = (image) => {
		setCurrentImage(image);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handlePrevImage = () => {
		const currentIndex = filteredImages.findIndex(img => img.id === currentImage.id);
		const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
		setCurrentImage(filteredImages[prevIndex]);
	};

	const handleNextImage = () => {
		const currentIndex = filteredImages.findIndex(img => img.id === currentImage.id);
		const nextIndex = (currentIndex + 1) % filteredImages.length;
		setCurrentImage(filteredImages[nextIndex]);
	};

	const handleLoadMore = () => {
		setPage(prev => prev + 1);
	};

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }));
	};

	const handleOpenUploadDialog = () => {
		setUploadDialogOpen(true);
	};

	const handleCloseUploadDialog = () => {
		setUploadDialogOpen(false);
	};

	const handleUploadSuccess = useCallback(() => {
		// Refresh the gallery after successful upload
		fetchImages();
		setSnackbar({
			open: true,
			message: 'Images uploaded successfully!',
			severity: 'success',
		});
	}, []);

	// Calculate pagination
	const displayedImages = filteredImages.slice(0, page * imagesPerPage);
	const hasMore = displayedImages.length < filteredImages.length;

	return (
		<Box sx={{ fontFamily: 'Poppins, sans-serif' }}>
			{/* Banner Section */}
			<PageBanner>
				<Container>
					<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
						<Box>
							<Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
								Our Gallery
							</Typography>
							<Typography variant="h6" sx={{ maxWidth: 700, mb: 4 }}>
								Explore our campus life, events, and student activities through our photo gallery.
							</Typography>
						</Box>
						<Button 
							variant="contained" 
							color="primary" 
							startIcon={<CloudUploadIcon />}
							onClick={handleOpenUploadDialog}
							sx={{ mt: 2 }}
						>
							Upload Images
						</Button>
					</Box>
				</Container>
			</PageBanner>

			{/* Gallery Section */}
			<Container sx={{ py: 8 }}>
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
						<CircularProgress />
					</Box>
				) : (
					<>
						{/* Category Tabs */}
						<StyledTabs
							value={selectedCategory}
							onChange={handleTabChange}
							variant="scrollable"
							scrollButtons="auto"
							allowScrollButtonsMobile
							centered
						>
							{categories.map((category) => (
								<Tab key={category.id} label={category.name} value={category.id} />
							))}
						</StyledTabs>

						{/* Gallery Grid */}
						<Grid container spacing={3}>
							{loading ? (
								// Loading skeletons
								Array.from(new Array(8)).map((_, index) => (
									<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
										<Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
									</Grid>
								))
							) : Array.isArray(filteredImages) && filteredImages.length > 0 ? (
								// Gallery images
								filteredImages.slice(0, page * imagesPerPage).map((image, index) => (
									<Grid item xs={12} sm={6} md={4} lg={3} key={image.id || index}>
										<GalleryCard onClick={() => handleOpenImage(image)}>
											<CardMedia
												component="img"
												height={200}
												image={image.thumbnail || image.src}
												alt={image.title}
											/>
										</GalleryCard>
									</Grid>
								))
							) : (
								// No images found
								<Grid item xs={12}>
									<Box sx={{ textAlign: 'center', py: 5 }}>
										<Typography variant="h6" color="text.secondary">
											No images found in this category.
										</Typography>
									</Box>
								</Grid>
							)}
						</Grid>

						{/* Load More Button */}
						{hasMore && (
							<Box sx={{ textAlign: 'center', mt: 6 }}>
								<Button
									variant="outlined"
									size="large"
									onClick={handleLoadMore}
								>
									Load More
								</Button>
							</Box>
						)}
					</>
				)}
			</Container>

			{/* Image Dialog */}
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth="lg"
				fullWidth
			>
				<DialogContent sx={{ p: 0, position: 'relative' }}>
					<IconButton
						onClick={handleCloseDialog}
						sx={{
							position: 'absolute',
							top: 8,
							right: 8,
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							color: '#fff',
							zIndex: 1,
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.7)',
							},
						}}
					>
						<CloseIcon />
					</IconButton>

					{currentImage && (
						<>
							<Box
								component="img"
								src={currentImage.src}
								alt={currentImage.title}
								sx={{
									width: '100%',
									height: 'auto',
									maxHeight: '80vh',
									objectFit: 'contain',
								}}
							/>

							<DialogNavButton
								onClick={handlePrevImage}
								sx={{ left: 16 }}
							>
								<ArrowBackIosNewIcon />
							</DialogNavButton>

							<DialogNavButton
								onClick={handleNextImage}
								sx={{ right: 16 }}
							>
								<ArrowForwardIosIcon />
							</DialogNavButton>

							<Box sx={{ p: 2 }}>
								<Typography variant="h6" gutterBottom>
									{currentImage.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{currentImage.categoryName}
								</Typography>
							</Box>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant="filled"
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>

			{/* Gallery Upload Dialog */}
			<GalleryUpload 
				open={uploadDialogOpen}
				onClose={handleCloseUploadDialog}
				onUploadSuccess={handleUploadSuccess}
			/>
		</Box>
	);
};

export default Gallery;
