import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, useTheme, styled } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Main section wrapper
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('/images/book-with-green-board-background.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  color: '#fff',
}));

// Container with z-index to appear above background elements
const SectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

// Stat card
const StatCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    '& .stat-icon': {
      transform: 'scale(1.1) rotate(10deg)',
      background: 'rgba(93, 211, 158, 0.3)',
    },
  },
}));

// Stat icon
const StatIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'rgba(93, 211, 158, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: 40,
    color: theme.palette.primary.main,
  },
}));

// Stat number
const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(45deg, #fff, #5dd39e)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

// Stat label
const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.9)',
}));

// Background shape
const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.1,
  zIndex: 1,
}));

// Counter animation hook
const useCounter = (end, start = 0, duration = 2) => {
  const [count, setCount] = useState(start);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * (end - start) + start));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (inView) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, start, duration, inView]);
  
  return { count, ref };
};

const StatsCounterSection = () => {
  const theme = useTheme();
  const controls = useAnimation();
  const [sectionRef, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const stats = [
    { icon: <PersonIcon />, count: 5000, suffix: '+', label: 'Students' },
    { icon: <SchoolIcon />, count: 200, suffix: '+', label: 'Courses' },
    { icon: <BookIcon />, count: 50, suffix: '+', label: 'Faculty Members' },
    { icon: <CheckCircleIcon />, count: 95, suffix: '%', label: 'Success Rate' },
  ];
  
  return (
    <SectionWrapper ref={sectionRef}>
      {/* Background shapes */}
      <BackgroundShape 
        sx={{ 
          top: '10%', 
          left: '5%', 
          width: '200px', 
          height: '200px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: theme.palette.primary.main,
          filter: 'blur(60px)',
        }} 
      />
      <BackgroundShape 
        sx={{ 
          bottom: '10%', 
          right: '5%', 
          width: '300px', 
          height: '300px',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: theme.palette.primary.main,
          filter: 'blur(80px)',
        }} 
      />
      
      <SectionContainer maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => {
            const { count, ref } = useCounter(stat.count);
            
            return (
              <Grid item xs={6} md={3} key={index}>
                <StatCard
                  ref={ref}
                  initial="hidden"
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { 
                        duration: 0.6,
                        delay: index * 0.2 
                      } 
                    }
                  }}
                >
                  <StatIcon className="stat-icon">
                    {stat.icon}
                  </StatIcon>
                  <StatNumber variant="h2">
                    {count}{stat.suffix}
                  </StatNumber>
                  <StatLabel variant="h6">
                    {stat.label}
                  </StatLabel>
                </StatCard>
              </Grid>
            );
          })}
        </Grid>
      </SectionContainer>
    </SectionWrapper>
  );
};

export default StatsCounterSection; 