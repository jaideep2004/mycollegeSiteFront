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
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import { showErrorToast } from "../utils/toast";

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedAnnouncements, setRelatedAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching announcement with ID:", id);
        
        // Fetch all announcements first
        const allAnnouncementsResponse = await api.public.getAnnouncements();
        console.log("All announcements response:", allAnnouncementsResponse);
        
        // Extract announcements array from response
        let allAnnouncements = [];
        if (Array.isArray(allAnnouncementsResponse)) {
          allAnnouncements = allAnnouncementsResponse;
        } else if (allAnnouncementsResponse?.data && Array.isArray(allAnnouncementsResponse.data)) {
          allAnnouncements = allAnnouncementsResponse.data;
        }
        
        console.log("Processed announcements:", allAnnouncements);
        
        // Find the specific announcement by ID
        const announcementData = allAnnouncements.find(a => a._id === id);
        console.log("Found announcement:", announcementData);
        
        if (announcementData) {
          setAnnouncement(announcementData);
          
          // Get related announcements (recent ones)
          const related = allAnnouncements
            .filter(a => a._id !== id)
            .slice(0, 3);
          setRelatedAnnouncements(related);
        } else {
          console.error("Announcement not found with ID:", id);
          showErrorToast("Announcement not found");
        }
      } catch (error) {
        console.error("Error fetching announcement details:", error);
        showErrorToast("Failed to load announcement details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncementDetails();
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!announcement) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" color="error" align="center">
          Announcement not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/announcements')}
          >
            Back to Announcements
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
        <MuiLink component={Link} to="/announcements" color="inherit">
          Announcements
        </MuiLink>
        <Typography color="text.primary">{announcement.title}</Typography>
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
            {/* Announcement Image */}
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="300"
                image={announcement.fileUrl || announcement.thumbnailUrl || 'https://source.unsplash.com/random?announcement'}
                alt={announcement.title}
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
                  label="Announcement" 
                  color="primary" 
                  size="small" 
                  icon={<AnnouncementIcon />}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
                  {announcement.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Announcement Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {formatDate(announcement.uploadedAt || announcement.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      Posted by: Admin
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Announcement Content */}
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {announcement.description}
              </Typography>

              {/* Attachment if available */}
              {announcement.fileUrl && announcement.fileUrl !== announcement.thumbnailUrl && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Attachment
                  </Typography>
                  <Button 
                    variant="outlined" 
                    href={announcement.fileUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Attachment
                  </Button>
                </Box>
              )}

              {/* Share Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBackIcon />}
                  component={Link}
                  to="/announcements"
                >
                  Back to Announcements
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: announcement.title,
                        text: announcement.description.substring(0, 100) + '...',
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
          {/* Related Announcements */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Related Announcements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {relatedAnnouncements.length > 0 ? (
              relatedAnnouncements.map((relatedAnnouncement) => (
                <Card 
                  key={relatedAnnouncement._id} 
                  sx={{ 
                    mb: 2, 
                    boxShadow: 'none', 
                    '&:hover': { 
                      boxShadow: 1,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    } 
                  }}
                  component={Link}
                  to={`/announcements/${relatedAnnouncement._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" color="text.primary" gutterBottom>
                      {relatedAnnouncement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(relatedAnnouncement.uploadedAt || relatedAnnouncement.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No related announcements found.
              </Typography>
            )}
          </Paper>

          {/* Quick Links */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box component="ul" sx={{ pl: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/announcements">
                  All Announcements
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/events">
                  Upcoming Events
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/courses">
                  Course Catalog
                </MuiLink>
              </Box>
              <Box component="li">
                <MuiLink component={Link} to="/contact">
                  Contact Us
                </MuiLink>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnnouncementDetail; 