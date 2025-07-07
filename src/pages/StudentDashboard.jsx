import React, { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Tabs,
	Tab,
	Box,
	TextField,
	Button,
	Table,
	TableCell,
	TableRow,
	CircularProgress,
	MenuItem,  
	Select,
	FormControl,
	InputLabel,
	Paper,
	TableHead,
	TableBody,
	Chip,
	Grid,
	List,
	ListItem,
	ListItemText,
	FormControlLabel,
	Checkbox,
	TableContainer,
	Alert,
} from "@mui/material";
import api from "../services/api";
import {
	showSuccessToast,
	showErrorToast,
	showInfoToast,
} from "../utils/toast";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StudentDashboard = () => {
	const [activeTab, setActiveTab] = useState('Results');
	const [results, setResults] = useState([]);
	const [documents, setDocuments] = useState([]);
	const [courseId, setCourseId] = useState("");
	const [paymentType, setPaymentType] = useState("registration");
	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState(null);
	const [courses, setCourses] = useState([]);
	const [paymentHistory, setPaymentHistory] = useState([]);
	const [admissions, setAdmissions] = useState([]);
	const [profileData, setProfileData] = useState({
		name: "",
		email: "",
		mobile: "",
		fatherName: "",
		motherName: "",
		address: "",
		city: "",
		state: "",
		pinCode: "",
	});
	const [editMode, setEditMode] = useState(false);
	const [registeredCourses, setRegisteredCourses] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.student.getProfile();
				setProfile(response.data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		const fetchCourses = async () => {
			try {
				const response = await api.student.getCourses();
				setCourses(response.data || []);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchProfile();
		fetchCourses();
	}, []);

	useEffect(() => {
		if (activeTab === 'Results') {
			fetchResults();
		} else if (activeTab === 'Documents') {
			fetchDocuments();
		} else if (activeTab === 'Courses') {
			fetchRegisteredCourses();
		} else if (activeTab === 'Payments') {
			fetchPaymentHistory();
		} else if (activeTab === 'Profile') {
			if (profile) {
				setProfileData({
					name: profile.name || "",
					email: profile.email || "",
					mobile: profile.mobile || "",
					fatherName: profile.fatherName || "",
					motherName: profile.motherName || "",
					address: profile.address || "",
					city: profile.city || "",
					state: profile.state || "",
					pinCode: profile.pinCode || "",
				});
			}
		}
	}, [activeTab, profile]);

	const fetchResults = async () => {
		setLoading(true);
		try {
			const response = await api.student.getResults();
			setResults(response.data || []);
			setError('');
		} catch (err) {
			console.error('Error fetching results:', err);
			setError('Failed to fetch results');
			setResults([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchDocuments = async () => {
		try {
			setLoading(true);
			const response = await api.student.getDocuments("syllabus");
			setDocuments(response.data || []);
			if (response.data.length === 0) {
				showInfoToast("No syllabus documents found");
			}
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleAdmission = async () => {
		if (!courseId) {
			showErrorToast("Please select a course");
			return;
		}

		try {
			setLoading(true);
			await api.student.applyAdmission({ courseId, documents: [] });
			showSuccessToast("Admission application submitted successfully");
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handlePayment = async () => {
		if (!courseId) {
			showErrorToast("Please select a course");
			return;
		}

		setLoading(true);
		try {
			const response = await api.student.createPayment({
				courseId,
				type: paymentType,
			});
			const { amount, orderId } = response.data;

			// Check if Razorpay is available
			if (!window.Razorpay) {
				showErrorToast("Razorpay SDK not loaded. Please refresh the page.");
				return;
			}

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_brvO8EMMhXPsDD", // Use environment variable
				amount: amount * 100, // Convert to paise
				currency: "INR",
				name: "College Portal",
				description: `${
					paymentType === "registration" ? "Registration" : "Full"
				} Fee Payment`,
				order_id: orderId,
				handler: async function (response) {
					try {
						const result = await api.student.verifyPayment({
						razorpayOrderId: response.razorpay_order_id,
						razorpayPaymentId: response.razorpay_payment_id,
						razorpaySignature: response.razorpay_signature,
					});

						if (result.success) {
							showSuccessToast("Payment successful");
							// Refresh the page or update the UI as needed
						}
					} catch (error) {
						// Error is already handled by the API interceptor
					}
				},
				prefill: {
					name: profile?.name || "",
					email: profile?.email || "",
					contact: profile?.mobile || "",
				},
				theme: {
					color: "#8A2BE2",
				},
				modal: {
					ondismiss: function () {
						setLoading(false);
					},
				},
			};

			console.log("Razorpay options:", options);

			const razorpayInstance = new window.Razorpay(options);
			razorpayInstance.open();

			// Handle payment failure
			razorpayInstance.on("payment.failed", function (response) {
				console.error("Payment failed:", response.error);
				showErrorToast(`Payment failed: ${response.error.description}`);
				setLoading(false);
			});
		} catch (error) {
			console.error("Payment creation error:", error);
			// Error is already handled by the API interceptor
			setLoading(false);
		}
	};

	const fetchPaymentHistory = async () => {
		setLoading(true);
		try {
			const response = await api.student.getPaymentHistory();
			setPaymentHistory(response.data || []);
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const fetchAdmissions = async () => {
		setLoading(true);
		try {
			const response = await api.student.getAdmissions();
			setAdmissions(response.data || []);
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleProfileUpdate = async () => {
		setLoading(true);
		try {
			await api.student.updateProfile(profileData);
			showSuccessToast("Profile updated successfully");
			setEditMode(false);
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const fetchRegisteredCourses = async () => {
		setLoading(true);
		try {
			const response = await api.student.getRegisteredCourses();
			setRegisteredCourses(response.data || []);
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const renderResults = () => {
		if (loading) {
			return (
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
					<CircularProgress />
				</Box>
			);
		}

		if (error) {
			return (
				<Alert severity="error" sx={{ mt: 2 }}>
					{error}
				</Alert>
			);
		}

		if (results.length === 0) {
			return (
				<Alert severity="info" sx={{ mt: 2 }}>
					No results found
				</Alert>
			);
		}

		return (
			<TableContainer component={Paper} sx={{ mt: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell><strong>Course</strong></TableCell>
							<TableCell><strong>Semester</strong></TableCell>
							<TableCell><strong>Marks</strong></TableCell>
							<TableCell><strong>Grade</strong></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{results.map((result) => (
							<TableRow key={result._id}>
								<TableCell>{result.courseId?.name || 'Unknown Course'}</TableCell>
								<TableCell>{result.semester}</TableCell>
								<TableCell>{result.marks}</TableCell>
								<TableCell>{result.grade}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	const TestimonialTab = () => {
		const [testimonial, setTestimonial] = useState({
			content: '',
			program: '',
			year: '',
		});
		const [submitted, setSubmitted] = useState(false);
		const [loading, setLoading] = useState(false);

		const handleChange = (e) => {
			const { name, value } = e.target;
			setTestimonial(prev => ({
				...prev,
				[name]: value
			}));
		};

		const handleSubmit = async (e) => {
			e.preventDefault();
			setLoading(true);
			
			try {
				// In a real app, you would send the testimonial to your API
				// await api.student.submitTestimonial(testimonial);
				
				// Simulate API call
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				setSubmitted(true);
				showSuccessToast('Testimonial submitted successfully!');
			} catch (error) {
				console.error('Error submitting testimonial:', error);
				showErrorToast('Failed to submit testimonial. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		const handleReset = () => {
			setTestimonial({
				content: '',
				program: '',
				year: '',
			});
			setSubmitted(false);
		};

		if (submitted) {
			return (
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Box sx={{ 
						width: 80, 
						height: 80, 
						borderRadius: '50%', 
						bgcolor: 'primary.main', 
						color: 'primary.contrastText',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mx: 'auto',
						mb: 3
					}}>
						<CheckCircleIcon sx={{ fontSize: 40 }} />
					</Box>
					<Typography variant="h5" gutterBottom>
						Thank You for Your Feedback!
					</Typography>
					<Typography variant="body1" color="text.secondary" paragraph>
						Your testimonial has been submitted successfully and will be reviewed by our team.
					</Typography>
					<Button 
						variant="outlined" 
						onClick={handleReset}
						startIcon={<FeedbackIcon />}
					>
						Submit Another Testimonial
					</Button>
				</Box>
			);
		}

		return (
			<Box>
				<Typography variant="h5" gutterBottom>
					Share Your Experience
				</Typography>
				<Typography variant="body1" paragraph color="text.secondary">
					We value your feedback! Share your experience at our college to help prospective students.
				</Typography>
				
				<Paper sx={{ p: 3, mt: 3 }}>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Program/Course"
									name="program"
									value={testimonial.program}
									onChange={handleChange}
									required
									helperText="e.g., Computer Science, Business Administration"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Year/Batch"
									name="year"
									value={testimonial.year}
									onChange={handleChange}
									required
									helperText="e.g., Class of 2023"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Your Testimonial"
									name="content"
									value={testimonial.content}
									onChange={handleChange}
									required
									multiline
									rows={6}
									helperText={`${testimonial.content.length}/500 characters (minimum 100)`}
									error={testimonial.content.length > 0 && testimonial.content.length < 100}
									inputProps={{ maxLength: 500 }}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox required />}
									label="I confirm that this testimonial is my honest opinion and I consent to it being published on the college website."
								/>
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										type="submit"
										variant="contained"
										disabled={loading || testimonial.content.length < 100}
										startIcon={loading ? <CircularProgress size={20} /> : <FeedbackIcon />}
									>
										{loading ? 'Submitting...' : 'Submit Testimonial'}
									</Button>
								</Box>
							</Grid>
						</Grid>
					</form>
				</Paper>
			</Box>
		);
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Typography variant="h4" gutterBottom>
				Student Dashboard
			</Typography>

			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs
					value={activeTab}
					onChange={(e, newValue) => setActiveTab(newValue)}
					aria-label="dashboard tabs"
				>
					<Tab label="Results" value="Results" />
					<Tab label="Documents" value="Documents" />
					<Tab label="Courses" value="Courses" />
					<Tab label="Payments" value="Payments" />
					<Tab label="Profile" value="Profile" />
				</Tabs>
			</Box>

			{activeTab === 'Results' && (
				<Box>
					<Typography variant="h6" gutterBottom>
						Academic Results
					</Typography>
					{renderResults()}
				</Box>
			)}
			
			{activeTab === 'Documents' && (
				<Box sx={{ mt: 2 }}>
					<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
						<Button
							variant='contained'
							onClick={() => handleDocuments("syllabus")}
							disabled={loading}>
							{loading && documents.type === "syllabus" ? (
								<CircularProgress size={24} />
							) : (
								"Syllabus"
							)}
						</Button>
						<Button
							variant='contained'
							onClick={() => handleDocuments("datesheet")}
							disabled={loading}>
							{loading && documents.type === "datesheet" ? (
								<CircularProgress size={24} />
							) : (
								"Datesheet"
							)}
					</Button>
					</Box>

					{documents.length > 0 ? (
						documents.map((doc) => (
							<Typography key={doc._id} sx={{ mb: 1 }}>
								<a href={doc.fileUrl} target='_blank' rel='noopener noreferrer'>
									{doc.title ||
										`${doc.type} - Semester ${doc.semester || "N/A"}`}
								</a>
							</Typography>
						))
					) : (
						<Typography>
							Select a document type to view available documents
						</Typography>
					)}
				</Box>
			)}
			{activeTab === 'Courses' && (
				<Box>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Paper sx={{ p: 3, mb: 3 }}>
								<Typography variant='h6' gutterBottom>
									Course Registration
								</Typography>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Select Course</InputLabel>
									<Select
										value={courseId}
										onChange={(e) => setCourseId(e.target.value)}
										label='Select Course'>
										{courses.map((course) => (
											<MenuItem key={course._id} value={course._id}>
												{course.name} - {course.departmentId?.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Payment Type</InputLabel>
									<Select
										value={paymentType}
										onChange={(e) => setPaymentType(e.target.value)}
										label='Payment Type'>
										<MenuItem value='registration'>Registration Fee</MenuItem>
										<MenuItem value='fullFee'>Full Fee</MenuItem>
									</Select>
								</FormControl>
								<Button
									variant='contained'
									onClick={handlePayment}
									disabled={loading || !courseId}
									fullWidth>
									{loading ? <CircularProgress size={24} /> : "Pay Now"}
								</Button>
							</Paper>

							<Paper sx={{ p: 3 }}>
								<Typography variant='h6' gutterBottom>
									Apply for Admission
								</Typography>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputLabel>Select Course</InputLabel>
									<Select
						value={courseId}
						onChange={(e) => setCourseId(e.target.value)}
										label='Select Course'>
										{courses.map((course) => (
											<MenuItem key={course._id} value={course._id}>
												{course.name} - {course.departmentId?.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<Button
									variant='contained'
									onClick={handleAdmission}
									disabled={loading || !courseId}
									fullWidth>
									{loading ? (
										<CircularProgress size={24} />
									) : (
										"Apply for Admission"
									)}
								</Button>
							</Paper>
						</Grid>

						<Grid item xs={12} md={6}>
							<Paper sx={{ p: 3 }}>
								<Typography variant='h6' gutterBottom>
									Registered Courses
								</Typography>
								{loading ? (
									<Box
										sx={{ display: "flex", justifyContent: "center", my: 4 }}>
										<CircularProgress />
									</Box>
								) : registeredCourses.length > 0 ? (
									<List>
										{registeredCourses.map((course) => (
											<ListItem key={course._id}>
												<ListItemText
													primary={course.name}
													secondary={`${course.departmentId?.name || "N/A"} - ${
														course.categoryId?.name || "N/A"
													}`}
												/>
											</ListItem>
										))}
									</List>
								) : (
									<Typography align='center' sx={{ my: 4 }}>
										You haven't registered for any courses yet
									</Typography>
								)}
							</Paper>
						</Grid>
					</Grid>
				</Box>
			)}
			{activeTab === 'Payments' && (
				<Paper sx={{ p: 3 }}>
					<Typography variant='h6' gutterBottom>
						Payment History
					</Typography>
					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
							<CircularProgress />
						</Box>
					) : paymentHistory.length > 0 ? (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Course</TableCell>
									<TableCell>Type</TableCell>
									<TableCell>Amount</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Receipt</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paymentHistory.map((payment) => (
									<TableRow key={payment._id}>
										<TableCell>
											{new Date(
												payment.completedAt || payment.createdAt
											).toLocaleDateString()}
										</TableCell>
										<TableCell>{payment.courseId?.name || "N/A"}</TableCell>
										<TableCell>
											{payment.type === "registration"
												? "Registration Fee"
												: "Full Fee"}
										</TableCell>
										<TableCell>₹{payment.amount}</TableCell>
										<TableCell>
											<Chip
												label={payment.status}
												color={
													payment.status === "completed"
														? "success"
														: payment.status === "pending"
														? "warning"
														: "error"
												}
												size='small'
											/>
										</TableCell>
										<TableCell>
											{payment.razorpayPaymentId && (
												<Button
													variant='outlined'
													size='small'
													startIcon={<ReceiptIcon />}
													onClick={() =>
														window.open(
															`https://dashboard.razorpay.com/app/payments/${payment.razorpayPaymentId}`,
															"_blank"
														)
													}>
													View
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<Typography align='center' sx={{ my: 4 }}>
							No payment history found
						</Typography>
					)}
				</Paper>
			)}
			{activeTab === 'Profile' && (
				<Paper sx={{ p: 3 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
						<Typography variant='h6'>Profile Information</Typography>
						{!editMode ? (
							<Button
								variant='contained'
								onClick={() => setEditMode(true)}
								startIcon={<EditIcon />}>
								Edit Profile
							</Button>
						) : (
							<Box sx={{ display: "flex", gap: 2 }}>
								<Button
									variant='outlined'
									onClick={() => {
										setEditMode(false);
										if (profile) {
											setProfileData({
												name: profile.name || "",
												email: profile.email || "",
												mobile: profile.mobile || "",
												fatherName: profile.fatherName || "",
												motherName: profile.motherName || "",
												address: profile.address || "",
												city: profile.city || "",
												state: profile.state || "",
												pinCode: profile.pinCode || "",
											});
										}
									}}>
									Cancel
								</Button>
								<Button
									variant='contained'
									onClick={handleProfileUpdate}
									disabled={loading}>
									{loading ? <CircularProgress size={24} /> : "Save Changes"}
								</Button>
							</Box>
						)}
					</Box>

					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<TextField
								label='Name'
								value={profileData.name}
								onChange={(e) =>
									setProfileData({ ...profileData, name: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Email'
								value={profileData.email}
								fullWidth
								margin='normal'
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Mobile'
								value={profileData.mobile}
								onChange={(e) =>
									setProfileData({ ...profileData, mobile: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label="Father's Name"
								value={profileData.fatherName}
								onChange={(e) =>
									setProfileData({ ...profileData, fatherName: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label="Mother's Name"
								value={profileData.motherName}
								onChange={(e) =>
									setProfileData({ ...profileData, motherName: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Address'
								value={profileData.address}
								onChange={(e) =>
									setProfileData({ ...profileData, address: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								label='City'
								value={profileData.city}
								onChange={(e) =>
									setProfileData({ ...profileData, city: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
					<TextField
								label='State'
								value={profileData.state}
								onChange={(e) =>
									setProfileData({ ...profileData, state: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
					<TextField
								label='Pin Code'
								value={profileData.pinCode}
								onChange={(e) =>
									setProfileData({ ...profileData, pinCode: e.target.value })
								}
								fullWidth
								margin='normal'
								disabled={!editMode}
							/>
						</Grid>
					</Grid>
				</Paper>
			)}
			{activeTab === 'Testimonial' && (
				<TestimonialTab />
			)}
		</Container>
	);
};

export default StudentDashboard;
