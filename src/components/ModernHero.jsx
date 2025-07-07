import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ParticlesBackground from './ParticlesBackground';
import FloatingElements from './FloatingElements';

// Performance optimization
const optimizeAnimation = (callback) => {
  let ticking = false;
  return (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(e);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  minHeight: '700px',
  width: '100%',
  // overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  [theme.breakpoints.down('md')]: {
    minHeight: '600px',
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'left',
  maxWidth: '1350px',
  width: '100%',
  padding: theme.spacing(0, 3),
}));

const AnimatedHeading = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '3px',
    bottom: '-5px',
    left: 0,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    transformOrigin: 'bottom right',
    transition: 'transform 0.5s ease-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '4rem',
  lineHeight: 1.1,
  marginBottom: theme.spacing(3),
  textTransform: 'capitalize',
  background: `linear-gradient(135deg, #082819 0%, #5dd39e 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const AnimatedUnderline = styled(Box)(({ theme, width = '60px' }) => ({
  height: '3px',
  width: width,
  background: theme.palette.primary.main,
  position: 'relative',
  overflow: 'hidden',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: theme.palette.primary.light,
    left: '-100%',
    animation: 'slide-right 2s ease-in-out infinite',
  },
  '@keyframes slide-right': {
    '0%': {
      left: '-100%',
    },
    '100%': {
      left: '100%',
    },
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  marginBottom: theme.spacing(5),
  maxWidth: '600px',
  lineHeight: 1.6,
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const HeroButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  marginRight: theme.spacing(2),
  boxShadow: '0 10px 20px rgba(93, 211, 158, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 30px rgba(93, 211, 158, 0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '500px',
  width: '100%',
  marginTop: theme.spacing(5),
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    backgroundColor: '#ffffff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: '5px',
  top: '5px',
  bottom: '5px',
  borderRadius: '50px',
  minWidth: '50px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(1),
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

const HeroImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const HeroImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-15px',
    left: '-15px',
    right: '15px',
    bottom: '15px',
    border: '2px solid rgba(93, 211, 158, 0.3)',
    borderRadius: '20px',
    zIndex: 1,
    animation: 'border-pulse 4s ease-in-out infinite alternate',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '15px',
    left: '15px',
    right: '-15px',
    bottom: '-15px',
    border: '2px solid rgba(8, 40, 25, 0.2)',
    borderRadius: '20px',
    zIndex: 1,
    animation: 'border-pulse 4s ease-in-out 2s infinite alternate',
  },
  '@keyframes border-pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.3,
    },
    '100%': {
      transform: 'scale(1.05)',
      opacity: 0.7,
    },
  },
}));

const HeroImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: '566px',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  animation: 'float 6s ease-in-out infinite',
  position: 'relative',
  zIndex: 2,
  transition: 'all 0.3s ease',
  filter: 'brightness(1.02) contrast(1.05)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.01)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    filter: 'brightness(1.05) contrast(1.08)',
  },
  '@keyframes float': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
    '100%': {
      transform: 'translateY(0px)',
    },
  },
}));

const ImageBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  right: 0,
  zIndex: 1,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CircleEffect = styled(Box)(({ theme, color, size, delay, duration }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color}50, ${color}30)`,
  animation: `pulseAndRotate ${duration}s ease-in-out ${delay}s infinite alternate`,
  '@keyframes pulseAndRotate': {
    '0%': {
      transform: 'scale(1) rotate(0deg)',
      opacity: 0.3,
    },
    '100%': {
      transform: 'scale(1.2) rotate(15deg)',
      opacity: 0.7,
    },
  },
}));

const ShapeEffect = styled(Box)(({ theme, color, size, delay, shape, duration }) => ({
  position: 'absolute',
  width: size,
  height: size,
  background: `linear-gradient(135deg, ${color}40, ${color}20)`,
  borderRadius: shape === 'square' ? '15%' : shape === 'triangle' ? '0' : '50%',
  clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
  animation: `floatAndRotate ${duration}s ease-in-out ${delay}s infinite alternate`,
  '@keyframes floatAndRotate': {
    '0%': {
      transform: 'translateY(0px) rotate(0deg)',
      opacity: 0.2,
    },
    '100%': {
      transform: 'translateY(-20px) rotate(15deg)',
      opacity: 0.6,
    },
  },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0.8,
  zIndex: 0,
  background: `
    radial-gradient(circle at 0% 0%, rgba(93, 211, 158, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(93, 211, 158, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(8, 40, 25, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(8, 40, 25, 0.1) 0%, transparent 50%)
  `,
}));

const FloatingDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  opacity: 0.5,
  zIndex: 0,
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.4,
    background: `
      radial-gradient(circle at 25% 25%, ${theme.palette.primary.light} 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, ${theme.palette.primary.dark} 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    animation: 'floating-dots 60s linear infinite',
  },
  '&::after': {
    top: '20px',
    left: '20px',
    animationDirection: 'reverse',
    animationDuration: '90s',
  },
  '@keyframes floating-dots': {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(-40px)',
    },
  },
}));

const EducationalSymbols = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  opacity: 0.03,
  zIndex: 0,
  background: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%235dd39e' d='M30,20 Q45,0 60,20 L80,40 L60,60 L40,40 Z'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23082819' stroke-width='2' fill='none' /%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Cpath fill='%235dd39e' d='M50,15 L85,85 L15,85 Z'/%3E%3C/svg%3E")
  `,
  backgroundSize: '80px 80px, 120px 120px, 100px 100px',
  backgroundPosition: '0 0, 40px 40px, 80px 80px',
  animation: 'floating-symbols 120s linear infinite',
  '@keyframes floating-symbols': {
    '0%': {
      backgroundPosition: '0 0, 40px 40px, 80px 80px',
    },
    '100%': {
      backgroundPosition: '80px 80px, 120px 120px, 160px 160px',
    },
  },
}));

const ShineEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)',
    transform: 'rotate(30deg)',
    animation: 'shine-effect 8s linear infinite',
  },
  '@keyframes shine-effect': {
    '0%': {
      transform: 'translateX(-100%) rotate(30deg)',
    },
    '100%': {
      transform: 'translateX(100%) rotate(30deg)',
    },
  },
}));

const GlowEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-20px',
  left: '-20px',
  right: '-20px',
  bottom: '-20px',
  borderRadius: '40px',
  background: 'radial-gradient(ellipse at center, rgba(93, 211, 158, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
  opacity: 0.7,
  zIndex: 0,
  animation: 'glow 4s ease-in-out infinite alternate',
  '@keyframes glow': {
    '0%': {
      opacity: 0.5,
      transform: 'scale(1)',
    },
    '100%': {
      opacity: 0.8,
      transform: 'scale(1.05)',
    },
  },
}));

const ModernHero = ({ onSearch }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position for parallax effects
  const handleScroll = useCallback(optimizeAnimation(() => {
    setScrollPosition(window.scrollY);
  }), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  // Calculate parallax transform based on scroll position
  const getParallaxStyle = (factor) => ({
    transform: `translateY(${scrollPosition * factor}px)`,
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <HeroSection>
      {/* Particle Background */}
      {/* <ParticlesBackground /> */}
      
      {/* Gradient Background Effects */}
      <GradientBackground />
      <FloatingDots />
      {/* <EducationalSymbols /> */}
      <ShineEffect />
      
      {/* Floating Educational Elements */}
      <FloatingElements />
      
      <HeroContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7} lg={6}>
            <Box
              sx={{
                animation: 'fadeInUp 1s ease-out',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(40px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
                ...getParallaxStyle(-0.05), // Subtle parallax effect
              }}
            >
              <AnimatedHeading
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  display: 'inline-block',
                  position: 'relative',
                  paddingLeft: '50px',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    width: '40px',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transform: 'translateY(-50%)',
                  },
                }}
              >
                WELCOME TO OUR COLLEGE
              </AnimatedHeading>
              
              <HeroTitle variant="h1" className="gradient-text gpu-accelerated">
                Discover A New Way Of Learning & Growing
              </HeroTitle>
              
              <AnimatedUnderline width="120px" />
              
              <HeroSubtitle variant="body1">
                Our college offers a transformative educational experience
                focused on academic excellence, innovation, and preparing
                students for successful careers in a rapidly changing world.
              </HeroSubtitle>
              
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                mb: 4,
                [theme.breakpoints.down('sm')]: {
                  flexDirection: 'column',
                },
              }}>
                <HeroButton
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/courses"
                  endIcon={<ArrowForwardIcon />}
                  className="animate-pulse"
                >
                  Explore Courses
                </HeroButton>
                
                <HeroButton
                  variant="outlined"
                  component={RouterLink}
                  to="/register"
                >
                  Apply Now
                </HeroButton>
              </Box>
              
              <SearchBox>
                <form onSubmit={handleSearch}>
                  <SearchInput
                    fullWidth
                    placeholder="Search for courses, programs..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <SearchButton type="submit">
                    {isMobile ? <ArrowForwardIcon /> : 'Search'}
                  </SearchButton>
                </form>
              </SearchBox>
              
             
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5} lg={6}>
            <HeroImageContainer style={getParallaxStyle(0.08)}>
              <ImageBackground>
                <ShapeEffect 
                  color={theme.palette.primary.light} 
                  size="150px" 
                  delay={0.3} 
                  duration={9}
                  shape="square"
                  sx={{ 
                    top: '30%', 
                    right: '5%',
                    transform: 'rotate(45deg)',
                    filter: 'blur(25px)',
                  }}
                />
                <ShapeEffect 
                  color={theme.palette.primary.dark} 
                  size="100px" 
                  delay={0.7} 
                  duration={6}
                  shape="triangle"
                  sx={{ 
                    bottom: '20%', 
                    left: '10%',
                    filter: 'blur(20px)',
                  }}
                />
                <GlowEffect />
              </ImageBackground>
              <HeroImageWrapper>
                <HeroImage 
                  src="/images/zx1.jpg" 
                  alt="Students learning"
                  loading="eager" // Prioritize image loading
                />
              </HeroImageWrapper>
            </HeroImageContainer>
          </Grid>
        </Grid>
      </HeroContent>
      
      {/* Wave shape at the bottom */}
      
    </HeroSection>
  );   
};

export default ModernHero; 