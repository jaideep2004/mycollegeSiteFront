import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  FormHelperText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import IDCard from './IDCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import Webcam from 'react-webcam';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: theme.spacing(1)
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

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

const WebcamContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  position: 'relative',
}));

const IDCardGenerator = ({ students, departments, courses }) => {
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [cardSettings, setCardSettings] = useState({
    collegeName: 'ABC College',
    collegeAddress: '123 Education Street, Academic City',
    logoUrl: '/images/logo.png',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().split('T')[0],
    signature: '',
    bloodGroup: 'O+'
  });

  const cardRef = useRef(null);
  const webcamRef = useRef(null);

  const handleStudentChange = (event, newValue) => {
    setSelectedStudent(newValue);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setCardSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardSettings(prev => ({
          ...prev,
          logoUrl: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardSettings(prev => ({
          ...prev,
          signature: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (selectedStudent) {
          setSelectedStudent(prev => ({
            ...prev,
            profileImage: event.target.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openWebcam = () => {
    setWebcamOpen(true);
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const photoDataUrl = webcamRef.current.getScreenshot();
      if (selectedStudent) {
        setSelectedStudent(prev => ({
          ...prev,
          profileImage: photoDataUrl
        }));
      }
      setWebcamOpen(false);
    }
  };

  const downloadAsPDF = () => {
    if (!cardRef.current || !selectedStudent) {
      showErrorToast("Please select a student first");
      return;
    }

    setLoading(true);
    
    const card = cardRef.current;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    
    html2canvas(card, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null
    })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate scaling to fit card on A4 with margins
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 20;
      const availableWidth = pdfWidth - 2 * margin;
      
      const scale = availableWidth / cardWidth;
      const scaledHeight = cardHeight * scale;
      
      const x = margin;
      const y = (pdfHeight - scaledHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, availableWidth, scaledHeight);
      pdf.save(`ID_Card_${selectedStudent.name || 'Student'}.pdf`);
      
      showSuccessToast("ID Card downloaded successfully");
      setLoading(false);
    })
    .catch(error => {
      console.error("Error generating PDF:", error);
      showErrorToast("Failed to generate PDF");
      setLoading(false);
    });
  };

  const printCard = () => {
    if (!cardRef.current || !selectedStudent) {
      showErrorToast("Please select a student first");
      return;
    }

    setLoading(true);
    
    html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    .then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Card</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                img {
                  width: 100%;
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setLoading(false);
    })
    .catch(error => {
      console.error("Error printing card:", error);
      showErrorToast("Failed to print ID card");
      setLoading(false);
    });
  };

  const downloadAsImage = () => {
    if (!cardRef.current || !selectedStudent) {
      showErrorToast("Please select a student first");
      return;
    }

    setLoading(true);
    
    html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    .then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ID_Card_${selectedStudent.name || 'Student'}.png`;
      link.click();
      
      showSuccessToast("ID Card image downloaded successfully");
      setLoading(false);
    })
    .catch(error => {
      console.error("Error downloading image:", error);
      showErrorToast("Failed to download image");
      setLoading(false);
    });
  };

  // Prepare student data for the ID card display
  const studentWithDepartmentAndCourse = selectedStudent ? {
    ...selectedStudent,
    bloodGroup: cardSettings.bloodGroup,
    department: selectedStudent.department || 
      (selectedStudent.courses && selectedStudent.courses[0] && 
        departments.find(d => d._id === 
          courses.find(c => c._id === selectedStudent.courses[0])?.departmentId
        )?.name
      ),
    course: selectedStudent.course || 
      (selectedStudent.courses && selectedStudent.courses[0] && 
        courses.find(c => c._id === selectedStudent.courses[0])?.name
      )
  } : null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Student ID Card Generator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              1. Select Student
            </Typography>
            <Autocomplete
              options={students || []}
              getOptionLabel={(option) => `${option.name} (${option.rollNumber})`}
              onChange={handleStudentChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Student"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            {selectedStudent && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={selectedStudent.name || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Roll Number"
                      fullWidth
                      value={selectedStudent.rollNumber || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      value={selectedStudent.dob ? new Date(selectedStudent.dob).toISOString().split('T')[0] : ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Mobile"
                      fullWidth
                      value={selectedStudent.mobile || ''}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Blood Group</InputLabel>
                      <Select
                        name="bloodGroup"
                        value={cardSettings.bloodGroup}
                        onChange={handleSettingsChange}
                        label="Blood Group"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                          <MenuItem key={group} value={group}>{group}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        sx={{ flexGrow: 1 }}
                      >
                        Upload Photo
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handlePhotoUpload} />
                      </Button>
                      <IconButton 
                        color="primary" 
                        onClick={openWebcam}
                        title="Take photo with webcam"
                      >
                        <CameraAltIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              2. Card Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="College Name"
                  name="collegeName"
                  value={cardSettings.collegeName}
                  onChange={handleSettingsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="College Address"
                  name="collegeAddress"
                  value={cardSettings.collegeAddress}
                  onChange={handleSettingsChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={cardSettings.issueDate}
                  onChange={handleSettingsChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={cardSettings.expiryDate}
                  onChange={handleSettingsChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload College Logo
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleLogoUpload} />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Signature
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleSignatureUpload} />
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>

          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              3. Generate ID Card
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={downloadAsPDF}
                  disabled={!selectedStudent || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save as PDF'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<PrintIcon />}
                  onClick={printCard}
                  disabled={!selectedStudent || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Print'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadAsImage}
                  disabled={!selectedStudent || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save as Image'}
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={5}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom align="center">
              ID Card Preview
            </Typography>
            <PreviewContainer>
              {selectedStudent ? (
                <Box ref={cardRef}>
                  <IDCard 
                    student={studentWithDepartmentAndCourse}
                    collegeName={cardSettings.collegeName}
                    collegeAddress={cardSettings.collegeAddress}
                    logoUrl={cardSettings.logoUrl}
                    issueDate={cardSettings.issueDate}
                    expiryDate={cardSettings.expiryDate}
                    signature={cardSettings.signature}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary" align="center">
                  Select a student to preview ID card
                </Typography>
              )}
            </PreviewContainer>
          </StyledPaper>
        </Grid>
      </Grid>

      <Dialog open={webcamOpen} onClose={() => setWebcamOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Take Photo
          <IconButton
            aria-label="close"
            onClick={() => setWebcamOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <WebcamContainer>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={{
                width: 400,
                height: 300,
                facingMode: "user"
              }}
            />
          </WebcamContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWebcamOpen(false)}>Cancel</Button>
          <Button onClick={capturePhoto} variant="contained" startIcon={<PhotoCameraIcon />}>
            Capture
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IDCardGenerator; 