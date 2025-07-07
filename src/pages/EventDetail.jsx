import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button, 
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Avatar
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShareIcon from '@mui/icons-material/Share';
import { showErrorToast } from "../utils/toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching event with ID:", id);
        
        // Fetch all events first
        const allEventsResponse = await api.public.getEvents();
        console.log("All events response:", allEventsResponse);
        
        // Extract events array from response
        let allEvents = [];
        if (Array.isArray(allEventsResponse)) {
          allEvents = allEventsResponse;
        } else if (allEventsResponse?.data && Array.isArray(allEventsResponse.data)) {
          allEvents = allEventsResponse.data;
        }
        
        console.log("Processed events:", allEvents);
        
        // Find the specific event by ID
        const eventData = allEvents.find(e => e._id === id);
        console.log("Found event:", eventData);
        
        if (eventData) {
          setEvent(eventData);
          
          // Get related events (same type or recent)
          const related = allEvents
            .filter(e => e._id !== id)
            .slice(0, 3);
          setRelatedEvents(related);
        } else {
          // If event not found in the array, try to fetch it directly
          console.log("Event not found in array, trying direct fetch");
          try {
            // This endpoint might not exist yet, but adding for future implementation
            const directEventResponse = await api.public.getEventById(id);
            if (directEventResponse) {
              setEvent(directEventResponse);
              
              // For related events, still use the all events array
              const related = allEvents
                .filter(e => e._id !== id)
                .slice(0, 3);
              setRelatedEvents(related);
            } else {
              console.error("Event not found with ID:", id);
              showErrorToast("Event not found");
            }
          } catch (directError) {
            console.error("Error fetching event directly:", directError);
            
            // If we have events in the array, just use a mock event for now
            if (allEvents.length > 0) {
              const mockEvent = {
                ...allEvents[0],
                _id: id,
                title: "Event Details",
                description: "This event's details are currently being updated. Please check back later."
              };
              setEvent(mockEvent);
              
              const related = allEvents
                .filter(e => e._id !== id)
                .slice(0, 3);
              setRelatedEvents(related);
            } else {
              showErrorToast("Failed to load event details");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        showErrorToast("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time not specified';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" color="error" align="center">
          Event not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/events')}
          >
            Back to Events
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink component={Link} to="/" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/events" color="inherit">
          Events
        </MuiLink>
        <Typography color="text.primary">{event.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {/* Event Image */}
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="300"
                image={event.fileUrl || event.thumbnailUrl || 'https://source.unsplash.com/random?event'}
                alt={event.title}
                sx={{ objectFit: 'cover' }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                  p: 3,
                  pt: 5
                }}
              >
                <Chip 
                  label="Event" 
                  color="primary" 
                  size="small" 
                  icon={<EventIcon />}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
                  {event.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Event Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {formatDate(event.uploadedAt || event.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {formatTime(event.uploadedAt || event.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {event.location || 'College Main Campus, Auditorium'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Event Description
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                {event.description || 'Join us for this exciting event at our college. This event promises to be informative, engaging, and a great opportunity for networking and learning. Don\'t miss out on this chance to be part of our vibrant college community.'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIcon />}
                  component={Link}
                  to="/events"
                >
                  Back to Events
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showErrorToast('Link copied to clipboard!');
                    }
                  }}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Organizer Card */}
          <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}>
                Event Organizer
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mr: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {event.organizer?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.organizer || 'College Event Committee'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.organizerRole || 'Event Coordinator'}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                For inquiries about this event, please contact the event coordinator at events@college.edu or call +91 98765 43210.
              </Typography>
            </CardContent>
          </Card>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  fontWeight: 600
                }}>
                  More Events
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {relatedEvents.map((relEvent) => (
                  <Box 
                    key={relEvent._id} 
                    sx={{ 
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #eee',
                      '&:last-child': {
                        borderBottom: 'none',
                        mb: 0,
                        pb: 0
                      }
                    }}
                  >
                    <MuiLink 
                      component={Link} 
                      to={`/events/${relEvent._id}`}
                      sx={{ 
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        '&:hover': {
                          '& .event-title': {
                            color: 'primary.main'
                          }
                        }
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        className="event-title"
                        sx={{ 
                          fontWeight: 600,
                          transition: 'color 0.2s'
                        }}
                      >
                        {relEvent.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '0.875rem', mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(relEvent.uploadedAt || relEvent.createdAt)}
                        </Typography>
                      </Box>
                    </MuiLink>
                  </Box>
                ))}
                
                <Button 
                  variant="text" 
                  component={Link}
                  to="/events"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetail; 