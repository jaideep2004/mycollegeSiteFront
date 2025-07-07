import React from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	Button,
	Card,
	CardContent,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/image-4.jpg')`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	padding: theme.spacing(25, 0, 20, 0),
	textAlign: "center",
	color: "#fff",
	position: "relative",
	overflow: "hidden",
}));

const BannerContent = styled(motion.div)(({ theme }) => ({
	position: "relative",
	zIndex: 2,
}));

const FloatingShape = styled(Box)(({ theme }) => ({
	position: "absolute",
	borderRadius: "50%",
	background: "rgba(93, 211, 158, 0.2)",
	filter: "blur(40px)",
}));

const SectionTitle = styled(motion.div)(({ theme }) => ({
	position: "relative",
	marginBottom: theme.spacing(6),
}));

const SectionTitleText = styled(Typography)(({ theme }) => ({
	fontWeight: "bold",
	position: "relative",
	display: "inline-block",
	"&:after": {
		content: '""',
		position: "absolute",
		bottom: -16,
		left: 0,
		width: 80,
		height: 4,
		backgroundColor: theme.palette.primary.main,
		borderRadius: 2,
	},
}));

const ValueCard = styled(motion(Card))(({ theme }) => ({
	height: "100%",
	transition: "transform 0.3s, box-shadow 0.3s",
	borderRadius: theme.shape.borderRadius * 2,
	overflow: "hidden",
	boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
	"&:hover": {
		transform: "translateY(-10px)",
		boxShadow: theme.shadows[10],
	},
}));

const TeamMemberCard = styled(motion(Card))(({ theme }) => ({
	height: "100%",
	textAlign: "center",
	transition: "transform 0.3s",
	borderRadius: theme.shape.borderRadius * 2,
	overflow: "hidden",
	boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: theme.shadows[10],
	},
}));

const TeamMemberAvatar = styled(Avatar)(({ theme }) => ({
	width: 120,
	height: 120,
	margin: "0 auto",
	marginTop: theme.spacing(-6),
	border: `4px solid ${theme.palette.background.paper}`,
	boxShadow: theme.shadows[3],
}));

const SectionWrapper = styled(Box)(({ theme, bgcolor }) => ({
	padding: theme.spacing(10, 0),
	position: "relative",
	overflow: "hidden",
	backgroundColor: bgcolor || "transparent",
}));

const BackgroundShape = styled(Box)(({ theme }) => ({
	position: "absolute",
	opacity: 0.05,
	zIndex: 1,
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
	position: "relative",
	zIndex: 2,
}));

