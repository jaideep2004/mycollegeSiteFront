import React, { useEffect, useRef } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme, styled } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Main section wrapper
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #003b29 0%, #002419 100%)',
  color: '#fff',
}));

// Container with z-index to appear above background elements
const SectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

// Section title with gradient text
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
}));

// Section subtitle
const SectionSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  // opacity: 0.9,
  // maxWidth: '800px',
}));

// Feature card with hover effect
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

// Icon container
const IconContainer = styled(Box)(({ theme }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #5dd39e 0%, #3ca777 100%)',
  fontSize: '32px',
  color: '#fff',
}));

// Feature title
const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: '#fff',
}));

// Feature description
const FeatureDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
}));

// Background shape
const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.1,
  zIndex: 1,
}));

// Floating educational element
const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.primary.light,
  opacity: 0.15,
  zIndex: 1,
  transition: 'transform 0.3s ease',
}));

const WhyChooseUsSection = () => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const sectionRef = useRef(null);
  const floatingElementsRef = useRef([]);

  // Animation for section elements when they come into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Floating animation for educational elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      
      const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      floatingElementsRef.current.forEach(element => {
        if (!element) return;
        element.style.transform = `translate(${x * 20}px, ${y * 20}px) rotate(${element.dataset.rotation}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Educational elements with different sizes, positions, and icons
  const floatingElements = [
    { 
      icon: '🎓', 
      size: 60, 
      position: { top: '15%', left: '5%' }, 
      rotation: 15,
    },
    { 
      icon: '📚', 
      size: 50, 
      position: { top: '70%', right: '8%' }, 
      rotation: -10,
    },
    { 
      icon: '🔬', 
      size: 45, 
      position: { top: '40%', left: '15%' }, 
      rotation: 5,
    },
    { 
      icon: '💻', 
      size: 55, 
      position: { bottom: '20%', left: '10%' }, 
      rotation: -5,
    },
  ];

  // Features data
  const features = [
    {
      icon: <SchoolIcon fontSize="large" />,
      title: "Skilled Teachers",
      description: "Our faculty comprises highly qualified educators with extensive experience in their respective fields, dedicated to providing exceptional education."
    },
    {
      icon: <AttachMoneyIcon fontSize="large" />,
      title: "Affordable Courses",
      description: "We offer competitive tuition rates and various financial aid options to ensure quality education remains accessible to all students."
    },
    {
      icon: <AutoGraphIcon fontSize="large" />,
      title: "Efficient & Flexible",
      description: "Our innovative learning approaches and flexible scheduling options accommodate diverse student needs and learning styles."
    }
  ];

  return (
    <SectionWrapper ref={sectionRef}>
      {/* Background shapes */}
      <BackgroundShape 
        sx={{ 
          top: '10%', 
          left: '5%', 
          width: '300px', 
          height: '300px',
          borderRadius: '50%',
          background: '#5dd39e',
          filter: 'blur(100px)',
        }} 
      />
      <BackgroundShape 
        sx={{ 
          bottom: '10%', 
          right: '5%', 
          width: '250px', 
          height: '250px',
          borderRadius: '50%',
          background: '#3ca777',
          filter: 'blur(80px)',
        }} 
      />

      {/* Floating educational elements */}
      {floatingElements.map((element, index) => (
        <FloatingElement
          key={index}
          ref={el => floatingElementsRef.current[index] = el}
          data-rotation={element.rotation}
          sx={{
            ...element.position,
            fontSize: element.size,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.icon}
        </FloatingElement>
      ))}

      <SectionContainer maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <SectionTitle variant="h2" gutterBottom>
              Why Choose Us ?
            </SectionTitle>
            <SectionSubtitle variant="h6">
              Discover why our institution stands out with exceptional educational opportunities, 
              dedicated faculty, and a supportive learning environment designed for student success.
            </SectionSubtitle>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 30 },
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
                <FeatureCard>
                  <CardContent sx={{ p: 4 }}>
                    <IconContainer>
                      {feature.icon}
                    </IconContainer>
                    <FeatureTitle variant="h5">
                      {feature.title}
                    </FeatureTitle>
                    <FeatureDescription variant="body1">
                      {feature.description}
                    </FeatureDescription>
                  </CardContent>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </SectionWrapper>
  );
};

export default WhyChooseUsSection; 