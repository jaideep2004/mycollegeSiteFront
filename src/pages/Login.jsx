import React, { useState } from "react";
import { 
	Container, 
	Typography, 
	TextField, 
	Button, 
	Box, 
	Paper, 
	Divider, 
	Link,
	Grid,
	InputAdornment,
	IconButton
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = ({ setRole }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async () => {
		if (!email || !password) {
			showErrorToast("Please enter both email and password");
			return;
		}

		setLoading(true);
		try {
			const response = await api.auth.login({ email, password });
			const token = response.token;
			localStorage.setItem("token", token);

			// Decode token to get role
			const decoded = jwtDecode(token);
			console.log("Decoded token:", decoded); // Debug log
			
			// Extract role from the correct path in the decoded token
			const userRole = decoded.user.role;
			localStorage.setItem("role", userRole);
			setRole(userRole);

			showSuccessToast("Login successful");
			
			// Add a small delay before navigation to ensure state is updated
			setTimeout(() => {
				if (userRole === "student") navigate("/student");
				else if (userRole === "admin") navigate("/admin");
				else if (userRole === "faculty") navigate("/faculty");
			}, 100);
		} catch (err) {
			console.error("Login error:", err);
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<Container maxWidth="sm" sx={{ py: 8 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
				<Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
					Login
				</Typography>
				
				<Divider sx={{ mb: 4 }} />
				
				<Box component='form'>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onKeyPress={handleKeyPress}
								fullWidth
								margin='normal'
								placeholder="Enter your email address"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Password'
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyPress={handleKeyPress}
								fullWidth
								margin='normal'
								placeholder="Enter your password"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Grid>
					</Grid>
					
					<Box sx={{ mt: 4, textAlign: 'center' }}>
						<Button
							onClick={handleLogin}
							variant='contained'
							color="primary"
							disabled={loading}
							size="large"
							sx={{ px: 4, py: 1 }}
						>
							{loading ? "Logging in..." : "Login"}
						</Button>
						
						<Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
							<Typography variant="body2">
								<Link component={RouterLink} to="/register">
									Create an account
								</Link>
							</Typography>
							<Typography variant="body2">
								<Link component={RouterLink} to="/forgot-password">
									Forgot password?
								</Link>
							</Typography>
						</Box>
						
						<Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
							By logging in, you agree to our Terms of Service and Privacy Policy.
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default Login;
