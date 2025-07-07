import React, { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Container,
	useTheme,
	useMediaQuery,
	Avatar,
	Menu,
	MenuItem,
	Divider,
	Badge,
	Tooltip,
	alpha,
	Collapse,
	ListItemIcon
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import BusinessIcon from "@mui/icons-material/Business";
import { jwtDecode } from "jwt-decode";
import api from '../services/api';
import { toast } from 'react-toastify';

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
	backgroundColor: scrolled ? theme.palette.background.paper : 'rgba(0, 0, 0, 0.4)',
	boxShadow: scrolled ? theme.shadows[3] : 'none',
	transition: 'all 0.3s ease',
	position: 'fixed',
	zIndex: 1100,
	height: 90,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	height: 90,
	padding: '0 24px',
	[theme.breakpoints.up('md')]: {
		height: 90,
	},
}));

const NavButton = styled(Button)(({ theme, scrolled }) => ({
	color: scrolled ? theme.palette.text.primary : '#fff',
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
	'&:hover': {
		backgroundColor: scrolled 
			? alpha(theme.palette.primary.main, 0.1) 
			: 'rgba(255, 255, 255, 0.1)',
	},
}));

const LogoText = styled(Typography)(({ theme, scrolled }) => ({
	fontWeight: 'bold',
	color: scrolled ? theme.palette.text.primary : '#fff',
	display: 'flex',
	alignItems: 'center',
	'& svg': {
		marginRight: theme.spacing(1),
		color: scrolled ? theme.palette.primary.main : '#fff',
	}
}));

const NavbarPlaceholder = styled(Box)(({ theme }) => ({
	height: 90,
}));

