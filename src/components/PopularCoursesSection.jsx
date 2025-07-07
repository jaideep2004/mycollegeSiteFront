import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Tabs, 
  Tab, 
  useTheme, 
  styled,
  Chip,
  Skeleton,
  Avatar
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';

// Main section wrapper
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  background: '#f8f9fa',
}));

// Container with z-index to appear above background elements
const SectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

// Section title with gradient underline
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
}));

// Section subtitle
const SectionSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  opacity: 0.8,
  maxWidth: '800px',
}));

// Custom styled tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 'auto',
    padding: theme.spacing(1, 2),
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

// Course card with hover effect
const CourseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
    '& .course-image': {
      transform: 'scale(1.05)',
    },
  },
}));

// Course image with zoom effect
const CourseImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    transition: 'transform 0.5s ease',
  },
}));

// Category chip
const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontWeight: 600,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

// Course meta info
const CourseMetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '& svg': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
}));

// Course price tag
const PriceTag = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
}));

// Background shape
const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.04,
  zIndex: 1,
}));

// View all button
const ViewAllButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  borderRadius: theme.spacing(5),
  fontWeight: 600,
  boxShadow: '0 5px 15px rgba(93, 211, 158, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 20px rgba(93, 211, 158, 0.4)',
  },
}));

const PopularCoursesSection = ({ courses = [], departments = [], loading = false }) => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [tabValue, setTabValue] = useState(0);
  
  // Animation for section elements when they come into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fallback images for courses without thumbnails
  const fallbackImages = [
    '/images/a2.jpg',
    '/images/a3.jpg',
    '/images/a5.jpg',
    '/images/a7.jpg',
    '/images/zx1.jpg',
    '/images/zx2.jpg',
    '/images/zx3.jpg',
    '/images/zx4.jpg',
  ];

  return (
    <SectionWrapper>
      {/* Background shapes */}
      <BackgroundShape 
        sx={{ 
          top: '5%', 
          right: '10%', 
          width: '300px', 
          height: '300px',
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%235dd39e' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} 
      />
      <BackgroundShape 
        sx={{ 
          bottom: '5%', 
          left: '5%', 
          width: '200px', 
          height: '200px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: theme.palette.primary.main,
          filter: 'blur(80px)',
        }} 
      />

      <SectionContainer maxWidth="lg">
        <Box textAlign="center" mb={4}>
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <SectionTitle variant="h3" gutterBottom>
              Popular Courses
            </SectionTitle>
            <SectionSubtitle variant="h6" sx={{ mx: 'auto' }}>
              Discover our most sought-after courses designed to help you excel in your academic journey
            </SectionSubtitle>
          </motion.div>
        </Box>

        {/* Course Category Tabs */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
          }}
        >
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            centered={!theme.breakpoints.down('md')}
          >
            <Tab label="All Categories" />
            {Array.isArray(departments) && departments.slice(0, 5).map((dept, index) => (
              <Tab key={dept._id || index} label={dept.name} />
            ))}
          </StyledTabs>
        </motion.div>

        <Grid container spacing={4}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', borderRadius: 4 }}>
                  <Skeleton variant="rectangular" height={220} />
                  <CardContent>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : Array.isArray(courses) && courses.length > 0 ? (
            // Actual courses
            courses
              .filter(course => 
                tabValue === 0 || 
                (course.departmentId && course.departmentId._id === departments[tabValue - 1]?._id)
              )
              .slice(0, 4)
              .map((course, index) => (
                <Grid item xs={12} sm={6} md={3} key={course._id || index}>
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
                          delay: 0.3 + index * 0.1 
                        } 
                      }
                    }}
                  >
                    <CourseCard>
                      <CourseImage
                        className="course-image"
                        component="img"
                        image={course.thumbnailUrl || course.fileUrl || fallbackImages[index % fallbackImages.length]}
                        alt={course.name}
                      />
                      <CategoryChip 
                        label={course.departmentId?.name || "Department"} 
                        size="small"
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                          {course.name}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <CourseMetaInfo>
                              <AccessTimeIcon /> 
                              <Typography variant="body2" component="span" ml={0.5}>
                                {course.duration || "4 Months"}
                              </Typography>
                            </CourseMetaInfo>
                          </Grid>
                          <Grid item xs={6}>
                            <CourseMetaInfo>
                              <PersonIcon /> 
                              <Typography variant="body2" component="span" ml={0.5}>
                                {course.students || "120"} Students
                              </Typography>
                            </CourseMetaInfo>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon 
                              key={i} 
                              sx={{ 
                                fontSize: '1rem', 
                                color: i < (course.rating || 4) ? '#FFD700' : '#e0e0e0' 
                              }} 
                            />
                          ))}
                          <Typography variant="body2" component="span" ml={0.5} color="text.secondary">
                            ({course.reviews || "24"})
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <PriceTag variant="h6">
                            ₹{course.feeStructure?.fullFee?.toLocaleString() || "Free"}
                          </PriceTag>
                          <Button 
                            variant="contained" 
                            size="small" 
                            component={RouterLink} 
                            to={`/courses/${course._id}`}
                            sx={{ 
                              borderRadius: '20px',
                              boxShadow: 'none',
                              '&:hover': { boxShadow: '0 5px 10px rgba(0,0,0,0.1)' }
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </CardContent>
                    </CourseCard>
                  </motion.div>
                </Grid>
              ))
          ) : (
            // Empty state
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No courses available at the moment.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
            }}
          >
            <ViewAllButton
              variant="contained"
              size="large"
              component={RouterLink}
              to="/courses"
              endIcon={<ArrowForwardIcon />}
            >
              View All Courses
            </ViewAllButton>
          </motion.div>
        </Box>
      </SectionContainer>
    </SectionWrapper>
  );
};

export default PopularCoursesSection; 