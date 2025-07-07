// src/pages/CourseDetail.js
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
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardContent,
	CircularProgress,
	Breadcrumbs,
	Link as MuiLink,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import api from "../services/api";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import PaymentIcon from "@mui/icons-material/Payment";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import ParticlesBackground from "../components/ParticlesBackground";
import { showErrorToast } from "../utils/toast";

const MotionContainer = motion(Container);
const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const CourseDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);
	const [relatedCourses, setRelatedCourses] = useState([]);

	// Animation refs
	const [headerRef, headerInView] = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});
	const [mainContentRef, mainContentInView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});
	const [sidebarRef, sidebarInView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
		delay: 300,
	});

	// Animation variants
	const fadeInUp = {
		hidden: { opacity: 0, y: 60 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.8 } },
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

	useEffect(() => {
		const fetchCourseDetails = async () => {
			try {
				setLoading(true);
				const response = await api.public.getCourseById(id);
				
				// Extract course data from response
				const courseData = response.data || response;
				console.log("Course data fetched:", courseData);
				
				setCourse(courseData);

				// Fetch related courses from the same department
				if (courseData && courseData.departmentId) {
					const coursesResponse = await api.public.getCourses();
					
					// Extract courses data from response
					const allCourses = coursesResponse.data || coursesResponse || [];
					console.log("All courses fetched:", allCourses);
					
					const related = allCourses
						.filter(
							(c) =>
								c.departmentId &&
								c.departmentId._id === courseData.departmentId._id &&
								c._id !== courseData._id
						)
						.slice(0, 3);
					setRelatedCourses(related);
				}
			} catch (error) {
				console.error("Error fetching course details:", error);
				showErrorToast("Failed to load course details");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchCourseDetails();
		}
	}, [id]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}

	if (!course) {
		return (
			<Container sx={{ py: 8 }}>
				<Typography variant='h5' color='error' align='center'>
					Course not found
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
					<Button
						variant='contained'
						startIcon={<ArrowBackIcon />}
						onClick={() => navigate("/courses")}>
						Back to Courses
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Box sx={{ position: "relative", overflow: "hidden", pb: 8 }}>
			{/* Particles Background */}
			<Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", zIndex: 0 }}>
				<ParticlesBackground />
			</Box>

			{/* Hero Section */}
			<Box
				sx={{
					position: "relative",
					bgcolor: "rgba(0, 0, 0, 0.7)",
					color: "white",
					pt: { xs: 10, md: 15 },
					pb: { xs: 6, md: 8 },
					mb: 6,
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/banner22.jpg')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}>
				<MotionContainer
					ref={headerRef}
					initial="hidden"
					animate={headerInView ? "visible" : "hidden"}
					variants={fadeIn}
					maxWidth="lg">
					<Breadcrumbs
						separator={<NavigateNextIcon fontSize='small' sx={{ color: "white" }} />}
						aria-label='breadcrumb'
						sx={{ mb: 3, color: "white", "& .MuiLink-root": { color: "white" } }}>
						<MuiLink component={Link} to='/' color='inherit'>
							Home
						</MuiLink>
						<MuiLink component={Link} to='/courses' color='inherit'>
							Courses
						</MuiLink>
						<Typography color="white">{course.name}</Typography>
					</Breadcrumbs>

					<MotionTypography
						variant='h2'
						component='h1'
						gutterBottom
						sx={{
							fontWeight: 700,
							fontSize: { xs: "2.5rem", md: "3.5rem" },
							textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
						}}
						variants={fadeInUp}>
						{course.name}
					</MotionTypography>

					<MotionTypography 
						variant='h5' 
						sx={{ mb: 4, opacity: 0.9 }}
						variants={fadeInUp}>
						{course.departmentId?.name || "Department not specified"}
					</MotionTypography>

					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
						<MotionGrid container spacing={3} variants={staggerContainer}>
							{course.duration && (
								<MotionGrid item xs={12} sm={4} variants={staggerItem}>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CalendarTodayIcon sx={{ mr: 1 }} />
										<Typography>
											Duration: {course.duration || "2 Years"}
										</Typography>
									</Box>
								</MotionGrid>
							)}
							<MotionGrid item xs={12} sm={4} variants={staggerItem}>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<AccessTimeIcon sx={{ mr: 1 }} />
									<Typography>
										{course.schedule || "Full-time"}
									</Typography>
								</Box>
							</MotionGrid>
							<MotionGrid item xs={12} sm={4} variants={staggerItem}>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<GroupIcon sx={{ mr: 1 }} />
									<Typography>
										{course.seats || "60"} Seats
									</Typography>
								</Box>
							</MotionGrid>
						</MotionGrid>
					</Box>

					<MotionGrid 
						container 
						spacing={2}
						variants={fadeInUp}>
						<Grid item>
							{course.formUrl ? (
								<Button
									variant='contained'
									color='primary'
									size='large'
									href={course.formUrl}
									target='_blank'
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: "bold",
										fontSize: "1.1rem",
										boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
									}}>
									Apply Now
								</Button>
							) : (
								<Button
									variant='contained'
									color='primary'
									size='large'
									component={Link}
									to='/register'
									sx={{
										px: 4,
										py: 1.5,
										borderRadius: 2,
										fontWeight: "bold",
										fontSize: "1.1rem",
										boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
									}}>
									Apply for Admission
								</Button>
							)}
						</Grid>
						<Grid item>
							<Button
								variant='outlined'
								color='inherit'
								size='large'
								component={Link}
								to='/courses'
								sx={{
									px: 4,
									py: 1.5,
									borderRadius: 2,
									fontWeight: "bold",
									fontSize: "1.1rem",
									borderColor: "white",
									"&:hover": {
										borderColor: "white",
										bgcolor: "rgba(255,255,255,0.1)",
									},
								}}>
								View All Courses
							</Button>
						</Grid>
					</MotionGrid>
				</MotionContainer>
			</Box>

			<MotionContainer maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
				<Grid container spacing={4}>
					{/* Main Content */}
					<MotionGrid 
						item 
						xs={12} 
						md={8}
						ref={mainContentRef}
						initial="hidden"
						animate={mainContentInView ? "visible" : "hidden"}
						variants={fadeInUp}>
						<MotionPaper
							elevation={3}
							sx={{
								p: 4,
								borderRadius: 2,
								background: "linear-gradient(145deg, #ffffff, #f5f7fa)",
								boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
							}}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<Chip
									label={course.categoryId?.name || "Uncategorized"}
									color='primary'
									size='medium'
									icon={<CategoryIcon />}
									sx={{ fontWeight: 500 }}
								/>
							</Box>

							<Typography
								variant='h4'
								component='h2'
								gutterBottom
								sx={{
									color: theme.palette.primary.main,
									fontWeight: 700,
									mb: 3,
								}}>
								Course Overview
							</Typography>

							<Typography variant='body1' paragraph sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.7 }}>
								{course.description ||
									"This comprehensive course is designed to provide students with in-depth knowledge and practical skills in the field. Through a combination of theoretical learning and hands-on experience, students will develop expertise that prepares them for successful careers."}
							</Typography>

							<Typography variant='h5' gutterBottom sx={{ fontWeight: 600, mt: 5, mb: 3 }}>
								Key Features
							</Typography>

							<MotionGrid 
								container 
								spacing={2}
								variants={staggerContainer}
								initial="hidden"
								animate="visible">
								<MotionGrid item xs={12} sm={6} variants={staggerItem}>
									<Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
										<CardContent>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
												<Box sx={{ 
													bgcolor: theme.palette.primary.main, 
													color: 'white',
													width: 40,
													height: 40,
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													mr: 2
												}}>
													<CheckCircleIcon />
												</Box>
												<Typography variant="h6">Expert Faculty</Typography>
											</Box>
											<Typography variant="body2" color="text.secondary">
												Learn from industry experts with years of practical experience
											</Typography>
										</CardContent>
									</Card>
								</MotionGrid>
								
								<MotionGrid item xs={12} sm={6} variants={staggerItem}>
									<Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
										<CardContent>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
												<Box sx={{ 
													bgcolor: theme.palette.primary.main, 
													color: 'white',
													width: 40,
													height: 40,
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													mr: 2
												}}>
													<CheckCircleIcon />
												</Box>
												<Typography variant="h6">Modern Facilities</Typography>
											</Box>
											<Typography variant="body2" color="text.secondary">
												Access to state-of-the-art facilities and resources
											</Typography>
										</CardContent>
									</Card>
								</MotionGrid>
								
								<MotionGrid item xs={12} sm={6} variants={staggerItem}>
									<Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
										<CardContent>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
												<Box sx={{ 
													bgcolor: theme.palette.primary.main, 
													color: 'white',
													width: 40,
													height: 40,
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													mr: 2
												}}>
													<CheckCircleIcon />
												</Box>
												<Typography variant="h6">Practical Training</Typography>
											</Box>
											<Typography variant="body2" color="text.secondary">
												Hands-on experience through internships and projects
											</Typography>
										</CardContent>
									</Card>
								</MotionGrid>
								
								<MotionGrid item xs={12} sm={6} variants={staggerItem}>
									<Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
										<CardContent>
											<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
												<Box sx={{ 
													bgcolor: theme.palette.primary.main, 
													color: 'white',
													width: 40,
													height: 40,
													borderRadius: '50%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													mr: 2
												}}>
													<CheckCircleIcon />
												</Box>
												<Typography variant="h6">Industry Curriculum</Typography>
											</Box>
											<Typography variant="body2" color="text.secondary">
												Curriculum designed with industry requirements in mind
											</Typography>
										</CardContent>
									</Card>
								</MotionGrid>
							</MotionGrid>

							{course.syllabus && (
								<Box sx={{ mt: 5 }}>
									<Typography variant='h5' gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
										Course Syllabus
									</Typography>
									<Typography variant='body1'>
										{course.syllabus}
									</Typography>
								</Box>
							)}

							<Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
								{course.formUrl ? (
									<Button
										variant='contained'
										color='primary'
										size='large'
										href={course.formUrl}
										target='_blank'
										sx={{
											px: 4,
											py: 1.5,
											borderRadius: 2,
											fontWeight: "bold",
											fontSize: "1.1rem",
											boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
										}}>
										Apply Now
									</Button>
								) : (
									<Button
										variant='contained'
										color='primary'
										size='large'
										component={Link}
										to='/register'
										sx={{
											px: 4,
											py: 1.5,
											borderRadius: 2,
											fontWeight: "bold",
											fontSize: "1.1rem",
											boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
										}}>
										Apply for Admission
									</Button>
								)}
							</Box>
						</MotionPaper>
					</MotionGrid>

					{/* Sidebar */}
					<MotionGrid 
						item 
						xs={12} 
						md={4}
						ref={sidebarRef}
						initial="hidden"
						animate={sidebarInView ? "visible" : "hidden"}
						variants={staggerContainer}>
						{/* Fee Structure Card */}
						<MotionCard 
							elevation={3} 
							sx={{ 
								mb: 4, 
								borderRadius: 2,
								boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
								overflow: "hidden",
							}}
							variants={staggerItem}>
							<Box sx={{ 
								bgcolor: theme.palette.primary.main, 
								color: "white", 
								py: 2, 
								px: 3 
							}}>
								<Typography
									variant='h6'
									sx={{
										display: "flex",
										alignItems: "center",
										fontWeight: 600,
									}}>
									<PaymentIcon sx={{ mr: 1 }} />
									Fee Structure
								</Typography>
							</Box>
							<CardContent sx={{ px: 3, py: 3 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mb: 2,
										pb: 2,
										borderBottom: "1px solid #eee",
									}}>
									<Typography variant='body1'>Registration Fee:</Typography>
									<Typography variant='body1' fontWeight='bold'>
										₹
										{course.feeStructure?.registrationFee?.toLocaleString() ||
											"0"}
									</Typography>
								</Box>

								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Typography variant='body1'>Full Course Fee:</Typography>
									<Typography variant='body1' fontWeight='bold'>
										₹{course.feeStructure?.fullFee?.toLocaleString() || "0"}
									</Typography>
								</Box>

								<Typography
									variant='caption'
									color='text.secondary'
									sx={{ display: "block", mt: 3, fontStyle: "italic" }}>
									* Fees are subject to change. Scholarships available for
									eligible students.
								</Typography>
							</CardContent>
						</MotionCard>

						{/* Department Info Card */}
						<MotionCard 
							elevation={3} 
							sx={{ 
								mb: 4, 
								borderRadius: 2,
								boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
								overflow: "hidden",
							}}
							variants={staggerItem}>
							<Box sx={{ 
								bgcolor: theme.palette.primary.main, 
								color: "white", 
								py: 2, 
								px: 3 
							}}>
								<Typography
									variant='h6'
									sx={{
										display: "flex",
										alignItems: "center",
										fontWeight: 600,
									}}>
									<SchoolIcon sx={{ mr: 1 }} />
									Department
								</Typography>
							</Box>
							<CardContent sx={{ px: 3, py: 3 }}>
								<Typography variant='body1' paragraph>
									{course.departmentId?.name ||
										"Department information not available"}
								</Typography>

								<Button
									variant='outlined'
									size='small'
									component={Link}
									to={`/department/${course.departmentId?.name || ""}`}
									sx={{ mt: 1 }}
									disabled={!course.departmentId}>
									View Department
								</Button>
							</CardContent>
						</MotionCard>

						{/* Related Courses */}
						{relatedCourses.length > 0 && (
							<MotionCard 
								elevation={3} 
								sx={{ 
									borderRadius: 2,
									boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
									overflow: "hidden",
								}}
								variants={staggerItem}>
								<Box sx={{ 
									bgcolor: theme.palette.primary.main, 
									color: "white", 
									py: 2, 
									px: 3 
								}}>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 600,
										}}>
										Related Courses
									</Typography>
								</Box>
								<CardContent sx={{ px: 3, py: 3 }}>
									<List disablePadding>
										{relatedCourses.map((relatedCourse) => (
											<ListItem
												key={relatedCourse._id}
												component={Link}
												to={`/courses/${relatedCourse._id}`}
												sx={{
													px: 0,
													py: 1.5,
													textDecoration: "none",
													color: "inherit",
													borderBottom: "1px solid #eee",
													"&:hover": {
														backgroundColor: "rgba(0, 0, 0, 0.04)",
													},
												}}>
												<ListItemText
													primary={relatedCourse.name}
													secondary={
														relatedCourse.categoryId?.name || "Uncategorized"
													}
												/>
											</ListItem>
										))}
									</List>

									<Button
										variant='text'
										component={Link}
										to='/courses'
										sx={{ mt: 3 }}
										fullWidth>
										View All Courses
									</Button>
								</CardContent>
							</MotionCard>
						)}
					</MotionGrid>
				</Grid>
			</MotionContainer>
		</Box>
	);
};

export default CourseDetail;
