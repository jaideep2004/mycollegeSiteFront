import React, { useState } from "react";
import { 
	Container, 
	Typography, 
	TextField, 
	Button, 
	Box, 
	MenuItem, 
	Select, 
	FormControl, 
	InputLabel, 
	FormHelperText, 
	Grid, 
	Paper,
	Divider,
	Link
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const StudentRegister = ({ setRole }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		mobile: "",
		password: "",
		confirmPassword: "",
		fatherName: "",
		motherName: "",
		address: "",
		city: "",
		state: "",
		pinCode: "",
		dob: "",
		gender: "",
		category: "",
		aadharNumber: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// Clear error for the field when user starts typing
		if (errors[e.target.name]) {
			setErrors({ ...errors, [e.target.name]: "" });
		}
	}; 

	const validateForm = () => {
		const newErrors = {};
		const requiredFields = [
			"name",
			"email",
			"mobile",
			"password",
			"confirmPassword",
			"fatherName",
			"motherName",
			"address",
			"city",
			"state",
			"pinCode",
			"dob",
			"gender",
			"category",
			"aadharNumber",
		];

		requiredFields.forEach((field) => {
			if (!formData[field]) {
				newErrors[field] = `${field
					.replace(/([A-Z])/g, " $1")
					.toLowerCase()} is required`;
			}
		});

		// Additional validation
		if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}
		if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
			newErrors.mobile = "Mobile must be 10 digits";
		}
		if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
			newErrors.pinCode = "Pin Code must be 6 digits";
		}
		if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
			newErrors.aadharNumber = "Aadhar number must be 12 digits";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleRegister = async () => {
		if (!validateForm()) {
			showErrorToast("Please fill all required fields correctly");
			return;
		}

		// Remove confirmPassword from the data sent to the API
		const { confirmPassword, ...dataToSend } = formData;

		setLoading(true);
		try {
			const response = await api.auth.register(dataToSend);
			localStorage.setItem("token", response.token);
			localStorage.setItem("role", "student");
			setRole("student");
			showSuccessToast("Registration successful! Please pay the registration fee.");
			navigate("/student");
		} catch (err) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 5 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
				<Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
					Student Registration
				</Typography>
				
				<Divider sx={{ mb: 4 }} />
				
				<Box component='form'>
					<Typography variant="h6" gutterBottom color="primary">
						Personal Information
					</Typography>
					
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<TextField
								label='Name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.name}
								helperText={errors.name}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.email}
								helperText={errors.email}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Mobile'
								name='mobile'
								value={formData.mobile}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.mobile}
								helperText={errors.mobile || "E.g., 9876543210"}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Aadhar Number'
								name='aadharNumber'
								value={formData.aadharNumber}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.aadharNumber}
								helperText={errors.aadharNumber || "12-digit Aadhar number"}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Date of Birth'
								name='dob'
								type='date'
								value={formData.dob}
								onChange={handleChange}
								fullWidth
								margin='normal'
								InputLabelProps={{ shrink: true }}
								error={!!errors.dob}
								helperText={errors.dob}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth margin='normal' error={!!errors.gender} required>
								<InputLabel>Gender</InputLabel>
								<Select
									name='gender'
									value={formData.gender}
									onChange={handleChange}
									label='Gender'
								>
									<MenuItem value='Male'>Male</MenuItem>
									<MenuItem value='Female'>Female</MenuItem>
									<MenuItem value='Other'>Other</MenuItem>
								</Select>
								{errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
							</FormControl>
						</Grid>
					</Grid>
					
					<Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
						Family Information
					</Typography>
					
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<TextField
								label="Father's Name"
								name='fatherName'
								value={formData.fatherName}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.fatherName}
								helperText={errors.fatherName}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label="Mother's Name"
								name='motherName'
								value={formData.motherName}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.motherName}
								helperText={errors.motherName}
								required
							/>
						</Grid>
					</Grid>
					
					<Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
						Address Information
					</Typography>
					
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label='Address'
								name='address'
								value={formData.address}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.address}
								helperText={errors.address}
								required
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								label='City'
								name='city'
								value={formData.city}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.city}
								helperText={errors.city}
								required
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								label='State'
								name='state'
								value={formData.state}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.state}
								helperText={errors.state}
								required
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								label='Pin Code'
								name='pinCode'
								value={formData.pinCode}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.pinCode}
								helperText={errors.pinCode || "E.g., 123456"}
								required
							/>
						</Grid>
					</Grid>
					
					<Typography variant="h6" gutterBottom color="primary" sx={{ mt: 4 }}>
						Category & Account Information
					</Typography>
					
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth margin='normal' error={!!errors.category} required>
								<InputLabel>Category</InputLabel>
								<Select
									name='category'
									value={formData.category}
									onChange={handleChange}
									label='Category'
								>
									<MenuItem value='General'>General</MenuItem>
									<MenuItem value='OBC'>OBC</MenuItem>
									<MenuItem value='SC'>SC</MenuItem>
									<MenuItem value='ST'>ST</MenuItem>
									<MenuItem value='EWS'>EWS</MenuItem>
								</Select>
								{errors.category && <FormHelperText>{errors.category}</FormHelperText>}
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Password'
								name='password'
								type='password'
								value={formData.password}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.password}
								helperText={errors.password}
								required
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								label='Confirm Password'
								name='confirmPassword'
								type='password'
								value={formData.confirmPassword}
								onChange={handleChange}
								fullWidth
								margin='normal'
								error={!!errors.confirmPassword}
								helperText={errors.confirmPassword}
								required
							/>
						</Grid>
					</Grid>
					
					<Box sx={{ mt: 4, textAlign: 'center' }}>
						<Button
							variant='contained'
							color='primary'
							onClick={handleRegister}
							disabled={loading}
							size="large"
							sx={{ px: 4, py: 1 }}
						>
							{loading ? "Registering..." : "Register"}
						</Button>
						
						<Typography variant="body2" sx={{ mt: 2 }}>
							Already have an account? <Link component={RouterLink} to="/login">Login here</Link>
						</Typography>
						
						<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
							Note: After registration, you will be assigned a roll number by the administration.
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default StudentRegister;
