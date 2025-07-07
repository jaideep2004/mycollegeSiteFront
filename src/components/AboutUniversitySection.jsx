import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import ComputerIcon from '@mui/icons-material/Computer';

// Styled components
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
}));

const SectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(0, 3),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  color: '#333333',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(4),
  borderRadius: '10px',
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0 10px 20px rgba(93, 211, 158, 0.2)',
}));

const StatsNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: '#ffffff',
}));

const StatsText = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: '#ffffff',
}));

const ImageCard = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: '10px',
  height: '100%',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  border: '4px solid #fff',
}));

const CardImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const ImageGridContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
  '& .MuiGrid-item': {
    display: 'flex',
  },
  gap: 0,
  marginTop: 0,
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(4),
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  '& svg': {
    fontSize: '2rem',
  },
}));

const FeatureContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const FeatureNumber = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: '#333333',
}));

const FeatureDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const ReadMoreButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '50px',
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  boxShadow: '0 5px 15px rgba(93, 211, 158, 0.2)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 8px 20px rgba(93, 211, 158, 0.3)',
  },
}));

const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.05,
  zIndex: 1,
}));

// Floating educational element
const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.primary.main,
  opacity: 0.25,
  zIndex: 1,
  transition: 'transform 0.3s ease',
}));

const AboutUniversitySection = () => {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const floatingElementsRef = useRef([]);

  // Educational elements with different sizes, positions, and icons
  const floatingElements = [
    { 
      icon: <SchoolIcon />, 
      size: 60,
      position: { top: '15%', left: '5%' }, 
      rotation: 15,
      opacity: 0.25,
    },
    { 
      icon: <MenuBookIcon />, 
      size: 50,
      position: { top: '70%', right: '8%' }, 
      rotation: -10,
      opacity: 0.22,
    },
    { 
      icon: <CalculateIcon />, 
      size: 45,
      position: { top: '40%', left: '15%' }, 
      rotation: 5,
      opacity: 0.2,
    },
    { 
      icon: <ComputerIcon />, 
      size: 55,
      position: { bottom: '20%', left: '10%' }, 
      rotation: -5,
      opacity: 0.22,
    },
  ];

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply parallax effect to floating elements
  useEffect(() => {
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        const speed = 0.05 * (index % 3 + 1);
        const direction = index % 2 === 0 ? 1 : -1;
        el.style.transform = `translate(${scrollY * speed * direction}px, ${scrollY * speed}px) rotate(${floatingElements[index].rotation}deg)`;
      }
    });
  }, [scrollY, floatingElements]);

  return (
    <SectionWrapper ref={sectionRef}>
      {/* Background educational elements */}
      <BackgroundShape 
        sx={{ 
          top: '10%', 
          left: '5%', 
          width: '200px', 
          height: '200px',
          borderRadius: '50%',
          background: theme.palette.primary.main,
          filter: 'blur(80px)',
          opacity: 0.15,
        }} 
      />
      <BackgroundShape 
        sx={{ 
          bottom: '10%', 
          right: '5%', 
          width: '150px', 
          height: '150px',
          borderRadius: '50%',
          background: theme.palette.primary.dark,
          filter: 'blur(60px)',
          opacity: 0.15,
        }} 
      />

      {/* Floating educational elements */}
      {floatingElements.map((element, index) => (
        <FloatingElement
          key={index}
          ref={el => floatingElementsRef.current[index] = el}
          sx={{
            ...element.position,
            fontSize: element.size,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.icon}
        </FloatingElement>
      ))}

      <SectionContainer maxWidth="lg">
        <Grid container spacing={0}>
          <Grid item xs={12} md={6} sx={{ pr: { md: 3 } }}>
            <ImageGridContainer container spacing={1}>
              <Grid item xs={12} style={{alignItems: 'center'}}>
                <ImageCard sx={{ height: '420px', width: '100%', marginBottom: 1 }}>
                  <CardImage 
                    src="/images/52355.jpg" 
                    alt="University Building"    
                  />
                </ImageCard> 
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingRight: 0.5 }}>
                <StatsCard>
                  <StatsNumber variant="h2">25+</StatsNumber>
                  <StatsText variant="body1">Years of Experience</StatsText>
                </StatsCard>
              </Grid>
              <Grid item xs={12} md={6} sx={{ paddingLeft: 0.5 }}>
                <ImageCard sx={{ height: '100%', minHeight: '180px' }}>
                  <CardImage 
                    src="/images/a3.jpg" 
                    alt="Student" 
                  />
                </ImageCard>
              </Grid>
            </ImageGridContainer>
          </Grid>

          <Grid item xs={12} md={6} sx={{ pl: { md: 3 } }}>
            <SectionSubtitle variant="subtitle1">
              <SchoolIcon /> About Our University
            </SectionSubtitle>
            <SectionTitle variant="h2">
              A Few Words About the University
            </SectionTitle>
            
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              Our community is being called to reimagine the future. As the only university 
              where a renowned design school comes together with premier colleges, we 
              are making learning more relevant and transformational.
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
              We are proud to offer top range in employment services such and asset payroll and benefits 
              administration management and assistance with global business range ployment employer 
              readings from religious texts or literature are also commonly inc compliance.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6}>
                <FeatureItem>
                  <FeatureIcon>
                    <SchoolIcon />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureNumber variant="h6">01</FeatureNumber>
                    <FeatureTitle variant="h6">Doctoral Degrees</FeatureTitle>
                    <FeatureDescription variant="body2">
                      consectetur adipiscing elit sed do eiusmod tem incid idunt.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FeatureItem>
                  <FeatureIcon>
                    <PublicIcon />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureNumber variant="h6">02</FeatureNumber>
                    <FeatureTitle variant="h6">Global Students</FeatureTitle>
                    <FeatureDescription variant="body2">
                      consectetur adipiscing elit sed do eiusmod tem incid idunt.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              </Grid>
            </Grid>
            
            <ReadMoreButton 
              variant="contained" 
              endIcon={<ArrowForwardIcon />}
            >
              Read More
            </ReadMoreButton>
          </Grid>
        </Grid>
      </SectionContainer>
    </SectionWrapper>
  );
};

export default AboutUniversitySection; 