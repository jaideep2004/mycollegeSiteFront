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
  CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import api from "../services/api";

// Styled components
const PageBanner = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/campus3.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  color: '#fff',
  marginBottom: theme.spacing(6),
}));

const NewsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [page, setPage] = useState(1);
  const newsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.public.getNews();
        console.log('News response:', response);
        
        // Extract news array from response
        let newsData = [];
        if (Array.isArray(response)) {
          newsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          newsData = response.data;
        }
        
        console.log('Processed news:', newsData);
        setNews(newsData);
        setFilteredNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on search query
  useEffect(() => {
    if (news.length > 0) {
      const filtered = news.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    }
    setPage(1);
  }, [searchQuery, news]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (page - 1) * newsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + newsPerPage);

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
            News
          </Typography>
          <Typography variant="h6">
            Stay updated with the latest news and updates from our college
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
            placeholder="Search news..."
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
                    <Skeleton variant="rectangular" height={80} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="rectangular" width={100} height={36} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredNews.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {paginatedNews.map((newsItem) => (
                <Grid item xs={12} md={6} lg={4} key={newsItem._id}>
                  <NewsCard elevation={3}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={newsItem.thumbnailUrl || newsItem.fileUrl || '/images/campus2.jpg'}
                      alt={newsItem.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {newsItem.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(newsItem.uploadedAt || newsItem.createdAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <NewspaperIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            News
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body1" paragraph>
                        {newsItem.description?.substring(0, 150)}
                        {newsItem.description?.length > 150 ? '...' : ''}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                        <Button 
                          variant="contained" 
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          component={Link}
                          to={`/news/${newsItem._id}`}
                        >
                          Read More
                        </Button>
                      </Box>
                    </CardContent>
                  </NewsCard>
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
              No news found
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

export default News; 