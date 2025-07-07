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
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../services/api';
import { showErrorToast } from '../utils/toast';

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/book-with-green-board-background.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  color: '#fff',
  marginBottom: theme.spacing(6),
}));

const AnnouncementCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const announcementsPerPage = 6;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await api.public.getAnnouncements();
        
        // Extract announcements from response
        let announcementsData = [];
        if (Array.isArray(response)) {
          announcementsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          announcementsData = response.data;
        }
        
        console.log('Announcements data:', announcementsData);
        
        // Sort by date (newest first)
        const sortedAnnouncements = announcementsData.sort((a, b) => 
          new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)
        );
        
        setAnnouncements(sortedAnnouncements);
        setFilteredAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        showErrorToast('Failed to load announcements');
        setAnnouncements([]);
        setFilteredAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(announcement => 
        announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    }
    setPage(1);
  }, [searchQuery, announcements]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);
  const startIndex = (page - 1) * announcementsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, startIndex + announcementsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Box>
      <PageBanner>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Announcements
          </Typography>
          <Typography variant="h6">
            Stay updated with the latest news and announcements from our college
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
            placeholder="Search announcements..."
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
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={40} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="rectangular" height={100} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredAnnouncements.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {paginatedAnnouncements.map((announcement) => (
                <Grid item xs={12} md={6} key={announcement._id}>
                  <AnnouncementCard elevation={3}>
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {announcement.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(announcement.uploadedAt || announcement.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body1" paragraph>
                        {announcement.description?.substring(0, 200)}
                        {announcement.description?.length > 200 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          component={Link}
                          to={`/announcements/${announcement._id}`}
                        >
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </AnnouncementCard>
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
              No announcements found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchQuery ? 'Try a different search term' : 'Check back later for updates'}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Announcements; 