import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  useTheme, 
  styled,
  Divider,
  Avatar,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NewspaperIcon from '@mui/icons-material/Newspaper';

// Main section wrapper
const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  overflow: 'hidden',
  background: '#ffffff',
}));

// Container with z-index to appear above background elements
const SectionContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

// Section title with underline
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  }
}));

// Announcement card
const AnnouncementCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
}));

// Event card
const EventCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  display: 'flex',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
}));

// Event date box
const EventDateBox = styled(Box)(({ theme }) => ({
  width: 90,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(2, 1),
}));

// View all button
const ViewAllButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'translateX(3px)',
  },
}));

// Date chip
const DateChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(93, 211, 158, 0.1)',
  color: theme.palette.primary.main,
  fontWeight: 500,
  marginRight: theme.spacing(1),
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  },
}));

// Background shape
const BackgroundShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  opacity: 0.04,
  zIndex: 1,
}));

// Empty state container
const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  border: '1px dashed rgba(0, 0, 0, 0.1)',
}));

// News card
const NewsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
}));

// Custom styled tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 4,
    borderRadius: 2,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.1rem',
    minWidth: 'auto',
    padding: theme.spacing(1.5, 3),
    transition: 'all 0.3s ease',
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0, 0.5),
    '&:hover': {
      backgroundColor: 'rgba(93, 211, 158, 0.08)',
      color: theme.palette.primary.main,
    },
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(93, 211, 158, 0.1)',
    fontWeight: 700,
  },
}));

// Custom styled tab
const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.3s ease',
  },
  '&.Mui-selected .MuiSvgIcon-root': {
    transform: 'scale(1.2)',
    color: theme.palette.primary.main,
  },
}));