const Navbar = ({ role, setRole }) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [profileAnchorEl, setProfileAnchorEl] = useState(null);
	const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
	const [coursesAnchorEl, setCoursesAnchorEl] = useState(null);
	const [departmentsAnchorEl, setDepartmentsAnchorEl] = useState(null);
	const [categoriesAnchorEl, setCategoriesAnchorEl] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const [scrolled, setScrolled] = useState(false);
	const [departments, setDepartments] = useState([]);
	const [categories, setCategories] = useState([]);
	const [courses, setCourses] = useState([]);
	const [mobileMenuOpen, setMobileMenuOpen] = useState({
		courses: false,
		departments: false,
		categories: false
	});
	const [localRole, setLocalRole] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();
	const location = useLocation();

	const isProfileMenuOpen = Boolean(profileAnchorEl);
	const isNotificationMenuOpen = Boolean(notificationAnchorEl);
	const isCoursesMenuOpen = Boolean(coursesAnchorEl);
	const isDepartmentsMenuOpen = Boolean(departmentsAnchorEl);
	const isCategoriesMenuOpen = Boolean(categoriesAnchorEl);

	useEffect(() => {
		// Initialize role from localStorage on component mount
		const storedRole = localStorage.getItem('role');
		const token = localStorage.getItem('token');
		
		console.log('Initial check - token:', token ? 'exists' : 'none', 'role:', storedRole);
		
		if (storedRole && token) {
			setLocalRole(storedRole);
			if (setRole) {
				console.log('Setting role from localStorage on mount:', storedRole);
				setRole(storedRole);
			}
		}
	}, [setRole]);

	useEffect(() => {
		// Update localRole when prop role changes
		if (role) {
			console.log('Updating localRole from prop:', role);
			setLocalRole(role);
		}
	}, [role]);

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem('token');
		const userRole = localStorage.getItem('role');
		
		console.log('Navbar useEffect - token:', token ? 'exists' : 'none', 'role:', userRole);
		
		if (token && userRole) {
			// If role prop is not set but we have a role in localStorage, update it
			if (!role && userRole) {
				console.log('Setting role from localStorage:', userRole);
				setRole(userRole);
				setLocalRole(userRole);
			}
			
			// Fetch notifications if user is logged in
			fetchNotifications();
		}
		
		// Add scroll event listener
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		
		window.addEventListener('scroll', handleScroll);
		
		// Fetch menu data regardless of login status
		fetchMenuData();
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [role, setRole]);

	const fetchMenuData = async () => {
		try {
			const [departmentsRes, categoriesRes, coursesRes] = await Promise.all([
				api.public.getDepartments(),
				api.public.getCategories(),
				api.public.getCourses()
			]);
			
			// Extract data from response objects
			const departments = departmentsRes?.data || [];
			const categories = categoriesRes?.data || [];
			const courses = coursesRes?.data || [];
			
			console.log('Navbar menu data:', { departments, categories, courses });
			
			setDepartments(Array.isArray(departments) ? departments : []);
			setCategories(Array.isArray(categories) ? categories : []);
			setCourses(Array.isArray(courses) ? courses : []);
		} catch (error) {
			console.error('Error fetching menu data:', error);
			setDepartments([]);
			setCategories([]);
			setCourses([]);
		}
	};

	const fetchNotifications = async () => {
		try {
			let notificationsData = [];
			
			// Use localRole as a fallback if role prop is not set
			const currentRole = role || localRole;
			
			if (currentRole === 'student') {
				const response = await api.student.getNotifications();
				notificationsData = response?.data || [];
			} else if (currentRole === 'admin') {
				// Assuming admin notifications are fetched from a similar endpoint
				const response = await api.admin.getContentByType('notification');
				notificationsData = response || [];
			} else if (currentRole === 'faculty') {
				const response = await api.faculty.getNotifications();
				notificationsData = response?.data || [];
			}
			
			// Ensure notificationsData is an array
			if (!Array.isArray(notificationsData)) {
				console.warn('Notifications data is not an array:', notificationsData);
				notificationsData = [];
			}
			
			setNotifications(notificationsData);
		} catch (error) {
			console.error('Error fetching notifications:', error);
			setNotifications([]);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('role');
		setRole(null);
		setLocalRole(null);
		navigate('/');
		toast.success('Logged out successfully');
	};

	const handleProfileMenuOpen = (event) => {
		setProfileAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setProfileAnchorEl(null);
	};

	const handleNotificationMenuOpen = (event) => {
		setNotificationAnchorEl(event.currentTarget);
	};

	const handleNotificationMenuClose = () => {
		setNotificationAnchorEl(null);
	};

	const handleCoursesMenuOpen = (event) => {
		setCoursesAnchorEl(event.currentTarget);
	};

	const handleCoursesMenuClose = () => {
		setCoursesAnchorEl(null);
	};

	const handleDepartmentsMenuOpen = (event) => {
		setDepartmentsAnchorEl(event.currentTarget);
	};

	const handleDepartmentsMenuClose = () => {
		setDepartmentsAnchorEl(null);
	};

	const handleCategoriesMenuOpen = (event) => {
		setCategoriesAnchorEl(event.currentTarget);
	};

	const handleCategoriesMenuClose = () => {
		setCategoriesAnchorEl(null);
	};

	const toggleMobileMenu = (menu) => {
		setMobileMenuOpen(prev => ({
			...prev,
			[menu]: !prev[menu]
		}));
	};

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	const navItems = [
		{ name: "Home", path: "/" },
		{ name: "About", path: "/about" },
		{ name: "Courses", path: "/courses" },
		{ name: "News", path: "/news" },
		{ name: "Announcements", path: "/announcements" },
		{ name: "Events", path: "/events" },
		{ name: "Gallery", path: "/gallery" },
		{ name: "Contact", path: "/contact" },
	];

	const getDashboardLink = () => {
		switch (role) {
			case "admin":
				return "/admin";
			case "faculty":
				return "/faculty";
			case "student":
				return "/student";
			default:
				return "/";
		}
	};

	const markNotificationAsRead = async (id) => {
		try {
			if (role === 'student') {
				await api.student.markNotificationAsRead(id);
			}
			// Update the notification in the state
			setNotifications(prev => 
				prev.map(notification => 
					notification._id === id 
						? { ...notification, isRead: true } 
						: notification
				)
			);
			handleNotificationMenuClose();
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	const formatNotificationTime = (timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
		
		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else {
			const diffInDays = Math.floor(diffInHours / 24);
			return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
		}
	};

	const renderProfileMenu = (
		<Menu
			anchorEl={profileAnchorEl}
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
			PaperProps={{
				elevation: 3,
				sx: { minWidth: 200 },
			}}
		>
			<Box sx={{ p: 2, textAlign: 'center' }}>
				<Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: theme.palette.primary.main }}>
					<AccountCircleIcon fontSize="large" />
				</Avatar>
				<Typography variant="subtitle1" fontWeight="bold">
					{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest'}
				</Typography>
			</Box>
			<Divider />
			<MenuItem 
				component={RouterLink} 
				to={getDashboardLink()} 
				onClick={handleProfileMenuClose}
				sx={{ py: 1.5 }}
			>
				Dashboard
			</MenuItem>
			<MenuItem 
				component={RouterLink} 
				to="/profile" 
				onClick={handleProfileMenuClose}
				sx={{ py: 1.5 }}
			>
				My Profile
			</MenuItem>
			<Divider />
			<MenuItem 
				onClick={() => {
					handleProfileMenuClose();
					handleLogout();
				}}
				sx={{ py: 1.5, color: 'error.main' }}
			>
				<LogoutIcon fontSize="small" sx={{ mr: 1 }} />
				Logout
			</MenuItem>
		</Menu>
	);

	const renderNotificationMenu = (
		<Menu
			anchorEl={notificationAnchorEl}
			open={isNotificationMenuOpen}
			onClose={handleNotificationMenuClose}
			PaperProps={{
				sx: { width: 320, maxHeight: 400, overflow: 'auto' }
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
				Notifications
			</Typography>
			<Divider />
			{!Array.isArray(notifications) || notifications.length === 0 ? (
				<MenuItem>
					<Typography variant="body2">No notifications</Typography>
				</MenuItem>
			) : (
				notifications.map((notification) => (
					<MenuItem 
						key={notification._id} 
						onClick={() => markNotificationAsRead(notification._id)}
						sx={{ 
							bgcolor: notification.isRead ? 'transparent' : alpha(theme.palette.primary.light, 0.1),
							borderLeft: notification.isRead ? 'none' : `4px solid ${theme.palette.primary.main}`,
							py: 1.5
						}}
					>
						<Box sx={{ width: '100%' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
								<Typography variant="subtitle2" fontWeight="bold">
									{notification.title || notification.type}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{formatNotificationTime(notification.createdAt)}
								</Typography>
							</Box>
							<Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
								{notification.message}
							</Typography>
						</Box>
					</MenuItem>
				))
			)}
			{notifications.length > 0 && (
				<Box sx={{ p: 1, textAlign: 'center' }}>
					<Button size="small" component={RouterLink} to="/notifications">
						View All
					</Button>
				</Box>
			)}
		</Menu>
	);

	// Add dropdown menus for courses, departments, and categories
	const renderCoursesMenu = (
		<Menu
			anchorEl={coursesAnchorEl}
			open={isCoursesMenuOpen}
			onClose={handleCoursesMenuClose}
			PaperProps={{
				elevation: 3,
				sx: { maxHeight: 400, overflow: 'auto' },
			}}
		>
			{Array.isArray(courses) && courses.length > 0 ? (
				<>
					{courses.map((course) => (
						<MenuItem 
							key={course._id || Math.random()} 
							component={RouterLink} 
							to={`/courses/${course._id}`}
							onClick={handleCoursesMenuClose}
						>
							{course.name}
						</MenuItem>
					))}
					<Divider />
					<MenuItem 
						component={RouterLink} 
						to="/courses" 
						onClick={handleCoursesMenuClose}
						sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
					>
						View All Courses
					</MenuItem>
				</>
			) : (
				<MenuItem disabled>No courses available</MenuItem>
			)}
		</Menu>
	);

	const renderDepartmentsMenu = (
		<Menu
			anchorEl={departmentsAnchorEl}
			open={isDepartmentsMenuOpen}
			onClose={handleDepartmentsMenuClose}
			PaperProps={{
				elevation: 3,
				sx: { maxHeight: 400, overflow: 'auto' },
			}}
		>
			{Array.isArray(departments) && departments.length > 0 ? (
				departments.map((department) => (
					<MenuItem 
						key={department._id || Math.random()} 
						component={RouterLink} 
						to={`/department/${department.name}`}
						onClick={handleDepartmentsMenuClose}
					>
						{department.name}
					</MenuItem>
				))
			) : (
				<MenuItem disabled>No departments available</MenuItem>
			)}
		</Menu>
	);

	const renderCategoriesMenu = (
		<Menu
			anchorEl={categoriesAnchorEl}
			open={isCategoriesMenuOpen}
			onClose={handleCategoriesMenuClose}
			PaperProps={{
				elevation: 3,
				sx: { maxHeight: 400, overflow: 'auto' },
			}}
		>
			{Array.isArray(categories) && categories.length > 0 ? (
				categories.map((category) => (
					<MenuItem 
						key={category._id || Math.random()} 
						component={RouterLink} 
						to={`/categories/${category._id}`}
						onClick={handleCategoriesMenuClose}
					>
						{category.name}
					</MenuItem>
				))
			) : (
				<MenuItem disabled>No categories available</MenuItem>
			)}
		</Menu>
	);

	// Update the drawer to include dropdown menus
	const drawer = (
		<Box sx={{ width: 250 }} role="presentation">
			<Box sx={{ p: 2, textAlign: 'center' }}>
				<LogoText variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: theme.palette.primary.main }}>
					<SchoolIcon sx={{ mr: 1 }} />
					College Portal
				</LogoText>
			</Box>
			<Divider />
			<List>
				<ListItem 
					button 
					component={RouterLink} 
					to="/"
					selected={isActive('/')}
					onClick={toggleDrawer}
				>
					<ListItemText primary="Home" />
				</ListItem>
				<ListItem 
					button 
					component={RouterLink} 
					to="/about"
					selected={isActive('/about')}
					onClick={toggleDrawer}
				>
					<ListItemText primary="About" />
				</ListItem>
				
				{/* Courses Dropdown */}
				<ListItem button onClick={() => toggleMobileMenu('courses')}>
					<ListItemIcon>
						<ClassIcon />
					</ListItemIcon>
					<ListItemText primary="Courses" />
					{mobileMenuOpen.courses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItem>
				<Collapse in={mobileMenuOpen.courses} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{Array.isArray(courses) && courses.length > 0 ? (
							<>
								{courses.slice(0, 5).map((course) => (
									<ListItem 
										button 
										key={course._id || Math.random()} 
										component={RouterLink} 
										to={`/courses/${course._id}`}
										onClick={toggleDrawer}
										sx={{ pl: 4 }}
									>
										<ListItemText primary={course.name} />
									</ListItem>
								))}
								<ListItem 
									button 
									component={RouterLink} 
									to="/courses"
									onClick={toggleDrawer}
									sx={{ pl: 4, color: theme.palette.primary.main }}
								>
									<ListItemText primary="View All Courses" />
								</ListItem>
							</>
						) : (
							<ListItem sx={{ pl: 4 }}>
								<ListItemText primary="No courses available" />
							</ListItem>
						)}
					</List>
				</Collapse>
				
				{/* Departments Dropdown */}
				<ListItem button onClick={() => toggleMobileMenu('departments')}>
					<ListItemIcon>
						<BusinessIcon />
					</ListItemIcon>
					<ListItemText primary="Departments" />
					{mobileMenuOpen.departments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItem>
				<Collapse in={mobileMenuOpen.departments} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{Array.isArray(departments) && departments.length > 0 ? (
							departments.map((department) => (
								<ListItem 
									button 
									key={department._id || Math.random()} 
									component={RouterLink} 
									to={`/departments/${department.name}`}
									onClick={toggleDrawer}
									sx={{ pl: 4 }}
								>
									<ListItemText primary={department.name} />
								</ListItem>
							))
						) : (
							<ListItem sx={{ pl: 4 }}>
								<ListItemText primary="No departments available" />
							</ListItem>
						)}
					</List>
				</Collapse>
				
				{/* Categories Dropdown */}
				<ListItem button onClick={() => toggleMobileMenu('categories')}>
					<ListItemIcon>
						<CategoryIcon />
					</ListItemIcon>
					<ListItemText primary="Categories" />
					{mobileMenuOpen.categories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</ListItem>
				<Collapse in={mobileMenuOpen.categories} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{Array.isArray(categories) && categories.length > 0 ? (
							categories.map((category) => (
								<ListItem 
									button 
									key={category._id || Math.random()} 
									component={RouterLink} 
									to={`/categories/${category._id}`}
									onClick={toggleDrawer}
									sx={{ pl: 4 }}
								>
									<ListItemText primary={category.name} />
								</ListItem>
							))
						) : (
							<ListItem sx={{ pl: 4 }}>
								<ListItemText primary="No categories available" />
							</ListItem>
						)}
					</List>
				</Collapse>
				
				<ListItem 
					button 
					component={RouterLink} 
					to="/gallery"
					selected={isActive('/gallery')}
					onClick={toggleDrawer}
				>
					<ListItemText primary="Gallery" />
				</ListItem>
				<ListItem 
					button 
					component={RouterLink} 
					to="/contact"
					selected={isActive('/contact')}
					onClick={toggleDrawer}
				>
					<ListItemText primary="Contact" />
				</ListItem>
			</List>
			<Divider />
			<List>
				{role ? (
					<>
						<ListItem 
							button 
							component={RouterLink} 
							to={getDashboardLink()}
							selected={isActive(getDashboardLink())}
							onClick={toggleDrawer}
						>
							<ListItemText primary="Dashboard" />
						</ListItem>
						<ListItem button onClick={() => { toggleDrawer(); handleLogout(); }}>
							<ListItemText primary="Logout" />
						</ListItem>
					</>
				) : (
					<>
						<ListItem 
							button 
							component={RouterLink} 
							to="/login"
							selected={isActive('/login')}
							onClick={toggleDrawer}
						>
							<ListItemText primary="Login" />
						</ListItem>
						<ListItem 
							button 
							component={RouterLink} 
							to="/register"
							selected={isActive('/register')}
							onClick={toggleDrawer}
						>
							<ListItemText primary="Register" />
						</ListItem>
					</>
				)}
			</List>
		</Box>
	);

	return (
		<>
			<StyledAppBar position="fixed" scrolled={scrolled ? 1 : 0}>
				<Container maxWidth="xl">
					<StyledToolbar disableGutters>
						{/* Logo for desktop */}
						<LogoText
							variant="h6"
							component={RouterLink}
							to="/"
							scrolled={scrolled ? 1 : 0}
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'monospace',
								textDecoration: 'none',
							}}
						>
							<SchoolIcon />
							COLLEGE
						</LogoText>

						{/* Mobile menu icon */}
						<Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
							<IconButton
								size="large"
								aria-label="menu"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={() => setDrawerOpen(true)}
								color={scrolled ? "inherit" : "default"}
							>
								<MenuIcon />
							</IconButton>
						</Box>

						{/* Logo for mobile */}
						<LogoText
							variant="h6"
							component={RouterLink}
							to="/"
							scrolled={scrolled ? 1 : 0}
							sx={{
								flexGrow: 1,
								display: { xs: 'flex', md: 'none' },
								fontFamily: 'monospace',
								textDecoration: 'none',
							}}
						>
							<SchoolIcon />
							COLLEGE
						</LogoText>

						{/* Desktop navigation - centered */}
						<Box sx={{ 
							flexGrow: 1, 
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center' 
						}}>
							{/* Navigation links */}
							<NavButton component={RouterLink} to="/" scrolled={scrolled ? 1 : 0}>
								Home
							</NavButton>
							<NavButton component={RouterLink} to="/about" scrolled={scrolled ? 1 : 0}>
								About
							</NavButton>
							
							{/* Courses Dropdown */}
							<NavButton 
								scrolled={scrolled ? 1 : 0}
								onClick={handleCoursesMenuOpen}
								endIcon={<ExpandMoreIcon />}
							>
								Courses
							</NavButton>
							
							{/* Departments Dropdown */}
							<NavButton 
								scrolled={scrolled ? 1 : 0}
								onClick={handleDepartmentsMenuOpen}
								endIcon={<ExpandMoreIcon />}
							>
								Departments
							</NavButton>
							
							{/* Categories Dropdown */}
							<NavButton 
								scrolled={scrolled ? 1 : 0}
								onClick={handleCategoriesMenuOpen}
								endIcon={<ExpandMoreIcon />}
							>
								Categories
							</NavButton>
							
							<NavButton component={RouterLink} to="/gallery" scrolled={scrolled ? 1 : 0}>
								Gallery
							</NavButton>
							<NavButton component={RouterLink} to="/contact" scrolled={scrolled ? 1 : 0}>
								Contact
							</NavButton>
						</Box>

						{/* Right side icons */}
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							{/* Notifications icon - only show if logged in */}
							{(role || localRole) && (
								<Tooltip title="Notifications">
									<IconButton
										color={scrolled ? "inherit" : "default"}
										onClick={handleNotificationMenuOpen}
									>
										<Badge badgeContent={notifications.length} color="error">
											<NotificationsIcon />
										</Badge>
									</IconButton>
								</Tooltip>
							)}

							{/* Profile icon or login button */}
							{(role || localRole) ? (
								<Tooltip title="Account">
									<IconButton
										onClick={handleProfileMenuOpen}
										color={scrolled ? "inherit" : "default"}
									>
										<AccountCircleIcon />
									</IconButton>
								</Tooltip>
							) : (
								<NavButton
									component={RouterLink}
									to="/login"
									scrolled={scrolled ? 1 : 0}
									variant="outlined"
								>
									Login
								</NavButton>
							)}
						</Box>
					</StyledToolbar>
				</Container>
			</StyledAppBar>

			{/* Mobile Drawer */}
			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={toggleDrawer}
			>
				{drawer}
			</Drawer>
			
			{renderProfileMenu}
			{renderNotificationMenu}
			{renderCoursesMenu}
			{renderDepartmentsMenu}
			{renderCategoriesMenu}
			
			{/* Placeholder to prevent content jump */}
			<NavbarPlaceholder />
		</>
	);
};

export default Navbar;
