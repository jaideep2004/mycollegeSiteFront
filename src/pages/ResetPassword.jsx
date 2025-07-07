import React, { useState, useEffect } from "react";
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
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState("");
    const [tokenValid, setTokenValid] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const resetToken = queryParams.get('token');
        
        if (!resetToken) {
            setTokenValid(false);
            setValidating(false);
            showErrorToast("Invalid or missing reset token");
            return;
        }
        
        setToken(resetToken);
        
        // Validate token with backend
        const validateToken = async () => {
            setValidating(true);
            try {
                await api.auth.validateResetToken({ token: resetToken });
                setTokenValid(true);
            } catch (err) {
                setTokenValid(false);
                // Error is already handled by the API interceptor
            } finally {
                setValidating(false);
            }
        };
        
        validateToken();
    }, [location]);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            showErrorToast("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            showErrorToast("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            showErrorToast("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            await api.auth.resetPassword({ token, password });
            
            showSuccessToast("Password has been reset successfully");
            setResetSuccess(true);
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            // Error is already handled by the API interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (validating) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
                        Reset Password
                    </Typography>
                    
                    <Divider sx={{ mb: 4 }} />
                    
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress size={40} sx={{ mb: 3 }} />
                        <Typography variant="body1">
                            Validating your reset token...
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (!tokenValid) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
                        Reset Password
                    </Typography>
                    
                    <Divider sx={{ mb: 4 }} />
                    
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Invalid or expired password reset link.
                    </Alert>
                    
                    <Typography variant="body1" paragraph>
                        The password reset link you clicked is invalid or has expired.
                    </Typography>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button 
                            component={RouterLink} 
                            to="/forgot-password" 
                            variant="contained" 
                            color="primary"
                        >
                            Request New Reset Link
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
                    Reset Password
                </Typography>
                
                <Divider sx={{ mb: 4 }} />
                
                {resetSuccess ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Your password has been reset successfully!
                        </Alert>
                        <Typography variant="body1" paragraph>
                            You will be redirected to the login page in a few seconds.
                        </Typography>
                        <Button 
                            component={RouterLink} 
                            to="/login" 
                            variant="contained" 
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Go to Login
                        </Button>
                    </Box>
                ) : (
                    <Box component='form'>
                        <Typography variant="body1" paragraph>
                            Please enter your new password below.
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label='New Password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    placeholder="Enter your new password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label='Confirm New Password'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    margin='normal'
                                    placeholder="Confirm your new password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleToggleConfirmPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                onClick={handleSubmit}
                                variant='contained'
                                color="primary"
                                disabled={loading}
                                size="large"
                                sx={{ px: 4, py: 1 }}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                            
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="body2">
                                    <Link component={RouterLink} to="/login">
                                        Back to Login
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPassword; 