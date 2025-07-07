import React, { useState } from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	TextField,
	Button,
	Paper,
	Divider,
	Snackbar,
	Alert,
	useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
	background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/a7.jpg")`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	padding: theme.spacing(10, 0),
	textAlign: "center",
	color: "#fff",
}));

const ContactInfoCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(4),
	height: "100%",
	display: "flex",
	flexDirection: "column",
	borderRadius: theme.spacing(1),
	boxShadow: theme.shadows[3],
	transition: "transform 0.3s, box-shadow 0.3s",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: theme.shadows[6],
	},
}));

const ContactInfoItem = styled(Box)(({ theme }) => ({
	display: "flex",
	marginBottom: theme.spacing(3),
	"&:last-child": {
		marginBottom: 0,
	},
}));

const ContactIcon = styled(Box)(({ theme }) => ({
	marginRight: theme.spacing(2),
	color: theme.palette.primary.main,
	"& svg": {
		fontSize: 28,
	},
}));

const ContactForm = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(4),
	borderRadius: theme.spacing(1),
	boxShadow: theme.shadows[3],
}));

const FormTitle = styled(Typography)(({ theme }) => ({
	position: "relative",
	marginBottom: theme.spacing(4),
	paddingBottom: theme.spacing(2),
	"&:after": {
		content: '""',
		position: "absolute",
		bottom: 0,
		left: 0,
		width: 60,
		height: 3,
		backgroundColor: theme.palette.primary.main,
	},
}));

const Contact = () => {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [errors, setErrors] = useState({});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user types
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formData.message.trim()) {
			newErrors.message = "Message is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			// In a real app, you would send the form data to your API
			console.log("Form submitted:", formData);

			// Show success message
			setSnackbar({
				open: true,
				message:
					"Your message has been sent successfully! We will get back to you soon.",
				severity: "success",
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
			});
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({
			...prev,
			open: false,
		}));
	};

	return (
		<Box>
			{/* Banner Section */}
			<PageBanner>
				<Container>
					<Typography
						variant='h3'
						component='h1'
						gutterBottom
						fontWeight='bold'>
						Contact Us
					</Typography>
					<Typography variant='h6' sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
						We're here to help! Reach out to us with any questions, feedback, or
						inquiries.
					</Typography>
				</Container>
			</PageBanner>

			{/* Contact Information Section */}
			<Container sx={{ py: 8 }}>
				<Grid container spacing={4}>
					<Grid item xs={12} md={4}>
						<ContactInfoCard>
							<Typography variant='h6' gutterBottom fontWeight='bold'>
								Contact Information
							</Typography>
							<Typography variant='body2' color='text.secondary' paragraph>
								Feel free to reach out to us using any of the contact methods
								below.
							</Typography>
							<Divider sx={{ my: 3 }} />

							<Box sx={{ flexGrow: 1 }}>
								<ContactInfoItem>
									<ContactIcon>
										<LocationOnIcon />
									</ContactIcon>
									<Box>
										<Typography variant='subtitle2' fontWeight='bold'>
											Our Location
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											123 Education Street, Academic City, 12345
										</Typography>
									</Box>
								</ContactInfoItem>

								<ContactInfoItem>
									<ContactIcon>
										<PhoneIcon />
									</ContactIcon>
									<Box>
										<Typography variant='subtitle2' fontWeight='bold'>
											Phone Number
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											+1 (123) 456-7890
										</Typography>
									</Box>
								</ContactInfoItem>

								<ContactInfoItem>
									<ContactIcon>
										<EmailIcon />
									</ContactIcon>
									<Box>
										<Typography variant='subtitle2' fontWeight='bold'>
											Email Address
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											info@collegeportal.edu
										</Typography>
									</Box>
								</ContactInfoItem>

								<ContactInfoItem>
									<ContactIcon>
										<AccessTimeIcon />
									</ContactIcon>
									<Box>
										<Typography variant='subtitle2' fontWeight='bold'>
											Office Hours
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											Monday - Friday: 8:00 AM - 5:00 PM
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											Saturday: 9:00 AM - 1:00 PM
										</Typography>
									</Box>
								</ContactInfoItem>
							</Box>
						</ContactInfoCard>
					</Grid>

					<Grid item xs={12} md={8}>
						<ContactForm>
							<FormTitle variant='h5' component='h2' fontWeight='bold'>
								Send Us a Message
							</FormTitle>

							<form onSubmit={handleSubmit}>
								<Grid container spacing={3}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Your Name'
											name='name'
											value={formData.name}
											onChange={handleChange}
											error={!!errors.name}
											helperText={errors.name}
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Your Email'
											name='email'
											type='email'
											value={formData.email}
											onChange={handleChange}
											error={!!errors.email}
											helperText={errors.email}
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label='Subject'
											name='subject'
											value={formData.subject}
											onChange={handleChange}
											error={!!errors.subject}
											helperText={errors.subject}
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label='Your Message'
											name='message'
											multiline
											rows={6}
											value={formData.message}
											onChange={handleChange}
											error={!!errors.message}
											helperText={errors.message}
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<Button
											type='submit'
											variant='contained'
											color='primary'
											size='large'
											endIcon={<SendIcon />}
											sx={{ px: 4 }}>
											Send Message
										</Button>
									</Grid>
								</Grid>
							</form>
						</ContactForm>
					</Grid>
				</Grid>
			</Container>

			{/* Map Section */}
			<Box sx={{ height: 450, width: "100%", mt: 6 }}>
				<iframe
					src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266754809!2d-73.98776692426385!3d40.75797623440235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710349480304!5m2!1sen!2sus'
					width='100%'
					height='100%'
					style={{ border: 0 }}
					allowFullScreen=''
					loading='lazy'
					referrerPolicy='no-referrer-when-downgrade'
					title='College Location'></iframe>
			</Box>

			{/* Snackbar for form submission feedback */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant='filled'
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default Contact;