const About = () => {
	const theme = useTheme();

	// Animation controls with intersection observer
	const [storyRef, storyInView] = useInView({ threshold: 0.1, triggerOnce: true });
	const [valuesRef, valuesInView] = useInView({ threshold: 0.1, triggerOnce: true });
	const [whyUsRef, whyUsInView] = useInView({ threshold: 0.1, triggerOnce: true });
	const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });
	const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
	};

	const fadeInLeft = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
	};

	const fadeInRight = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2
			}
		}
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 }
		}
	};

	// Mock data for team members
	const teamMembers = [
		{
			name: "Dr. Sarah Johnson",
			position: "Principal",
			image: "/images/faculty1.jpg",
			description:
				"Ph.D in Education with over 20 years of experience in academic leadership.",
		},
		{
			name: "Prof. Michael Chen",
			position: "Dean of Sciences",
			image: "/images/faculty2.jpg",
			description:
				"Award-winning researcher with expertise in computational physics.",
		},
		{
			name: "Dr. Emily Rodriguez",
			position: "Head of Student Affairs",
			image: "/images/faculty3.jpg",
			description:
				"Dedicated to creating an inclusive and supportive environment for all students.",
		},
		{
			name: "Prof. James Wilson",
			position: "Dean of Arts",
			image: "/images/faculty4.jpg",
			description:
				"Renowned author and advocate for humanities in higher education.",
		},
	];

	return (
		<Box>
			{/* Banner Section with Floating Elements */}
			<PageBanner>
				<FloatingShape 
					sx={{ 
						width: 300, 
						height: 300, 
						top: '10%', 
						left: '5%',
						animation: 'float 8s ease-in-out infinite',
						'@keyframes float': {
							'0%, 100%': { transform: 'translateY(0px) scale(1)' },
							'50%': { transform: 'translateY(-20px) scale(1.05)' },
						}
					}} 
				/>
				<FloatingShape 
					sx={{ 
						width: 200, 
						height: 200, 
						bottom: '15%', 
						right: '10%',
						animation: 'float2 10s ease-in-out infinite',
						'@keyframes float2': {
							'0%, 100%': { transform: 'translateY(0px) scale(1)' },
							'50%': { transform: 'translateY(-30px) scale(1.1)' },
						}
					}} 
				/>
				<BannerContent
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<Container>
						<Typography
							variant="h2"
							component="h1"
							gutterBottom
							fontWeight="bold"
							sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
						>
							About Our College
						</Typography>
						<Typography 
							variant="h5" 
							sx={{ 
								maxWidth: 800, 
								mx: "auto", 
								mb: 4,
								textShadow: "0 2px 10px rgba(0,0,0,0.3)",
								fontWeight: 300
							}}
						>
							Empowering students with knowledge, skills, and values to excel in a
							rapidly changing world.
						</Typography>
					</Container>
				</BannerContent>
			</PageBanner>

			{/* Our Story Section */}
			<SectionWrapper ref={storyRef}>
				<BackgroundShape 
					sx={{ 
						top: '10%', 
						right: '5%', 
						width: '300px', 
						height: '300px',
						background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235dd39e' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				<ContentWrapper>
					<Grid container spacing={6} alignItems="center">
						<Grid item xs={12} md={6}>
							<motion.div
								initial="hidden"
								animate={storyInView ? "visible" : "hidden"}
								variants={fadeInLeft}
							>
								<Box
									component="img"
									src="/images/a3.jpg"
									alt="College History"
									sx={{
										width: "100%",
										borderRadius: 4,
										boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
									}}
								/>
							</motion.div>
						</Grid>
						<Grid item xs={12} md={6}>
							<SectionTitle
								initial="hidden"
								animate={storyInView ? "visible" : "hidden"}
								variants={fadeInRight}
							>
								<SectionTitleText variant="h3" component="h2">
									Our Story
								</SectionTitleText>
							</SectionTitle>
							<motion.div
								initial="hidden"
								animate={storyInView ? "visible" : "hidden"}
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
										transition: {
											staggerChildren: 0.2
										}
									}
								}}
							>
								{["Founded in 1985, our college has grown from a small institution with just three departments to a comprehensive educational center offering diverse programs across multiple disciplines.",
								  "Over the decades, we have maintained our commitment to academic excellence while adapting to the changing needs of society and industry. Our graduates have gone on to make significant contributions in various fields both nationally and internationally.",
								  "Today, we continue to build on our rich heritage while embracing innovation in teaching, research, and community engagement."
								].map((paragraph, index) => (
									<motion.div key={index} variants={fadeIn}>
										<Typography variant="body1" paragraph>
											{paragraph}
										</Typography>
									</motion.div>
								))}
								<motion.div variants={fadeIn}>
									<Button
										variant="contained"
										color="primary"
										size="large"
										sx={{ 
											mt: 2, 
											borderRadius: 2,
											px: 4,
											py: 1.5,
											fontWeight: 600,
											boxShadow: "0 10px 20px rgba(93, 211, 158, 0.3)"
										}}
									>
										Explore
									</Button>
								</motion.div>
							</motion.div>
						</Grid>
					</Grid>
				</ContentWrapper>
			</SectionWrapper>

			{/* Our Values Section */}
			<SectionWrapper bgcolor="rgba(248, 249, 250, 0.8)" ref={valuesRef}>
				<BackgroundShape 
					sx={{ 
						bottom: '10%', 
						left: '5%', 
						width: '250px', 
						height: '250px',
						background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235dd39e' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				<ContentWrapper>
					<motion.div
						initial="hidden"
						animate={valuesInView ? "visible" : "hidden"}
						variants={fadeIn}
						style={{ textAlign: "center" }}
					>
						<Typography
							variant="h3"
							component="h2"
							fontWeight="bold"
							gutterBottom
						>
							Our Core Values
						</Typography>
						<Box sx={{ 
							width: 80, 
							height: 4, 
							backgroundColor: theme.palette.primary.main, 
							margin: "0 auto",
							borderRadius: 2,
							mb: 3 
						}} />
						<Typography
							variant="h6"
							sx={{ maxWidth: 800, mx: "auto", mb: 6, fontWeight: 300 }}
						>
							These principles guide our decisions, shape our culture, and define
							our approach to education.
						</Typography>
					</motion.div>

					<motion.div
						initial="hidden"
						animate={valuesInView ? "visible" : "hidden"}
						variants={staggerContainer}
					>
						<Grid container spacing={4}>
							{[
								{
									icon: <StarIcon sx={{ fontSize: 50 }} />,
									title: "Excellence",
									description: "We strive for the highest standards in all our academic and administrative endeavors."
								},
								{
									icon: <GroupsIcon sx={{ fontSize: 50 }} />,
									title: "Inclusivity",
									description: "We embrace diversity and ensure equal opportunities for all members of our community."
								},
								{
									icon: <MenuBookIcon sx={{ fontSize: 50 }} />,
									title: "Innovation",
									description: "We encourage creative thinking and novel approaches to teaching and learning."
								},
								{
									icon: <EmojiEventsIcon sx={{ fontSize: 50 }} />,
									title: "Integrity",
									description: "We uphold ethical standards and promote honesty and transparency in all interactions."
								}
							].map((value, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<ValueCard variants={cardVariants}>
										<CardContent sx={{ textAlign: "center", py: 4 }}>
											<Box sx={{ 
												color: theme.palette.primary.main, 
												mb: 2,
												background: "rgba(93, 211, 158, 0.1)",
												width: 80,
												height: 80,
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												margin: "0 auto",
												marginBottom: 3
											}}>
												{value.icon}
											</Box>
											<Typography
												variant="h5"
												component="h3"
												gutterBottom
												fontWeight="bold"
											>
												{value.title}
											</Typography>
											<Typography variant="body1">
												{value.description}
											</Typography>
										</CardContent>
									</ValueCard>
								</Grid>
							))}
						</Grid>
					</motion.div>
				</ContentWrapper>
			</SectionWrapper>

			{/* Why Choose Us Section */}
			<SectionWrapper ref={whyUsRef}>
				<BackgroundShape 
					sx={{ 
						top: '30%', 
						right: '5%', 
						width: '200px', 
						height: '200px',
						background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235dd39e' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				<ContentWrapper>
					<Grid container spacing={6} alignItems="center">
						<Grid item xs={12} md={6}>
							<SectionTitle
								initial="hidden"
								animate={whyUsInView ? "visible" : "hidden"}
								variants={fadeInLeft}
							>
								<SectionTitleText variant="h3" component="h2">
									Why Choose Us
								</SectionTitleText>
							</SectionTitle>
							<motion.div
								initial="hidden"
								animate={whyUsInView ? "visible" : "hidden"}
								variants={fadeInLeft}
							>
								<Typography variant="body1" paragraph>
									Our institution stands out for its commitment to providing a
									holistic educational experience that prepares students for success
									in their chosen fields and in life.
								</Typography>

								<motion.div
									variants={staggerContainer}
									initial="hidden"
									animate={whyUsInView ? "visible" : "hidden"}
								>
									<List>
										{[
											"Experienced faculty with industry expertise",
											"State-of-the-art facilities and resources",
											"Diverse and inclusive learning environment",
											"Strong industry partnerships and internship opportunities",
											"Comprehensive student support services",
											"Active research culture and innovation centers",
										].map((item, index) => (
											<motion.div key={index} variants={cardVariants}>
												<ListItem disableGutters>
													<ListItemIcon>
														<CheckCircleIcon color="primary" />
													</ListItemIcon>
													<ListItemText primary={item} />
												</ListItem>
											</motion.div>
										))}
									</List>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={whyUsInView ? { opacity: 1, y: 0 } : {}}
									transition={{ delay: 0.6, duration: 0.5 }}
								>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										sx={{ 
											mt: 2,
											borderRadius: 2,
											px: 4,
											py: 1.5,
											fontWeight: 600,
											borderWidth: 2
										}}
									>
										Apply Now
									</Button>
								</motion.div>
							</motion.div>
						</Grid>
						<Grid item xs={12} md={6}>
							<motion.div
								initial="hidden"
								animate={whyUsInView ? "visible" : "hidden"}
								variants={fadeInRight}
							>
								<Box
									component="img"
									src="/images/a5.jpg"
									alt="Campus Life"
									sx={{
										width: "100%",
										borderRadius: 4,
										boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
									}}
								/>
							</motion.div>
						</Grid>
					</Grid>
				</ContentWrapper>
			</SectionWrapper>

			{/* Leadership Team Section */}
			<SectionWrapper bgcolor="rgba(248, 249, 250, 0.8)" ref={teamRef}>
				<BackgroundShape 
					sx={{ 
						bottom: '10%', 
						right: '5%', 
						width: '250px', 
						height: '250px',
						background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235dd39e' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
					}} 
				/>
				<ContentWrapper>
					<motion.div
						initial="hidden"
						animate={teamInView ? "visible" : "hidden"}
						variants={fadeIn}
						style={{ textAlign: "center" }}
					>
						<Typography
							variant="h3"
							component="h2"
							fontWeight="bold"
							gutterBottom
						>
							Our Leadership Team
						</Typography>
						<Box sx={{ 
							width: 80, 
							height: 4, 
							backgroundColor: theme.palette.primary.main, 
							margin: "0 auto",
							borderRadius: 2,
							mb: 3 
						}} />
						<Typography
							variant="h6"
							sx={{ maxWidth: 800, mx: "auto", mb: 6, fontWeight: 300 }}
						>
							Meet the dedicated professionals who guide our institution's vision
							and operations.
						</Typography>
					</motion.div>

					<motion.div
						initial="hidden"
						animate={teamInView ? "visible" : "hidden"}
						variants={staggerContainer}
					>
						<Grid container spacing={4}>
							{teamMembers.map((member, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<motion.div variants={cardVariants}>
										<Box sx={{ position: "relative", mt: 6 }}>
											<TeamMemberCard style={{ paddingTop: "50px" }}
												whileHover={{ y: -8 }}
											>
												<TeamMemberAvatar src={member.image} alt={member.name} />
												<CardContent sx={{ pt: 4 }}>
													<Typography variant="h6" component="h3" gutterBottom>
														{member.name}
													</Typography>
													<Typography
														variant="subtitle2"
														color="primary"
														gutterBottom
														fontWeight="bold"
													>
														{member.position}
													</Typography>
													<Divider sx={{ my: 2 }} />
													<Typography variant="body2">
														{member.description}
													</Typography>
												</CardContent>
											</TeamMemberCard>
										</Box>
									</motion.div>
								</Grid>
							))}
						</Grid>
					</motion.div>
				</ContentWrapper>
			</SectionWrapper>

			{/* Call to Action Section */}
			<Box
				ref={ctaRef}
				sx={{
					background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/campus3.jpg')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundAttachment: "fixed",
					py: 10,
					color: "white",
					textAlign: "center",
					position: "relative",
					overflow: "hidden",
				}}>
				<FloatingShape 
					sx={{ 
						width: 300, 
						height: 300, 
						top: '10%', 
						left: '5%',
						background: "rgba(93, 211, 158, 0.1)",
						animation: 'float 8s ease-in-out infinite',
					}} 
				/>
				<FloatingShape 
					sx={{ 
						width: 200, 
						height: 200, 
						bottom: '15%', 
						right: '10%',
						background: "rgba(93, 211, 158, 0.1)",
						animation: 'float2 10s ease-in-out infinite',
					}} 
				/>
				<Container sx={{ position: "relative", zIndex: 2 }}>
					<motion.div
						initial="hidden"
						animate={ctaInView ? "visible" : "hidden"}
						variants={staggerContainer}
					>
						<motion.div variants={fadeIn}>
							<SchoolIcon
								sx={{ fontSize: 80, mb: 3, color: theme.palette.primary.main }}
							/>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Typography
								variant="h3"
								component="h2"
								gutterBottom
								fontWeight="bold"
							>
								Ready to Join Our Community?
							</Typography>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Typography variant="h6" sx={{ maxWidth: 800, mx: "auto", mb: 4, fontWeight: 300 }}>
								Take the first step towards a transformative educational experience.
								Apply now for the upcoming academic session.
							</Typography>
						</motion.div>
						<motion.div variants={fadeIn}>
							<Box>
								<Button
									variant="contained"
									color="primary"
									size="large"
									sx={{ 
										mr: 2,
										borderRadius: 2,
										px: 4,
										py: 1.5,
										fontWeight: 600,
										boxShadow: "0 10px 20px rgba(93, 211, 158, 0.3)"
									}}
								>
									Apply Now
								</Button>
								<Button
									variant="outlined"
									sx={{
										color: "white",
										borderColor: "white",
										borderRadius: 2,
										px: 4,
										py: 1.5,
										fontWeight: 600,
										borderWidth: 2,
										"&:hover": {
											borderColor: theme.palette.primary.main,
											backgroundColor: "rgba(255, 255, 255, 0.1)",
										},
									}}
									size="large"
								>
									Contact Us
								</Button>
							</Box>
						</motion.div>
					</motion.div>
				</Container>
			</Box>
		</Box>
	);
};

export default About;
