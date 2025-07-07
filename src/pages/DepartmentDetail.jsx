import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Box,
	Grid,
	Paper,
	Button,
	Chip,
	Divider,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Breadcrumbs,
	Link as MuiLink,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Avatar,
	Tab,
	Tabs,
	CardActions,
	useTheme,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import api from "../services/api";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import { showErrorToast } from "../utils/toast";
import ParticlesBackground from "../components/ParticlesBackground";

// Motion components
const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

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
const DepartmentBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/banner22.jpg')`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	padding: theme.spacing(10, 0),
	color: "#fff",
	marginBottom: theme.spacing(4),
	position: "relative",
	overflow: "hidden",
}));

const FacultyCard = styled(motion(Card))(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[8],
	},
}));

const CourseCard = styled(motion(Card))(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[8],
	},
}));

const FacultyAvatar = styled(Avatar)(({ theme }) => ({
	width: 100,
	height: 100,
	margin: "0 auto",
	border: `4px solid ${theme.palette.background.paper}`,
	boxShadow: theme.shadows[3],
}));

const StyledTab = styled(Tab)(({ theme }) => ({
	fontWeight: 600,
	fontSize: "1rem",
	textTransform: "none",
	padding: theme.spacing(2),
}));

const DepartmentDetail = () => {
	const { name } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const [department, setDepartment] = useState(null);
	const [loading, setLoading] = useState(true);
	const [departmentCourses, setDepartmentCourses] = useState([]);
	const [departmentFaculty, setDepartmentFaculty] = useState([]);
	const [tabValue, setTabValue] = useState(0);

	// Animation refs
	const [headerRef, headerInView] = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});
	
	const [overviewRef, overviewInView] = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});
	
	const [tabsRef, tabsInView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});
	
	const [ctaRef, ctaInView] = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});

	useEffect(() => {
		const fetchDepartmentDetails = async () => {
			try {
				setLoading(true);
				console.log("Fetching department details for:", name);

				// Fetch department details
				const response = await api.public.getDepartmentByName(name);
				console.log("Department API response:", response);

				// Handle different response structures
				if (response.success && response.data) {
					// Extract data from the nested response structure
					const { department, courses, faculty } = response.data;
					
					console.log("Department:", department);
					console.log("Courses:", courses);
					console.log("Faculty:", faculty);
					
					setDepartment(department);
					setDepartmentCourses(courses || []);
					setDepartmentFaculty(faculty || []);
				} else {
					// Handle legacy or simpler response structure
					setDepartment(response);
					
					// Fetch courses for this department separately
					try {
						const coursesResponse = await api.public.getCourses();
						const coursesData = coursesResponse.data || coursesResponse || [];
						
						// Filter courses by department
						const filteredCourses = coursesData.filter(
							course => course.departmentId && 
							(course.departmentId._id === response._id || 
							course.departmentId.name === response.name)
						);
						
						setDepartmentCourses(filteredCourses);
					} catch (error) {
						console.error("Error fetching courses:", error);
					}
					
					// Fetch faculty for this department separately
					try {
						const facultyResponse = await api.public.getFaculty();
						const facultyData = facultyResponse.data || facultyResponse || [];
						
						// Filter faculty by department
						const filteredFaculty = facultyData.filter(
							faculty => faculty.department === response.name
						);
						
						setDepartmentFaculty(filteredFaculty);
					} catch (error) {
						console.error("Error fetching faculty:", error);
					}
				}
			} catch (error) {
				console.error("Error fetching department details:", error);
				showErrorToast("Failed to load department details");
			} finally {
				setLoading(false);
			}
		};

		if (name) {
			fetchDepartmentDetails();
		}
	}, [name]);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}>
				<CircularProgress size={60} thickness={4} />
			</Box>
		);
	}

	if (!department) {
		return (
			<Container sx={{ py: 8 }}>
				<Typography variant='h5' color='error' align='center'>
					Department not found
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
					<Button
						variant='contained'
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate("/")}>
						Back to Home
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Box sx={{ position: "relative", overflow: "hidden" }}>
			{/* Particles Background */}
			<Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0, opacity: 0.6 }}>
				<ParticlesBackground />
			</Box>

			{/* Department Banner */}
			<DepartmentBanner>
				<MotionContainer
					ref={headerRef}
					initial="hidden"
					animate={headerInView ? "visible" : "hidden"}
					variants={fadeIn}>
					<Box sx={{ position: "relative", zIndex: 2 }}>
						<Chip
							label='Department'
							color='primary'
							size='small'
							icon={<SchoolIcon />}
							sx={{ mb: 2 }}
						/>
						<MotionTypography
							variant='h2'
							component='h1'
							gutterBottom
							fontWeight='bold'
							variants={fadeInUp}>
							{department.name}
						</MotionTypography>
						<MotionTypography
							variant='h6'
							sx={{ maxWidth: 800, mb: 4, opacity: 0.9 }}
							variants={fadeInUp}>
							Excellence in Education and Research
						</MotionTypography>
						<MotionBox variants={fadeInUp}>
							<Button
								variant='contained'
								color='primary'
								size='large'
								component={Link}
								to='/contact'
								sx={{ 
									mr: 2, 
									px: 4, 
									py: 1.5, 
									borderRadius: 2,
									fontWeight: "bold",
									boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
								}}>
								Contact Us
							</Button>
							<Button
								variant='outlined'
								color='inherit'
								size='large'
								component={Link}
								to='/courses'
								sx={{ 
									borderColor: "white", 
									color: "white",
									px: 4, 
									py: 1.5, 
									borderRadius: 2,
									fontWeight: "bold",
									"&:hover": {
										borderColor: "white",
										bgcolor: "rgba(255,255,255,0.1)",
									},
								}}>
								Explore Courses
							</Button>
						</MotionBox>
					</Box>
				</MotionContainer>
			</DepartmentBanner>

			<MotionContainer maxWidth='lg' sx={{ mb: 8, position: "relative", zIndex: 1 }}>
				{/* Breadcrumbs */}
				<Breadcrumbs
					separator={<NavigateNextIcon fontSize='small' />}
					aria-label='breadcrumb'
					sx={{ mb: 4 }}>
					<MuiLink component={Link} to='/' color='inherit'>
						Home
					</MuiLink>
					<MuiLink component={Link} to='/' color='inherit'>
						Departments
					</MuiLink>
					<Typography color='text.primary'>{department.name}</Typography>
				</Breadcrumbs>

				{/* Department Overview */}
				<MotionPaper 
					elevation={3} 
					sx={{ 
						p: 4, 
						mb: 4, 
						borderRadius: 2,
						background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
						boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
					}}
					ref={overviewRef}
					initial="hidden"
					animate={overviewInView ? "visible" : "hidden"}
					variants={fadeInUp}>
					<MotionTypography
						variant='h4'
						component='h2'
						gutterBottom
						color='primary'
						fontWeight='bold'
						variants={fadeIn}>
						Department Overview
					</MotionTypography>
					<Divider sx={{ mb: 3 }} />
					<MotionTypography variant='body1' paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }} variants={fadeIn}>
						{department.description ||
							`The ${
								department.name
							} department is committed to excellence in teaching, research, and service. 
              Our faculty members are leaders in their fields, dedicated to providing students with a comprehensive 
              education that prepares them for successful careers in the rapidly evolving landscape of ${department?.name?.toLowerCase()}.
              
              We offer a range of undergraduate and graduate programs designed to meet the needs of today's students 
              and tomorrow's professionals. Our curriculum combines theoretical knowledge with practical skills, 
              ensuring that our graduates are well-prepared for the challenges they will face in their careers.`}
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
									{departmentCourses.length}
								</Typography>
								<Typography variant='body1'>Courses Offered</Typography>
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
								<PersonIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									{departmentFaculty.length}
								</Typography>
								<Typography variant='body1'>Faculty Members</Typography>
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
								<StarIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									15+
								</Typography>
								<Typography variant='body1'>Years of Excellence</Typography>
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
								<WorkIcon color='primary' sx={{ fontSize: 50, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold' color='primary'>
									95%
								</Typography>
								<Typography variant='body1'>Placement Rate</Typography>
							</Box>
						</MotionGrid>
					</MotionGrid>
				</MotionPaper>

				{/* Tabs Section */}
				<MotionPaper 
					elevation={3} 
					sx={{ 
						borderRadius: 2, 
						overflow: "hidden",
						boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
					}}
					ref={tabsRef}
					initial="hidden"
					animate={tabsInView ? "visible" : "hidden"}
					variants={fadeInUp}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						variant='fullWidth'
						sx={{
							borderBottom: 1,
							borderColor: "divider",
							bgcolor: "background.paper",
						}}>
						<StyledTab
							label='Courses'
							icon={<MenuBookIcon />}
							iconPosition='start'
						/>
						<StyledTab
							label='Faculty'
							icon={<PersonIcon />}
							iconPosition='start'
						/>
						<StyledTab
							label='Facilities'
							icon={<SchoolIcon />}
							iconPosition='start'
						/>
					</Tabs>

					{/* Courses Tab */}
					<Box hidden={tabValue !== 0} sx={{ p: 4 }}>
						<Typography variant='h5' gutterBottom fontWeight='bold'>
							Courses Offered
						</Typography>
						<Typography variant='body1' paragraph>
							The {department.name} department offers a diverse range of courses
							designed to provide students with comprehensive knowledge and
							practical skills.
						</Typography>

						{departmentCourses.length > 0 ? (
							<MotionGrid 
								container 
								spacing={3} 
								sx={{ mt: 2 }}
								variants={staggerContainer}
								initial="hidden"
								animate="visible">
								{departmentCourses.map((course) => (
									<MotionGrid item xs={12} sm={6} md={4} key={course._id} variants={staggerItem}>
										<CourseCard>
											<CardMedia
												component='img'
												height='160'
												image={
													course.thumbnailUrl ||
													course.fileUrl ||
													`/images/courses${
														Math.floor(Math.random() * 4) + 1
													}.jpg`
												}
												alt={course.name}
											/>
											<CardContent sx={{ flexGrow: 1 }}>
												<Typography variant='h6' component='h3' gutterBottom>
													{course.name}
												</Typography>
												<Chip
													label={course.categoryId?.name || "Uncategorized"}
													size='small'
													color='primary'
													variant='outlined'
													sx={{ mb: 2 }}
												/>
												<Divider sx={{ my: 1.5 }} />
												<Grid container spacing={1}>
													<Grid item xs={6}>
														<Typography variant='body2' color='text.secondary'>
															Registration Fee:
														</Typography>
														<Typography variant='body2' fontWeight='bold'>
															₹
															{course.feeStructure?.registrationFee?.toLocaleString() ||
																"0"}
														</Typography>
													</Grid>
													<Grid item xs={6}>
														<Typography variant='body2' color='text.secondary'>
															Full Fee:
														</Typography>
														<Typography variant='body2' fontWeight='bold'>
															₹
															{course.feeStructure?.fullFee?.toLocaleString() ||
																"0"}
														</Typography>
													</Grid>
												</Grid>
											</CardContent>
											<CardActions sx={{ p: 2, pt: 0 }}>
												<Button
													variant='contained'
													fullWidth
													component={Link}
													to={`/courses/${course._id}`}>
													View Details
												</Button>
											</CardActions>
										</CourseCard>
									</MotionGrid>
								))}
							</MotionGrid>
						) : (
							<Box sx={{ textAlign: "center", py: 4 }}>
								<Typography variant='body1' color='text.secondary'>
									No courses found for this department.
								</Typography>
							</Box>
						)}
					</Box>

					{/* Faculty Tab */}
					<Box hidden={tabValue !== 1} sx={{ p: 4 }}>
						<Typography variant='h5' gutterBottom fontWeight='bold'>
							Our Faculty
						</Typography>
						<Typography variant='body1' paragraph>
							Meet our distinguished faculty members who are experts in their
							fields and dedicated to providing quality education.
						</Typography>

						{departmentFaculty.length > 0 ? (
							<MotionGrid 
								container 
								spacing={4} 
								sx={{ mt: 2 }}
								variants={staggerContainer}
								initial="hidden"
								animate="visible">
								{departmentFaculty.map((faculty) => (
									<MotionGrid item xs={12} sm={6} md={4} key={faculty._id} variants={staggerItem}>
										<FacultyCard>
											<Box sx={{ position: "relative", pt: 5 }}>
												<FacultyAvatar
													src={
														faculty.profilePic ||
														`/images/team/${
															Math.floor(Math.random() * 4) + 1
														}.jpg`
													}
													alt={faculty.name}
												/>
											</Box>
											<CardContent sx={{ textAlign: "center", pt: 2 }}>
												<Typography variant='h6' component='h3' gutterBottom>
													{faculty.name}
												</Typography>
												<Typography
													variant='subtitle1'
													color='primary'
													gutterBottom>
													{faculty.designation || "Professor"}
												</Typography>
												<Divider sx={{ my: 2 }} />
												<Typography variant='body2' paragraph>
													{faculty.bio ||
														`Experienced educator with expertise in ${department.name.toLowerCase()} and related fields.`}
												</Typography>
												<Box
													sx={{
														display: "flex",
														justifyContent: "center",
														gap: 1,
														flexWrap: "wrap",
													}}>
													{faculty.email && (
														<Chip
															icon={<EmailIcon />}
															label={faculty.email}
															size='small'
															variant='outlined'
														/>
													)}
													{faculty.phone && (
														<Chip
															icon={<PhoneIcon />}
															label={faculty.phone}
															size='small'
															variant='outlined'
														/>
													)}
												</Box>
											</CardContent>
										</FacultyCard>
									</MotionGrid>
								))}
							</MotionGrid>
						) : (
							<Box sx={{ textAlign: "center", py: 4 }}>
								<Typography variant='body1' color='text.secondary'>
									No faculty information available for this department.
								</Typography>
							</Box>
						)}
					</Box>

					{/* Facilities Tab */}
					<Box hidden={tabValue !== 2} sx={{ p: 4 }}>
						<Typography variant='h5' gutterBottom fontWeight='bold'>
							Department Facilities
						</Typography>
						<Typography variant='body1' paragraph>
							Our department is equipped with state-of-the-art facilities to
							support teaching, learning, and research.
						</Typography>

						<MotionGrid 
							container 
							spacing={4} 
							sx={{ mt: 2 }}
							variants={staggerContainer}
							initial="hidden"
							animate="visible">
							<MotionGrid item xs={12} md={6} variants={staggerItem}>
								<Card sx={{ 
									height: '100%',
									boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
									borderRadius: 2,
									overflow: "hidden",
									transition: "transform 0.3s ease",
									"&:hover": {
										transform: "translateY(-8px)",
									}
								}}>
									<CardMedia
										component='img'
										height='240'
										image='/images/a2.jpg'
										alt='Department Facilities'
									/>
									<CardContent>
										<Typography variant='h6' gutterBottom>
											Modern Classrooms
										</Typography>
										<Typography variant='body2'>
											Our classrooms are equipped with the latest technology to
											facilitate interactive learning experiences. Smart boards,
											projectors, and high-speed internet access ensure that
											students have access to the resources they need.
										</Typography>
									</CardContent>
								</Card>
							</MotionGrid>
							<MotionGrid item xs={12} md={6} variants={staggerItem}>
								<Card sx={{ 
									height: '100%',
									boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
									borderRadius: 2,
									overflow: "hidden",
									transition: "transform 0.3s ease",
									"&:hover": {
										transform: "translateY(-8px)",
									}
								}}>
									<CardMedia
										component='img'
										height='240'
										image='/images/a3.jpg'
										alt='Research Laboratories'
									/>
									<CardContent>
										<Typography variant='h6' gutterBottom>
											Research Laboratories
										</Typography>
										<Typography variant='body2'>
											Our department houses specialized laboratories that
											support cutting-edge research in various areas. These
											facilities are available to both faculty and students,
											encouraging collaborative research projects.
										</Typography>
									</CardContent>
								</Card>
							</MotionGrid>
							<MotionGrid item xs={12} variants={staggerItem}>
								<Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
									<Typography variant='h6' gutterBottom>
										Additional Facilities
									</Typography>
									<List>
										<ListItem>
											<ListItemIcon>
												<CheckCircleIcon color='primary' />
											</ListItemIcon>
											<ListItemText
												primary='Departmental Library'
												secondary='Access to specialized books, journals, and digital resources'
											/>
										</ListItem>
										<ListItem>
											<ListItemIcon>
												<CheckCircleIcon color='primary' />
											</ListItemIcon>
											<ListItemText
												primary='Computer Labs'
												secondary='Well-equipped computer laboratories with the latest software and hardware'
											/>
										</ListItem>
										<ListItem>
											<ListItemIcon>
												<CheckCircleIcon color='primary' />
											</ListItemIcon>
											<ListItemText
												primary='Seminar Halls'
												secondary='Spaces for academic discussions, guest lectures, and student presentations'
											/>
										</ListItem>
										<ListItem>
											<ListItemIcon>
												<CheckCircleIcon color='primary' />
											</ListItemIcon>
											<ListItemText
												primary='Student Lounges'
												secondary='Comfortable spaces for students to relax, collaborate, and study'
											/>
										</ListItem>
									</List>
								</Paper>
							</MotionGrid>
						</MotionGrid>
					</Box>
				</MotionPaper>

				{/* Call to Action */}
				<MotionPaper
					elevation={3}
					sx={{
						p: 4,
						mt: 4,
						borderRadius: 2,
						background: "linear-gradient(to right, #8e2de2, #4a00e0)",
						color: "white",
						textAlign: "center",
						boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
					}}
					ref={ctaRef}
					initial="hidden"
					animate={ctaInView ? "visible" : "hidden"}
					variants={fadeInUp}>
					<MotionTypography variant='h5' gutterBottom fontWeight='bold' variants={fadeIn}>
						Ready to Join the {department.name} Department?
					</MotionTypography>
					<MotionTypography
						variant='body1'
						paragraph
						sx={{ maxWidth: 800, mx: "auto", mb: 3 }}
						variants={fadeIn}>
						Take the first step towards a rewarding career in{" "}
						{department?.name?.toLowerCase()}. Apply now to join our vibrant
						academic community.
					</MotionTypography>
					<MotionBox variants={fadeIn}>
						<Button
							variant='contained'
							color='secondary'
							size='large'
							component={Link}
							to='/register'
							sx={{ 
								mr: 2, 
								px: 4, 
								py: 1.5, 
								borderRadius: 2,
								fontWeight: "bold",
								boxShadow: "0 4px 14px 0 rgba(255,255,255,0.3)",
							}}>
							Apply Now
						</Button>
						<Button
							variant='outlined'
							color='inherit'
							component={Link}
							to='/contact'
							sx={{ 
								borderColor: "white", 
								color: "white",
								px: 4, 
								py: 1.5, 
								borderRadius: 2,
								fontWeight: "bold",
								"&:hover": {
									borderColor: "white",
									bgcolor: "rgba(255,255,255,0.1)",
								},
							}}>
							Contact Us
						</Button>
					</MotionBox>
				</MotionPaper>
			</MotionContainer>
		</Box>
	);
};

export default DepartmentDetail;
