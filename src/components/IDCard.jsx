import React from 'react';
import { Box, Typography, Avatar, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CardContainer = styled(Paper)(({ theme }) => ({
  width: '340px',
  height: '520px',
  padding: theme.spacing(2),
  margin: '0 auto',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  backgroundImage: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',
  color: '#fff',
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  position: 'relative',
  zIndex: 1,
}));

const CollegeLogo = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '70px',
  margin: theme.spacing(1, 0),
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  color: '#333',
  marginTop: theme.spacing(1),
  position: 'relative',
  zIndex: 1,
}));

const StudentAvatar = styled(Avatar)(({ theme }) => ({
  width: '120px',
  height: '120px',
  border: '4px solid #ffffff',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  margin: '12px auto',
}));

const CardPatternOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.2) 25%, rgba(75, 0, 130, 0.2) 25%, rgba(75, 0, 130, 0.2) 50%, rgba(138, 43, 226, 0.2) 50%, rgba(138, 43, 226, 0.2) 75%, rgba(75, 0, 130, 0.2) 75%, rgba(75, 0, 130, 0.2))',
  backgroundSize: '20px 20px',
  zIndex: 0,
}));

const CardFooter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  textAlign: 'center',
}));

const DataRow = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const QRCode = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '100px',
  margin: '10px auto',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
}));

const Barcode = styled(Box)(({ theme }) => ({
  width: '80%',
  height: '40px',
  margin: '10px auto',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
}));

const IDCard = ({ student, collegeName, collegeAddress, logoUrl, issueDate, expiryDate, signature }) => {
  return (
    <CardContainer elevation={5}>
      <CardPatternOverlay />
      
      <CardHeader>
        <CollegeLogo component="img" src={logoUrl || '/images/logo.png'} alt="College Logo" />
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {collegeName || "ABC College"}
        </Typography>
        <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 1 }}>
          {collegeAddress || "123 Education Street, Academic City"}
        </Typography>
      </CardHeader>
      
      <StudentAvatar 
        src={student?.profileImage || '/images/team/person1.jpg'} 
        alt={student?.name || "Student Name"} 
      />
      
      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
        {student?.name || "Student Name"}
      </Typography>
      
      <CardContent>
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Roll Number:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{student?.rollNumber || "XX-XXXX"}</Typography>
          </Grid>
        </DataRow>
        
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Department:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{student?.department || "Computer Science"}</Typography>
          </Grid>
        </DataRow>
        
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Course:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{student?.course || "B.Tech"}</Typography>
          </Grid>
        </DataRow>
        
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Date of Birth:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">
              {student?.dob ? new Date(student.dob).toLocaleDateString() : "01/01/2000"}
            </Typography>
          </Grid>
        </DataRow>
        
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Mobile:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{student?.mobile || "9876543210"}</Typography>
          </Grid>
        </DataRow>
        
        <DataRow container>
          <Grid item xs={5}>
            <Typography variant="body2" fontWeight="bold">Blood Group:</Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography variant="body2">{student?.bloodGroup || "O+"}</Typography>
          </Grid>
        </DataRow>
      </CardContent>
      
      <QRCode>
        <Typography variant="caption">QR Code</Typography>
      </QRCode>
      
      <CardFooter>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" display="block">Issue Date: {issueDate || new Date().toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" display="block">Valid Till: {expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
        <Barcode>
          <Typography variant="caption">{student?.rollNumber || "BARCODE"}</Typography>
        </Barcode>
        <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
          Principal's Signature
        </Typography>
      </CardFooter>
    </CardContainer>
  );
};

export default IDCard; 