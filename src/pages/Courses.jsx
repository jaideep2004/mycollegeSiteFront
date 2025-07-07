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
	TextField,
	InputAdornment,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Pagination,
	Skeleton,
	useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import api from '../services/api';

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/banner22.jpg')`,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	padding: theme.spacing(10, 0),
	textAlign: 'center',
	color: '#fff',
}));

const CourseCard = styled(Card)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.3s, box-shadow 0.3s',
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
}));

const CourseInfoItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginRight: theme.spacing(2),
	'& svg': {
		marginRight: theme.spacing(0.5),
		fontSize: '1rem',
		color: theme.palette.text.secondary,
	},
}));

const Courses = () => {
	const theme = useTheme();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [category, setCategory] = useState('all');
	const [sortBy, setSortBy] = useState('newest');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [categories, setCategories] = useState([]);
	const [departments, setDepartments] = useState([]);
	const coursesPerPage = 8;

	// Fetch courses and categories
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				
				// Fetch categories, departments, and courses
				const [categoriesRes, departmentsRes, coursesRes] = await Promise.all([
					api.public.getCategories(),
					api.public.getDepartments(),
					api.public.getCourses()
				]);
				
				// Extract data from response objects
				const categoriesData = categoriesRes?.data || [];
				const departmentsData = departmentsRes?.data || [];
				const coursesData = coursesRes?.data || [];
				
				console.log('Courses data:', coursesData);
				
				setCategories([
					{ _id: 'all', name: 'All Categories' },
					...categoriesData
				]);
				
				setDepartments(departmentsData);
				
				// Process courses
				setCourses(coursesData);
				
				// Calculate total pages
				setTotalPages(Math.ceil(coursesData.length / coursesPerPage));
				
				setLoading(false);
			} catch (error) {
				console.error('Error fetching courses data:', error);
				// If API fails, use empty arrays
				setCategories([{ _id: 'all', name: 'All Categories' }]);
				setDepartments([]);
				setCourses([]);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Filter and sort courses
	const filteredCourses = Array.isArray(courses) ? courses
		.filter(course => {
			// Filter by search term
			const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
			
			// Filter by category
			const matchesCategory = category === 'all' || (course.categoryId && course.categoryId._id === category);
			
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			// Sort by selected option
			if (sortBy === 'newest') {
				return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
			} else if (sortBy === 'oldest') {
				return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
			} else if (sortBy === 'price-low') {
				return (a.feeStructure?.fullFee || 0) - (b.feeStructure?.fullFee || 0);
			} else if (sortBy === 'price-high') {
				return (b.feeStructure?.fullFee || 0) - (a.feeStructure?.fullFee || 0);
			} else if (sortBy === 'name-asc') {
				return a.name.localeCompare(b.name);
			} else if (sortBy === 'name-desc') {
				return b.name.localeCompare(a.name);
			}
			return 0;
		}) : [];

	// Get current page courses
	const indexOfLastCourse = page * coursesPerPage;
	const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
	const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

	// Handle page change
	const handlePageChange = (event, value) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Handle search change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
		setPage(1);
	};

	// Handle category change
	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
		setPage(1);
	};

	// Handle sort change
	const handleSortChange = (e) => {
		setSortBy(e.target.value);
	};

	// Get department name by ID
	const getDepartmentName = (departmentId) => {
		if (!departmentId || !Array.isArray(departments)) return 'Department';
		const department = departments.find(dept => dept._id === departmentId);
		return department ? department.name : 'Department';
	};

	// Get category name by ID
	const getCategoryName = (categoryId) => {
		if (!categoryId || !Array.isArray(categories)) return 'Category';
		const category = categories.find(cat => cat._id === categoryId);
		return category ? category.name : 'Category';
	};

	return (
		<Box sx={{ fontFamily: 'Poppins, sans-serif' }}>
			{/* Page Banner */}
			<PageBanner>
				<Container>
					<Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
						Our Courses
					</Typography>
					<Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
						Explore our wide range of courses designed to help you achieve your academic and career goals.
					</Typography>
				</Container>
			</PageBanner>

			{/* Courses Section */}
			<Container sx={{ py: 8 }}>
				{/* Filters */}
				<Grid container spacing={3} sx={{ mb: 6 }}>
					<Grid item xs={12} md={6}>
						<TextField
							fullWidth
							placeholder="Search courses..."
							value={searchTerm}
							onChange={handleSearchChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl fullWidth>
							<InputLabel>Category</InputLabel>
							<Select
								value={category}
								label="Category"
								onChange={handleCategoryChange}
							>
								{categories.map((cat) => (
									<MenuItem key={cat._id} value={cat._id}>
										{cat.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<FormControl fullWidth>
							<InputLabel>Sort By</InputLabel>
							<Select
								value={sortBy}
								label="Sort By"
								onChange={handleSortChange}
							>
								<MenuItem value="newest">Newest First</MenuItem>
								<MenuItem value="oldest">Oldest First</MenuItem>
								<MenuItem value="name-asc">Name (A-Z)</MenuItem>
								<MenuItem value="name-desc">Name (Z-A)</MenuItem>
								<MenuItem value="price-low">Price (Low to High)</MenuItem>
								<MenuItem value="price-high">Price (High to Low)</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				{/* Courses Grid */}
				{loading ? (
					<Grid container spacing={4}>
						{Array.from(new Array(8)).map((_, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
								<Card sx={{ height: '100%' }}>
									<Skeleton variant="rectangular" height={200} />
									<CardContent>
										<Skeleton variant="text" height={30} />
										<Skeleton variant="text" height={20} />
										<Skeleton variant="text" height={20} />
										<Skeleton variant="text" height={40} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				) : currentCourses.length > 0 ? (
					<>
						<Grid container spacing={4}>
							{currentCourses.map((course, index) => (
								<Grid item xs={12} sm={6} md={3} key={course._id || index}>
									<CourseCard>
										<Box sx={{ position: 'relative' }}>
											<CardMedia
												component="img"
												height={200}
												image={course.thumbnailUrl || `/images/courses/course${(index % 4) + 1}.jpg`}
												alt={course.name}
											/>
											<CategoryChip 
												label={getCategoryName(course.categoryId)} 
												size="small" 
											/>
										</Box>
										<CardContent sx={{ flexGrow: 1 }}>
											<Typography variant="h6" component="h3" gutterBottom>
												{course.name}
											</Typography>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
												<SchoolIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
												<Typography variant="body2" color="text.secondary">
													{getDepartmentName(course.departmentId)}
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
												<Typography variant="subtitle1" fontWeight="bold" color="primary">
													₹{course.feeStructure?.fullFee.toLocaleString()}
												</Typography>
												<Button 
													variant="outlined" 
													size="small" 
													component={RouterLink}
													to={`/courses/${course._id}`}
												>
													Details
												</Button>
											</Box>
										</CardContent>
									</CourseCard>
								</Grid>
							))}
						</Grid>

						{/* Pagination */}
						{totalPages > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
								<Pagination 
									count={totalPages} 
									page={page} 
									onChange={handlePageChange} 
									color="primary" 
									size="large"
								/>
							</Box>
						)}
					</>
				) : (
					<Box sx={{ textAlign: 'center', py: 8 }}>
						<Typography variant="h5" color="text.secondary" gutterBottom>
							No courses found
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Try adjusting your search or filter criteria
						</Typography>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export default Courses;
