import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	Button,
	Card,
	CardContent,
	CardMedia,
	Avatar,
	Chip,
	CircularProgress,
	Rating,
	Divider,
	TextField,
	IconButton,
	Paper,
	Tabs,
	Tab,
	useTheme,
	useMediaQuery,
	Skeleton,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";
import ModernHero from "../components/ModernHero";
import SchoolIcon from "@mui/icons-material/School";
import AboutUniversitySection from "../components/AboutUniversitySection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import PopularCoursesSection from "../components/PopularCoursesSection";
import StatsCounterSection from "../components/StatsCounterSection";
import NewsEventsSection from "../components/NewsEventsSection";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Styled components for other sections (not the hero section)
const StatBox = styled(Box)(({ theme }) => ({
	textAlign: "center",
	padding: theme.spacing(3),
	backgroundColor: "#fff",
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
	transition: "transform 0.3s",
	"&:hover": {
		transform: "translateY(-5px)",
	},
}));

const StatIcon = styled(Box)(({ theme }) => ({
	width: 60,
	height: 60,
	borderRadius: "50%",
	backgroundColor: "rgba(93, 211, 158, 0.1)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	margin: "0 auto",
	marginBottom: theme.spacing(2),
	"& svg": {
		fontSize: 30,
		color: theme.palette.primary.main,
	},
}));

const SearchBox = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(0.5, 2),
	display: "flex",
	alignItems: "center",
	width: "100%",
	maxWidth: 600,
	margin: "0 auto",
	marginTop: theme.spacing(4),
	borderRadius: theme.shape.borderRadius * 4,
	boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
	height: "100%",
	textAlign: "center",
	padding: theme.spacing(3),
	transition: "transform 0.3s, box-shadow 0.3s",
	"&:hover": {
		transform: "translateY(-10px)",
		boxShadow: theme.shadows[10],
	},
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
	width: 80,
	height: 80,
	borderRadius: "50%",
	backgroundColor: "rgba(93, 211, 158, 0.1)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	margin: "0 auto",
	marginBottom: theme.spacing(2),
	"& svg": {
		fontSize: 40,
		color: theme.palette.primary.main,
	},
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
	position: "relative",
	marginBottom: theme.spacing(6),
	paddingBottom: theme.spacing(2),
	textAlign: "center",
	"&:after": {
		content: '""',
		position: "absolute",
		bottom: 0,
		left: "50%",
		transform: "translateX(-50%)",
		width: 80,
		height: 3,
		backgroundColor: theme.palette.primary.main,
	},
}));

const CourseCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.3s, box-shadow 0.3s",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[8],
	},
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
	position: "absolute",
	top: 16,
	left: 16,
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	fontWeight: "bold",
}));

const TestimonialCard = styled(motion(Card))(({ theme }) => ({
	height: "100%",
	padding: theme.spacing(4),
	position: "relative",
	overflow: "visible",
	borderRadius: theme.shape.borderRadius * 2,
	boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
	border: "1px solid rgba(0, 0, 0, 0.05)",
	"&:hover": {
		transform: "translateY(-10px)",
		boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
	},
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
	position: "absolute",
	top: -15,
	left: 20,
	fontSize: 60,
	color: theme.palette.primary.main,
	opacity: 0.2,
	transform: "rotate(180deg)",
	zIndex: 1,
}));

const TestimonialAvatar = styled(Avatar)(({ theme }) => ({
	width: 70,
	height: 70,
	border: `3px solid ${theme.palette.primary.main}`,
	marginRight: theme.spacing(2),
}));

const EventCard = styled(Card)(({ theme }) => ({
	display: "flex",
	marginBottom: theme.spacing(2),
	overflow: "hidden",
	transition: "transform 0.3s",
	"&:hover": {
		transform: "translateX(5px)",
	},
}));

const EventDate = styled(Box)(({ theme }) => ({
	width: 80,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	padding: theme.spacing(1),
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	transition: "transform 0.3s",
	"&:hover": {
		transform: "translateY(-5px)",
	},
}));

// Background shape for testimonial section
const TestimonialShape = styled(Box)(({ theme }) => ({
	position: "absolute",
	opacity: 0.05,
	zIndex: 1,
}));

// Testimonial section wrapper
const TestimonialWrapper = styled(Box)(({ theme }) => ({
	padding: theme.spacing(10, 0),
	position: "relative",
	overflow: "hidden",
	background: "linear-gradient(135deg, #f8f9fa 0%, #e9f7f0 100%)",
}));

