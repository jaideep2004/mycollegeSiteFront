// src/pages/Department.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const Department = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the DepartmentDetail page
    if (name) {
      navigate(`/department/${name}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [name, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}>
      <CircularProgress />
    </Box>
  );
};

export default Department;

