import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { styled } from '@mui/material/styles';
import api from '../services/api';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { jwtDecode } from "jwt-decode";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ResultsManagement = ({ students, courses }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [semester, setSemester] = useState('');
    const [marks, setMarks] = useState('');
    const [grade, setGrade] = useState('');
    const fileInputRef = useRef(null);

    // Add useEffect to fetch results when component mounts
    useEffect(() => {
        fetchResults();
    }, []);

    // Function to fetch results
    const fetchResults = async () => {
        try {
            const response = await api.admin.getResults();
            setResults(response.data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
            setUploadError('Failed to fetch results');
        }
    };

    // Handle file selection for bulk upload
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setSelectedFile(file);
            setUploadError('');
        } else {
            setUploadError('Please select a valid Excel file (.xlsx)');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle bulk upload
    const handleBulkUpload = async () => {
        if (!selectedFile) {
            setUploadError('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resultsFile', selectedFile);

        try {
            // Call API to upload results
            const response = await api.admin.uploadResults(formData);
            
            // Show summary of upload
            const { successCount, errorCount, errors } = response.data;
            if (errorCount > 0) {
                setUploadError(`Upload completed with ${errorCount} errors. Check console for details.`);
                console.error('Upload errors:', errors);
            } else {
                showSuccessToast(`Successfully uploaded ${successCount} results`);
                setUploadError('');
            }

            // Refresh the results list
            await fetchResults();
            
            // Reset form state
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setUploadError('Failed to upload results. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle individual result entry
    const handleAddResult = async () => {
        if (!selectedStudent || !selectedCourse || !semester || !marks) {
            setUploadError('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            // Calculate grade based on marks
            const grade = calculateGrade(Number(marks));

            const resultData = {
                studentId: selectedStudent,
                courseId: selectedCourse,
                semester,
                marks: Number(marks),
                grade
            };

            // Call API to add result
            await api.admin.addResult(resultData);
            
            // Fetch updated results
            await fetchResults();
            
            // Clear form
            setSelectedStudent('');
            setSelectedCourse('');
            setSemester('');
            setMarks('');
            setGrade('');
            setUploadError('');

            // Show success message
            showSuccessToast('Result added successfully');
        } catch (error) {
            setUploadError('Failed to add result. Please try again.');
            console.error('Add result error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to calculate grade based on marks
    const calculateGrade = (marks) => {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B+';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C+';
        if (marks >= 40) return 'C';
        if (marks >= 33) return 'D';
        return 'F';
    };

    // Download sample Excel template
    const handleDownloadTemplate = async () => {
        try {
            const response = await api.admin.downloadResultTemplate();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'results_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            showSuccessToast('Template downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            showErrorToast('Failed to download template');
        }
    };

    // Reset form function
    const resetForm = () => {
        setSelectedFile(null);
        setUploadError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Results Management
            </Typography>

            {/* Bulk Upload Section */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Bulk Upload Results
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Excel file should contain the following columns:
                    <ul>
                        <li><strong>studentName</strong> - Student's full name as registered in the system</li>
                        <li><strong>courseTitle</strong> - Course name as registered in the system</li>
                        <li><strong>semester</strong> - Semester number (1-8)</li>
                        <li><strong>marks</strong> - Marks obtained (0-100)</li>
                    </ul>
                    Note: Student names and course names must match exactly with the names in the system. Download the template for the correct format.
                </Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            sx={{ mr: 2 }}
                        >
                            Select Excel File
                            <VisuallyHiddenInput 
                                type="file" 
                                onChange={handleFileSelect} 
                                accept=".xlsx"
                                ref={fileInputRef}
                            />
                        </Button>
                        {selectedFile && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected file: {selectedFile.name}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            onClick={handleBulkUpload}
                            disabled={!selectedFile || loading}
                            sx={{ mr: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Upload Results'}
                        </Button>
                        <Tooltip title="Download sample template">
                            <IconButton onClick={handleDownloadTemplate} color="primary">
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>

            {/* Individual Entry Section */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Add Individual Result
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Student</InputLabel>
                            <Select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                label="Student"
                            >
                                {students?.map((student) => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.name} ({student.rollNo})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                label="Course"
                            >
                                {courses?.map((course) => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Marks"
                            type="number"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            onClick={handleAddResult}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Add Result'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {uploadError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {uploadError}
                </Alert>
            )}

            {/* Results Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Roll No</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Semester</TableCell>
                            <TableCell>Marks</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.length > 0 ? (
                            results.map((result) => (
                                <TableRow key={result._id}>
                                    <TableCell>
                                        {result.studentId?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        {result.studentId?.rollNo || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {result.courseId?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>{result.semester}</TableCell>
                                    <TableCell>{result.marks}</TableCell>
                                    <TableCell>{result.grade}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditResult(result)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteResult(result._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ResultsManagement; 