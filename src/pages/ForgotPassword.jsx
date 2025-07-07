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
    Alert
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            showErrorToast("Please enter your email address");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            showErrorToast("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            // Use the actual API call
            await api.auth.forgotPassword({ email });
            
            showSuccessToast("Password reset instructions sent to your email");
            setSubmitted(true);
        } catch (err) {
            // Error is already handled by the API interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mb: 3, textAlign: 'center' }}>
                    Forgot Password
                </Typography>
                
                <Divider sx={{ mb: 4 }} />
                
                {submitted ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Password reset instructions have been sent to your email address.
                        </Alert>
                        <Typography variant="body1" paragraph>
                            Please check your inbox and follow the instructions to reset your password.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            If you don't receive an email within a few minutes, please check your spam folder.
                        </Typography>
                        <Button 
                            component={RouterLink} 
                            to="/login" 
                            variant="contained" 
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Return to Login
                        </Button>
                    </Box>
                ) : (
                    <Box component='form'>
                        <Typography variant="body1" paragraph>
                            Enter your email address below and we'll send you instructions to reset your password.
                        </Typography>
                        
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
                                {loading ? "Sending..." : "Reset Password"}
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

export default ForgotPassword; 