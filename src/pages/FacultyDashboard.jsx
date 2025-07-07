import React, { useState, useEffect } from "react";
import { 
	Container, 
	Typography, 
	TextField, 
	Button, 
	Box, 
	CircularProgress,
	Grid,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem
} from "@mui/material";
import api from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

const FacultyDashboard = () => {
	const [result, setResult] = useState({
		rollNumber: "",
		semester: "",
		subjects: [],
		totalMarks: "",
	});
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [profile, setProfile] = useState(null);
	const [documentType, setDocumentType] = useState("syllabus");
	const [semester, setSemester] = useState("1");

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.faculty.getProfile();
				setProfile(response.data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		fetchProfile();
	}, []);

	const handleUploadResults = async () => {
		if (!result.rollNumber || !result.semester || !result.totalMarks) {
			showErrorToast("Please fill all required fields");
			return;
		}

		setLoading(true);
		try {
			await api.faculty.uploadResults(result);
			showSuccessToast("Results uploaded successfully");
			setResult({
				rollNumber: "",
				semester: "",
				subjects: [],
				totalMarks: "",
			});
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	const handleUploadDocuments = async () => {
		if (!file) {
			showErrorToast("Please select a file to upload");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("type", documentType);
		formData.append("semester", semester);
		
		setLoading(true);
		try {
			await api.faculty.uploadDocuments(formData);
			showSuccessToast("Document uploaded successfully");
			setFile(null);
			// Reset the file input
			const fileInput = document.querySelector('input[type="file"]');
			if (fileInput) fileInput.value = '';
		} catch (error) {
			// Error is already handled by the API interceptor
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container>
			<Typography variant='h4' gutterBottom sx={{ color: "#8A2BE2", mt: 4 }}>
				Faculty Dashboard
			</Typography>
			{profile && (
				<Typography variant="subtitle1" gutterBottom>
					Welcome, {profile.name} ({profile.department})
				</Typography>
			)}
			
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom>Upload Results</Typography>
						<TextField
							label='Roll Number'
							value={result.rollNumber}
							onChange={(e) => setResult({ ...result, rollNumber: e.target.value })}
							fullWidth
							margin="normal"
							required
						/>
						<TextField
							label='Semester'
							value={result.semester}
							onChange={(e) => setResult({ ...result, semester: e.target.value })}
							fullWidth
							margin="normal"
							type="number"
							required
						/>
						<TextField
							label='Total Marks'
							value={result.totalMarks}
							onChange={(e) => setResult({ ...result, totalMarks: e.target.value })}
							fullWidth
							margin="normal"
							type="number"
							required
						/>
						<Button 
							variant="contained" 
							onClick={handleUploadResults}
							disabled={loading}
							sx={{ mt: 2 }}
							fullWidth
						>
							{loading ? <CircularProgress size={24} /> : "Upload Results"}
						</Button>
					</Paper>
				</Grid>
				
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom>Upload Documents</Typography>
						<FormControl fullWidth margin="normal">
							<InputLabel>Document Type</InputLabel>
							<Select
								value={documentType}
								onChange={(e) => setDocumentType(e.target.value)}
								label="Document Type"
							>
								<MenuItem value="syllabus">Syllabus</MenuItem>
								<MenuItem value="datesheet">Datesheet</MenuItem>
								<MenuItem value="form">Form</MenuItem>
								<MenuItem value="result">Result</MenuItem>
							</Select>
						</FormControl>
						
						<TextField
							label='Semester'
							value={semester}
							onChange={(e) => setSemester(e.target.value)}
							fullWidth
							margin="normal"
							type="number"
						/>
						
						<Box sx={{ mt: 2, mb: 2 }}>
							<input 
								type='file' 
								onChange={(e) => setFile(e.target.files[0])} 
								style={{ width: '100%' }}
							/>
						</Box>
						
						<Button 
							variant="contained" 
							onClick={handleUploadDocuments}
							disabled={loading || !file}
							fullWidth
						>
							{loading ? <CircularProgress size={24} /> : "Upload Document"}
						</Button>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default FacultyDashboard;
