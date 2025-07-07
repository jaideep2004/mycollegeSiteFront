import React, { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Grid,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Button,
	Chip,
	CircularProgress,
	Breadcrumbs,
	Link,
	useTheme,
	Divider,
	Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import api from '../services/api';
import ParticlesBackground from '../components/ParticlesBackground';

// Motion components
const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

// Animation variants
const fadeIn = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.8 } },
};

const fadeInUp = {
	hidden: { opacity: 0, y: 60 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const staggerItem = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/banner22.jpg')`,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	padding: theme.spacing(10, 0),
	color: '#fff',
	position: 'relative',
	overflow: 'hidden',
}));

const CourseCard = styled(motion(Card))(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.3s, box-shadow 0.3s',
	borderRadius: theme.shape.borderRadius * 2,
	overflow: 'hidden',
	boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
	'&:hover': {
		transform: 'translateY(-8px)',
		boxShadow: theme.shadows[8],
	},
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
	position: 'absolute',
	top: 16,
	left: 16,
	backgroundColor: theme.palette.primary.main,
	color: '#fff',
	fontWeight: 'bold',
	boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
}));

const Category = () => {
	const { id } = useParams();
	const theme = useTheme();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState(null);
	const [courses, setCourses] = useState([]);

	// Animation refs
	const [headerRef, headerInView] = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});
	
	const [contentRef, contentInView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});

	useEffect(() => {
		const fetchCategoryData = async () => {
			try {
				setLoading(true);
				
				// Fetch category details
				const categoryRes = await api.public.getCategories();
				
				// Extract data from response
				const categoriesData = categoryRes?.data || [];
				
				// Find the category with matching ID
				const categoryData = Array.isArray(categoriesData) ? 
					categoriesData.find(cat => cat._id === id) : null;
				
				if (categoryData) {
					setCategory(categoryData);
					
					// Fetch courses for this category
					const coursesRes = await api.public.getCourses();
					
					// Extract courses data from response
					const coursesData = coursesRes?.data || [];
					
					// Filter courses by category ID
					const categoryCourses = Array.isArray(coursesData) ? 
						coursesData.filter(course => 
							course.categoryId && course.categoryId._id === id
						) : [];
					
					setCourses(categoryCourses);
				} else {
					// Category not found
					navigate('/courses');
				}
				
				setLoading(false);
			} catch (error) {
				console.error('Error fetching category data:', error);
				setLoading(false);
				navigate('/courses');
			}
		};

		fetchCategoryData();
	}, [id, navigate]);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
				<CircularProgress color="primary" size={60} thickness={4} />
			</Box>
		);
	}

	return (
		<Box sx={{ position: "relative", overflow: "hidden" }}>
			{/* Particles Background */}
			<Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0, opacity: 0.6 }}>
				<ParticlesBackground />
			</Box>

			{/* Page Banner */}
			<PageBanner>
				<MotionContainer
					ref={headerRef}
					initial="hidden"
					animate={headerInView ? "visible" : "hidden"}
					variants={fadeIn}>
					<MotionBox sx={{ textAlign: 'center' }} variants={fadeInUp}>
						<Chip
							label='Category'
							color='primary'
							size='medium'
							icon={<SchoolIcon />}
							sx={{ mb: 2, fontWeight: 500 }}
						/>
						<MotionTypography 
							variant="h2" 
							component="h1" 
							gutterBottom 
							fontWeight="bold"
							variants={fadeInUp}>
							{category?.name || 'Category'}
						</MotionTypography>
						<Breadcrumbs 
							separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
							aria-label="breadcrumb"
							sx={{ 
								display: 'flex', 
								justifyContent: 'center',
								'& .MuiBreadcrumbs-ol': {
									justifyContent: 'center',
								},
								'& a': {
									color: 'rgba(255,255,255,0.7)',
									'&:hover': {
										color: '#fff',
									},
								},
							}}
						>
							<Link component={RouterLink} to="/" color="inherit">
								Home
							</Link>
							<Link component={RouterLink} to="/courses" color="inherit">
								Courses
							</Link>
							<Typography color="#fff">{category?.name || 'Category'}</Typography>
						</Breadcrumbs>
					</MotionBox>
				</MotionContainer>
			</PageBanner>

			{/* Courses Section */}
			<MotionContainer 
				sx={{ py: 8, position: 'relative', zIndex: 1 }}
				ref={contentRef}
				initial="hidden"
				animate={contentInView ? "visible" : "hidden"}
				variants={fadeInUp}>
				<MotionPaper 
					elevation={3} 
					sx={{ 
						p: 4, 
						mb: 6, 
						borderRadius: 2,
						background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
						boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
					}}
					variants={fadeIn}>
					<MotionTypography variant="h4" component="h2" gutterBottom color="primary" fontWeight="bold" variants={fadeIn}>
						Courses in {category?.name || 'this category'}
					</MotionTypography>
					<Divider sx={{ mb: 3 }} />
					<MotionTypography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }} variants={fadeIn}>
						{category?.description || `Explore our comprehensive range of courses in the ${category?.name || ''} category. 
						Our curriculum is designed to provide students with both theoretical knowledge and practical skills, 
						preparing them for successful careers in this field.`}
					</MotionTypography>

					<MotionGrid 
						container 
						spacing={3} 
						sx={{ mt: 2 }}
						variants={staggerContainer}
						initial="hidden"
						animate="visible">
						<MotionGrid item xs={12} sm={6} md={3} variants={staggerItem}>
							<Box sx={{ 
								textAlign: "center", 
								p: 3,
								borderRadius: 2,
								background: "white",
								boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							}}>
								<SchoolIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									{courses.length}
								</Typography>
								<Typography variant='body1'>Available Courses</Typography>
							</Box>
						</MotionGrid>
						<MotionGrid item xs={12} sm={6} md={3} variants={staggerItem}>
							<Box sx={{ 
								textAlign: "center", 
								p: 3,
								borderRadius: 2,
								background: "white",
								boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							}}>
								<EventIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									{new Date().getFullYear()}
								</Typography>
								<Typography variant='body1'>Academic Year</Typography>
							</Box>
						</MotionGrid>
						<MotionGrid item xs={12} sm={6} md={3} variants={staggerItem}>
							<Box sx={{ 
								textAlign: "center", 
								p: 3,
								borderRadius: 2,
								background: "white",
								boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							}}>
								<AccessTimeIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									4 Yrs
								</Typography>
								<Typography variant='body1'>Average Duration</Typography>
							</Box>
						</MotionGrid>
						<MotionGrid item xs={12} sm={6} md={3} variants={staggerItem}>
							<Box sx={{ 
								textAlign: "center", 
								p: 3,
								borderRadius: 2,
								background: "white",
								boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
							}}>
								<PaymentIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									95%
								</Typography>
								<Typography variant='body1'>Placement Rate</Typography>
							</Box>
						</MotionGrid>
					</MotionGrid>
				</MotionPaper>

				{courses.length > 0 ? (
					<MotionGrid 
						container 
						spacing={4}
						variants={staggerContainer}
						initial="hidden"
						animate="visible">
						{courses.map((course, index) => (
							<MotionGrid item xs={12} sm={6} md={4} key={course._id || index} variants={staggerItem}>
								<CourseCard>
									<Box sx={{ position: 'relative' }}>
										<CardMedia
											component="img"
											height="200"
											image={course.thumbnailUrl || `/images/courses/course${(index % 4) + 1}.jpg`}
											alt={course.name}
										/>
										<CategoryChip 
											label={course.departmentId?.name || 'Department'} 
											size="small"
										/>
									</Box>
									<CardContent sx={{ flexGrow: 1, p: 3 }}>
										<Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
											{course.name}
										</Typography>
										<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
											<SchoolIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
											<Typography variant="body2" color="text.secondary">
												{course.departmentId?.name || 'Department'}
											</Typography>
										</Box>
										
										<Divider sx={{ my: 2 }} />
										
										<Grid container spacing={2} sx={{ mb: 2 }}>
											<Grid item xs={6}>
												<Typography variant="body2" color="text.secondary">
													Registration Fee:
												</Typography>
												<Typography variant="body2" fontWeight="bold">
													₹{course.feeStructure?.registrationFee?.toLocaleString() || '0'}
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography variant="body2" color="text.secondary">
													Full Fee:
												</Typography>
												<Typography variant="body2" fontWeight="bold">
													₹{course.feeStructure?.fullFee?.toLocaleString() || '0'}
												</Typography>
											</Grid>
										</Grid>
										
										<Button 
											variant="contained" 
											fullWidth
											component={RouterLink}
											to={`/courses/${course._id}`}
											sx={{
												mt: 2,
												borderRadius: 2,
												py: 1,
												fontWeight: "bold",
												boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
											}}
										>
											View Details
										</Button>
									</CardContent>
								</CourseCard>
							</MotionGrid>
						))}
					</MotionGrid>
				) : (
					<MotionPaper 
						elevation={3} 
						sx={{ 
							textAlign: 'center', 
							py: 5, 
							px: 3, 
							borderRadius: 2,
							background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
							boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
						}}
						variants={fadeIn}>
						<MotionTypography variant="h6" color="text.secondary" variants={fadeIn}>
							No courses available in this category at the moment.
						</MotionTypography>
						<Button
							variant="contained"
							component={RouterLink}
							to="/courses"
							sx={{ 
								mt: 3,
								borderRadius: 2,
								px: 4,
								py: 1.5,
								fontWeight: "bold",
								boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
							}}
						>
							Browse All Courses
						</Button>
					</MotionPaper>
				)}
			</MotionContainer>
		</Box>
	);
};

export default Category; 