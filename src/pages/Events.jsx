import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Pagination,
  Skeleton,
  Paper,
  TextField,
  InputAdornment,
  CardMedia,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import api from '../services/api';
import { showErrorToast } from '../utils/toast';

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/free-time-students-bachelor-s-campus-life-rhythm-five-friendly-students-are-walking.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  color: '#fff',
  marginBottom: theme.spacing(6),
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const DateChip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 'bold',
  boxShadow: theme.shadows[3],
  zIndex: 1,
}));

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.public.getEvents();
        
        // Extract events from response
        let eventsData = [];
        if (Array.isArray(response)) {
          eventsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          eventsData = response.data;
        }
        
        console.log('Events data:', eventsData);
        
        // Sort by date (newest first)
        const sortedEvents = eventsData.sort((a, b) => 
          new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)
        );
        
        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        showErrorToast('Failed to load events');
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
    setPage(1);
  }, [searchQuery, events]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (page - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <PageBanner>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            College Events
          </Typography>
          <Typography variant="h6">
            Discover upcoming events, workshops, and activities at our college
          </Typography>
        </Container>
      </PageBanner>

      <Container sx={{ mb: 8 }}>
        {/* Search Bar */}
        <Paper 
          component="form" 
          sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center' }}
          elevation={3}
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            fullWidth
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {loading ? (
          // Loading skeletons
          <Grid container spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="text" height={20} width="50%" />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredEvents.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {paginatedEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <EventCard elevation={3}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.fileUrl || event.thumbnailUrl || '/images/image-4.jpg'}
                        alt={event.title}
                      />
                      <DateChip>
                        {new Date(event.uploadedAt || event.createdAt).getDate()} {' '}
                        {new Date(event.uploadedAt || event.createdAt).toLocaleString('default', { month: 'short' })}
                      </DateChip>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {event.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.uploadedAt || event.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(event.uploadedAt || event.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location || 'College Campus'}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body2" paragraph sx={{ mb: 3 }}>
                        {event.description?.substring(0, 100)}
                        {event.description?.length > 100 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          component={Link}
                          to={`/events/${event._id}`}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </EventCard>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try a different search term' : 'Check back later for upcoming events'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Events; 