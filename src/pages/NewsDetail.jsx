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
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import { showErrorToast } from "../utils/toast";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching news with ID:", id);
        
        // Fetch all news first
        const allNewsResponse = await api.public.getNews();
        console.log("All news response:", allNewsResponse);
        
        // Extract news array from response
        let allNews = [];
        if (Array.isArray(allNewsResponse)) {
          allNews = allNewsResponse;
        } else if (allNewsResponse?.data && Array.isArray(allNewsResponse.data)) {
          allNews = allNewsResponse.data;
        }
        
        console.log("Processed news:", allNews);
        
        // Find the specific news item by ID
        const newsData = allNews.find(n => n._id === id);
        console.log("Found news item:", newsData);
        
        if (newsData) {
          setNewsItem(newsData);
          
          // Get related news (recent ones)
          const related = allNews
            .filter(n => n._id !== id)
            .slice(0, 3);
          setRelatedNews(related);
        } else {
          console.error("News item not found with ID:", id);
          showErrorToast("News item not found");
        }
      } catch (error) {
        console.error("Error fetching news details:", error);
        showErrorToast("Failed to load news details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetails();
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

  if (!newsItem) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" color="error" align="center">
          News item not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/news')}
          >
            Back to News
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
        <MuiLink component={Link} to="/news" color="inherit">
          News
        </MuiLink>
        <Typography color="text.primary">{newsItem.title}</Typography>
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
            {/* News Image */}
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="400"
                image={newsItem.fileUrl || newsItem.thumbnailUrl || 'https://source.unsplash.com/random?news'}
                alt={newsItem.title}
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
                  label="News" 
                  color="primary" 
                  size="small" 
                  icon={<NewspaperIcon />}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
                  {newsItem.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* News Details */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body1">
                      {formatDate(newsItem.uploadedAt || newsItem.createdAt)}
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

              {/* News Content */}
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {newsItem.description}
              </Typography>

              {/* Attachment if available */}
              {newsItem.fileUrl && newsItem.fileUrl !== newsItem.thumbnailUrl && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Attachment
                  </Typography>
                  <Button 
                    variant="outlined" 
                    href={newsItem.fileUrl} 
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
                  to="/news"
                >
                  Back to News
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: newsItem.title,
                        text: newsItem.description.substring(0, 100) + '...',
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
          {/* Related News */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Related News
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {relatedNews.length > 0 ? (
              relatedNews.map((relatedItem) => (
                <Card 
                  key={relatedItem._id} 
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
                  to={`/news/${relatedItem._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" color="text.primary" gutterBottom>
                      {relatedItem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(relatedItem.uploadedAt || relatedItem.createdAt)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No related news found.
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
                <MuiLink component={Link} to="/news">
                  All News
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/events">
                  Upcoming Events
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/announcements">
                  Announcements
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

export default NewsDetail; 