// Arrow buttons for testimonial slider
const SliderArrow = styled(IconButton)(({ theme }) => ({
	position: "absolute",
	top: "50%",
	transform: "translateY(-50%)",
	zIndex: 2,
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
	"&:hover": {
		backgroundColor: "rgba(255, 255, 255, 0.95)",
	},
}));

// Testimonial section title with animation
const AnimatedSectionTitle = styled(motion.div)(({ theme }) => ({
	marginBottom: theme.spacing(6),
	position: "relative",
	textAlign: "center",
}));

const Home = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));

	const [loading, setLoading] = useState(true);
	const [announcements, setAnnouncements] = useState([]);
	const [courses, setCourses] = useState([]);
	const [events, setEvents] = useState([]);
	const [testimonials, setTestimonials] = useState([]);
	const [news, setNews] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [tabValue, setTabValue] = useState(0);
	const [departments, setDepartments] = useState([]);

	// State for testimonial slider
	const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
	const testimonialsPerPage = useMediaQuery(theme.breakpoints.down("md")) ? 1 : 3;
	
	// Testimonial section animation
	const [testimonialRef, testimonialInView] = useInView({
		threshold: 0.1,
		triggerOnce: true,
	});
	
	// Calculate total pages for testimonial slider
	const totalTestimonialPages = testimonials.length > 0
		? Math.ceil(testimonials.length / testimonialsPerPage)
		: 0;
	
	// Handle testimonial navigation
	const handlePrevTestimonial = () => {
		setCurrentTestimonialPage((prev) => 
			prev === 0 ? totalTestimonialPages - 1 : prev - 1
		);
	};
	
	const handleNextTestimonial = () => {
		setCurrentTestimonialPage((prev) => 
			prev === totalTestimonialPages - 1 ? 0 : prev + 1
		);
	};
	
	// Get current testimonials to display
	const getCurrentTestimonials = () => {
		const startIndex = currentTestimonialPage * testimonialsPerPage;
		return testimonials.slice(startIndex, startIndex + testimonialsPerPage);
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				// Fetch all required data
				console.log("Fetching data from API...");
				
				const [
					announcementsRes,
					coursesRes,
					eventsRes,
					departmentsRes,
					testimonialsRes,
					newsRes,
				] = await Promise.all([
					api.public.getAnnouncements(),
					api.public.getCourses(),
					api.public.getEvents(),
					api.public.getDepartments(),
					api.public.getTestimonials(),
					api.public.getNews(),
				]);

				// Log raw responses for debugging
				console.log("Raw announcements response:", announcementsRes);
				console.log("Raw courses response:", coursesRes);
				console.log("Raw events response:", eventsRes);
				console.log("Raw departments response:", departmentsRes);
				console.log("Raw testimonials response:", testimonialsRes);
				console.log("Raw news response:", newsRes);

				// Extract data from response objects with proper handling of different response structures
				let announcements = [];
				if (announcementsRes) {
					if (Array.isArray(announcementsRes)) {
						announcements = announcementsRes;
					} else if (
						announcementsRes.data &&
						Array.isArray(announcementsRes.data)
					) {
						announcements = announcementsRes.data;
					}
				}

				let courses = [];
				if (coursesRes) {
					if (Array.isArray(coursesRes)) {
						courses = coursesRes;
					} else if (coursesRes.data && Array.isArray(coursesRes.data)) {
						courses = coursesRes.data;
					}
				}

				let events = [];
				if (eventsRes) {
					if (Array.isArray(eventsRes)) {
						events = eventsRes;
					} else if (eventsRes.data && Array.isArray(eventsRes.data)) {
						events = eventsRes.data;
					}
				}

				let departments = [];
				if (departmentsRes) {
					if (Array.isArray(departmentsRes)) {
						departments = departmentsRes;
					} else if (
						departmentsRes.data &&
						Array.isArray(departmentsRes.data)
					) {
						departments = departmentsRes.data;
					}
				}

				// Ensure testimonials is an array
				let testimonials = [];
				if (testimonialsRes) {
					if (Array.isArray(testimonialsRes)) {
						testimonials = testimonialsRes;
					} else if (
						testimonialsRes.data &&
						Array.isArray(testimonialsRes.data)
					) {
						testimonials = testimonialsRes.data;
					}
				}

				// Extract news data
				let news = [];
				if (newsRes) {
					console.log("News response type:", typeof newsRes);
					if (Array.isArray(newsRes)) {
						news = newsRes;
						console.log("News is an array directly");
					} else if (newsRes.data && Array.isArray(newsRes.data)) {
						news = newsRes.data;
						console.log("News is in newsRes.data");
					} else if (newsRes.success && Array.isArray(newsRes.data)) {
						news = newsRes.data;
						console.log("News is in newsRes.success.data");
					}
				}

				console.log("Processed courses:", courses);
				console.log("Processed events:", events);
				console.log("Processed testimonials:", testimonials);
				console.log("Processed news:", news);

				// Set state with the fetched data
				setAnnouncements(announcements);
				setCourses(courses);
				setEvents(events);
				setDepartments(departments);
				setTestimonials(testimonials);
				setNews(news);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
				// Don't use mock data, show empty state instead
				setAnnouncements([]);
				setCourses([]);
				setEvents([]);
				setTestimonials([]);
				setDepartments([]);
				setNews([]);
			}
		};

		fetchData();
	}, []);

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	const handleSearch = (query) => {
		// Implement search functionality
		console.log("Searching for:", query);
	};

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
					height: "80vh",
				}}>
				<CircularProgress color='primary' />
			</Box>
		);
	}

	return (
		<Box sx={{ fontFamily: "Poppins, sans-serif" }}>
			{/* Modern Hero Section */}
			<ModernHero onSearch={handleSearch} />

			{/* About University Section */}
			<AboutUniversitySection />

			{/* Why Choose Us Section */}
			<WhyChooseUsSection />

			{/* Popular Courses Section */}
			<PopularCoursesSection 
				courses={courses} 
				departments={departments} 
				loading={loading} 
			/>

			{/* Stats Counter Section */}
			<StatsCounterSection />

			{/* News & Events Section */}
			<NewsEventsSection 
				announcements={announcements}
				events={events}
				news={news}
			/>

			{/* Enhanced Testimonials Section */}
			<TestimonialWrapper ref={testimonialRef}>
				{/* Background shapes */}
				<TestimonialShape 
				sx={{
						top: '10%', 
						left: '5%', 
						width: '300px', 
						height: '300px',
						background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235dd39e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				<TestimonialShape 
												sx={{
						bottom: '10%', 
						right: '5%', 
						width: '250px', 
						height: '250px',
						background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235dd39e' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				
				<Container sx={{ position: "relative", zIndex: 2 }}>
					<AnimatedSectionTitle
						initial={{ opacity: 0, y: 30 }}
						animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<Typography variant="h3" component="h2" fontWeight="700" gutterBottom>
						What Our Students Say
						</Typography>
						<Box sx={{ 
							width: 80, 
							height: 4, 
							backgroundColor: theme.palette.primary.main, 
							margin: "0 auto",
							borderRadius: 2,
							mt: 2 
						}} />
					</AnimatedSectionTitle>
					
						{loading ? (
						<Grid container spacing={4}>
							{Array.from(new Array(3)).map((_, index) => (
								<Grid item xs={12} md={4} key={index}>
									<Card sx={{ height: "100%", boxShadow: 3 }}>
										<CardContent>
											<Skeleton
												variant="circular"
												width={60}
												height={60}
												sx={{ mb: 2 }}
											/>
											<Skeleton variant="text" height={100} />
											<Skeleton variant="text" height={30} />
											<Skeleton variant="text" height={20} />
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
						) : Array.isArray(testimonials) && testimonials.length > 0 ? (
						<Box sx={{ position: "relative", px: { xs: 0, md: 6 } }}>
							{/* Slider navigation arrows */}
							{totalTestimonialPages > 1 && (
								<>
									<SliderArrow 
										onClick={handlePrevTestimonial}
										sx={{ left: { xs: -15, md: 0 } }}
									>
										<ArrowBackIosNewIcon fontSize="small" />
									</SliderArrow>
									<SliderArrow 
										onClick={handleNextTestimonial}
										sx={{ right: { xs: -15, md: 0 } }}
									>
										<ArrowForwardIosIcon fontSize="small" />
									</SliderArrow>
								</>
							)}
							
							<AnimatePresence mode="wait">
								<motion.div
									key={currentTestimonialPage}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.5 }}
								>
									<Grid container spacing={4}>
										{getCurrentTestimonials().map((testimonial, index) => (
											<Grid item xs={12} md={testimonialsPerPage === 1 ? 12 : 4} key={testimonial._id || index}>
												<TestimonialCard
													initial={{ opacity: 0, y: 30 }}
													animate={testimonialInView ? { opacity: 1, y: 0 } : {}}
													transition={{ duration: 0.6, delay: index * 0.2 }}
													whileHover={{ y: -10 }}
												>
													<QuoteIcon />
										<CardContent>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													mb: 2,
												}}>
												<Avatar
													src={testimonial.thumbnailUrl || testimonial.fileUrl}
													alt={testimonial.title}
													sx={{
														width: 80,
														height: 80,
														mb: 2,
														border: "4px solid #fff",
														boxShadow: "0 0 15px rgba(0,0,0,0.1)",
													}}
												/>
															<Typography variant="h6" component="h3" gutterBottom>
													{testimonial.title}
												</Typography>
												<Typography
																variant="body2"
																color="text.secondary"
													gutterBottom>
													Student
												</Typography>
												<Rating
													value={5}
													readOnly
																size="small"
													sx={{ mb: 2 }}
												/>
											</Box>
											<Box
												sx={{
													position: "relative",
													p: 2,
																bgcolor: "rgba(255,255,255,0.6)",
													borderRadius: 2,
													"&::before": {
														content: '""',
														position: "absolute",
														top: -10,
														left: "calc(50% - 10px)",
														width: 0,
														height: 0,
														borderLeft: "10px solid transparent",
														borderRight: "10px solid transparent",
																	borderBottom: "10px solid rgba(255,255,255,0.6)",
													},
												}}>
															<Typography variant="body2" paragraph>
													{testimonial.description?.substring(0, 150)}
													{testimonial.description?.length > 150 ? "..." : ""}
												</Typography>
											</Box>
										</CardContent>
									</TestimonialCard>
								</Grid>
										))}
									</Grid>
								</motion.div>
							</AnimatePresence>
							
							{/* Pagination dots */}
							{totalTestimonialPages > 1 && (
								<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
									{Array.from(new Array(totalTestimonialPages)).map((_, index) => (
										<Box
											key={index}
											onClick={() => setCurrentTestimonialPage(index)}
											sx={{
												width: 12,
												height: 12,
												borderRadius: "50%",
												mx: 0.5,
												cursor: "pointer",
												backgroundColor: currentTestimonialPage === index 
													? theme.palette.primary.main 
													: "rgba(0, 0, 0, 0.2)",
												transition: "all 0.3s ease",
											}}
										/>
									))}
								</Box>
							)}
						</Box>
					) : (
								<Box sx={{ textAlign: "center", py: 5 }}>
							<Typography variant="h6" color="text.secondary">
										No testimonials available at the moment.
									</Typography>
								</Box>
						)}
				</Container>
			</TestimonialWrapper>

			{/* Call to Action Section */}
			<Box
				sx={{
					py: 8,
					bgcolor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
				}}>
				<Container>
					<Grid container spacing={4} alignItems='center'>
						<Grid item xs={12} md={8}>
							<Typography
								variant='h4'
								component='h2'
								fontWeight='bold'
								gutterBottom>
								Ready to Start Your Academic Journey?
							</Typography>
							<Typography variant='h6' sx={{ mb: 2, opacity: 0.9 }}>
								Apply now for the upcoming academic session and take the first
								step towards a successful career.
							</Typography>
						</Grid>
						<Grid
							item
							xs={12}
							md={4}
							sx={{ textAlign: { xs: "center", md: "right" } }}>
							<Button
								variant='contained'
								size='large'
								component={RouterLink}
								to='/register'
								sx={{
									px: 4,
									backgroundColor: "#fff",
									color: theme.palette.primary.main,
									"&:hover": { backgroundColor: "#f0f0f0" },
								}}>
								Apply Now
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
};

// Mock data for fallback
const mockAnnouncements = [
	{
		_id: "1",
		title: "Admission Open for 2023-24 Academic Year",
		description:
			"Applications are now being accepted for the upcoming academic year. Early applicants will receive priority consideration for scholarships and financial aid.",
		uploadedAt: new Date("2023-03-15"),
		fileUrl: "#",
	},
	// ... other mock announcements
];

const mockCourses = [
	{
		_id: "1",
		name: "Bachelor of Computer Science",
		department: { name: "Computer Science" },
		feeStructure: { registrationFee: 5000, fullFee: 85000 },
		thumbnailUrl: "/images/courses/course1.jpg",
	},
	// ... other mock courses
];

const mockEvents = [
	{
		_id: "1",
		title: "Annual Tech Symposium",
		description:
			"Join us for a day of technology talks, workshops, and networking opportunities with industry professionals.",
		eventDate: new Date("2023-04-15T09:00:00"),
		fileUrl: "#",
	},
	// ... other mock events
];

const mockTestimonials = [
	{
		_id: "1",
		title: "Rahul Sharma",
		description:
			"My experience at this college has been transformative. The faculty is supportive and the curriculum is industry-relevant. I secured a great job even before graduation!",
		thumbnailUrl: "/images/team/person1.jpg",
	},
	// ... other mock testimonials
];

export default Home;