const NewsEventsSection = ({ announcements = [], events = [], news = [] }) => {
  const theme = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [tabValue, setTabValue] = useState(0);
  
  // Sample data for testing if API doesn't return any
  const sampleNews = [
    {
      _id: 'sample-news-1',
      title: 'College Wins National Award',
      description: 'Our college has been recognized with the prestigious National Education Excellence Award for outstanding achievements in academic innovation and student success.',
      uploadedAt: new Date().toISOString(),
      thumbnailUrl: '/images/zx1.jpg'
    },
    {
      _id: 'sample-news-2',
      title: 'New Research Partnership Announced',
      description: 'The college has established a groundbreaking research partnership with leading industry partners to advance studies in sustainable technology.',
      uploadedAt: new Date().toISOString(),
      thumbnailUrl: '/images/zx2.jpg'
    },
    {
      _id: 'sample-news-3',
      title: 'Campus Expansion Project Begins',
      description: 'Construction has started on our new state-of-the-art campus facilities, including a modern library, research labs, and student recreation center.',
      uploadedAt: new Date().toISOString(),
      thumbnailUrl: '/images/zx3.jpg'
    }
  ];
  
  // Use sample data if no news is provided
  const displayNews = news && news.length > 0 ? news : sampleNews;
  
  // Separate animation controls for each tab
  const announcementControls = useAnimation();
  const eventControls = useAnimation();
  const newsControls = useAnimation();
  
  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
      // Initialize the first tab
      if (tabValue === 0) {
        announcementControls.start('visible');
      } else if (tabValue === 1) {
        eventControls.start('visible');
      } else if (tabValue === 2) {
        newsControls.start('visible');
      }
    }
  }, [controls, inView, tabValue, announcementControls, eventControls, newsControls]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Reset all tab content to hidden
    announcementControls.set('hidden');
    eventControls.set('hidden');
    newsControls.set('hidden');
    
    // Animate the selected tab
    if (newValue === 0) {
      setTimeout(() => announcementControls.start('visible'), 50);
    } else if (newValue === 1) {
      setTimeout(() => eventControls.start('visible'), 50);
    } else if (newValue === 2) {
      setTimeout(() => newsControls.start('visible'), 50);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      formatted: date.toLocaleDateString()
    };
  };

  // Debug data
  console.log("Announcements:", announcements);
  console.log("Events:", events);
  console.log("News:", news);
  console.log("Display News:", displayNews);
  console.log("Current tab:", tabValue);
  
  return (
    <SectionWrapper ref={ref}>
      {/* Background shapes */}
      <BackgroundShape 
        sx={{ 
          top: '5%', 
          left: '5%', 
          width: '300px', 
          height: '300px',
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235dd39e' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} 
      />
      <BackgroundShape 
        sx={{ 
          bottom: '5%', 
          right: '5%', 
          width: '250px', 
          height: '250px',
          background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%235dd39e' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }} 
      />
      
      <SectionContainer maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Latest Updates
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Stay informed with the latest news, announcements, and upcoming events from our college
            </Typography>
          </motion.div>
        </Box>
        
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } }
          }}
        >
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            variant="fullWidth"
          >
            <StyledTab 
              icon={<NotificationsIcon />} 
              label="Announcements" 
              iconPosition="start"
            />
            <StyledTab 
              icon={<EventIcon />} 
              label="Events" 
              iconPosition="start"
            />
            <StyledTab 
              icon={<NewspaperIcon />} 
              label="News" 
              iconPosition="start"
            />
          </StyledTabs>
        </motion.div>
        
        {/* Announcements Tab */}
        <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
          <motion.div
            initial="hidden"
            animate={announcementControls}
            variants={containerVariants}
          >
            <Grid container spacing={4}>
              {announcements && announcements.length > 0 ? (
                announcements.slice(0, 3).map((announcement, index) => {
                  const date = formatDate(announcement.uploadedAt);
                  
                  return (
                    <Grid item xs={12} md={4} key={announcement._id || index}>
                      <motion.div variants={itemVariants}>
                        <AnnouncementCard>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              {announcement.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {announcement.description?.substring(0, 120)}
                              {announcement.description?.length > 120 ? '...' : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <DateChip 
                                icon={<CalendarTodayIcon fontSize="small" />} 
                                label={date.formatted} 
                                size="small" 
                              />
                              <Button 
                                component={RouterLink} 
                                to={`/announcements/${announcement._id}`}
                                color="primary"
                                size="small"
                              >
                                Read More
                              </Button>
                            </Box>
                          </CardContent>
                        </AnnouncementCard>
                      </motion.div>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <EmptyStateContainer>
                    <NotificationsIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      No announcements available
                    </Typography>
                  </EmptyStateContainer>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ViewAllButton 
                component={RouterLink} 
                to="/announcements"
                endIcon={<ArrowForwardIcon />}
              >
                View All Announcements
              </ViewAllButton>
            </Box>
          </motion.div>
        </Box>
        
        {/* Events Tab */}
        <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
          <motion.div
            initial="hidden"
            animate={eventControls}
            variants={containerVariants}
          >
            <Grid container spacing={4}>
              {events && events.length > 0 ? (
                events.slice(0, 3).map((event, index) => {
                  const date = formatDate(event.eventDate || event.uploadedAt);
                  
                  return (
                    <Grid item xs={12} md={4} key={event._id || index}>
                      <motion.div variants={itemVariants}>
                        <EventCard>
                          <EventDateBox>
                            <Typography variant="h4" fontWeight={700}>
                              {date.day}
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {date.month}
                            </Typography>
                          </EventDateBox>
                          
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              {event.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {event.description?.substring(0, 100)}
                              {event.description?.length > 100 ? '...' : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(event.eventDate || event.uploadedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                              <Box sx={{ flexGrow: 1 }} />
                              <Button 
                                component={RouterLink} 
                                to={`/events/${event._id}`}
                                color="primary"
                                size="small"
                              >
                                View Details
                              </Button>
                            </Box>
                          </CardContent>
                        </EventCard>
                      </motion.div>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <EmptyStateContainer>
                    <EventIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      No upcoming events at the moment
                    </Typography>
                  </EmptyStateContainer>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ViewAllButton 
                component={RouterLink} 
                to="/events"
                endIcon={<ArrowForwardIcon />}
              >
                View All Events
              </ViewAllButton>
            </Box>
          </motion.div>
        </Box>
        
        {/* News Tab */}
        <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
          <motion.div
            initial="hidden"
            animate={newsControls}
            variants={containerVariants}
          >
            <Grid container spacing={4}>
              {displayNews && displayNews.length > 0 ? (
                displayNews.slice(0, 3).map((newsItem, index) => {
                  const date = formatDate(newsItem.uploadedAt || newsItem.createdAt);
                  
                  return (
                    <Grid item xs={12} md={4} key={newsItem._id || index}>
                      <motion.div variants={itemVariants}>
                        <NewsCard>
                          {(newsItem.thumbnailUrl || newsItem.fileUrl) && (
                            <Box 
                              sx={{ 
                                height: 200, 
                                backgroundImage: `url(${newsItem.thumbnailUrl || newsItem.fileUrl || '/images/campus2.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }} 
                            />
                          )}
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                              {newsItem.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {newsItem.description?.substring(0, 120)}
                              {newsItem.description?.length > 120 ? '...' : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <DateChip 
                                icon={<CalendarTodayIcon fontSize="small" />} 
                                label={date.formatted} 
                                size="small" 
                              />
                              <Button 
                                component={RouterLink} 
                                to={`/news/${newsItem._id}`}
                                color="primary"
                                size="small"
                              >
                                Read More
                              </Button>
                            </Box>
                          </CardContent>
                        </NewsCard>
                      </motion.div>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <EmptyStateContainer>
                    <NewspaperIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      No news articles available
                    </Typography>
                  </EmptyStateContainer>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ViewAllButton 
                component={RouterLink} 
                to="/news"
                endIcon={<ArrowForwardIcon />}
              >
                View All News
              </ViewAllButton>
            </Box>
          </motion.div>
        </Box>
      </SectionContainer>
    </SectionWrapper>
  );
};

export default NewsEventsSection; 