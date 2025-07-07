import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#333333',
  color: '#fff',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  position: 'relative',
  paddingBottom: theme.spacing(1),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 3,
    backgroundColor: theme.palette.primary.main,
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#ccc',
  textDecoration: 'none',
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-3px)',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const NewsletterButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container>
        <Grid container spacing={4}>
          {/* About College */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 40, mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="div" fontWeight="bold">
                College Portal
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 3 }}>
              Our college is dedicated to providing quality education and creating a nurturing environment for students to excel in their academic and personal growth.
            </Typography>
            <Box>
              <SocialIconButton aria-label="facebook">
                <FacebookIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="twitter">
                <TwitterIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="instagram">
                <InstagramIcon />
              </SocialIconButton>
              <SocialIconButton aria-label="linkedin">
                <LinkedInIcon />
              </SocialIconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterTitle variant="h6">Quick Links</FooterTitle>
            <List dense disablePadding>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/">Home</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/about">About Us</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/courses">Courses</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/gallery">Gallery</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/contact">Contact</FooterLink>
              </ListItem>
            </List>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterTitle variant="h6">Resources</FooterTitle>
            <List dense disablePadding>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/login">Student Login</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink component={RouterLink} to="/register">Admission</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink href="#">Library</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink href="#">Research</FooterLink>
              </ListItem>
              <ListItem disableGutters>
                <FooterLink href="#">Alumni</FooterLink>
              </ListItem>
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <FooterTitle variant="h6">Contact Us</FooterTitle>
            <ContactItem>
              <LocationOnIcon />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                123 Education Street, Academic City, 12345
              </Typography>
            </ContactItem>
            <ContactItem>
              <PhoneIcon />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                +1 (123) 456-7890
              </Typography>
            </ContactItem>
            <ContactItem>
              <EmailIcon />
              <Typography variant="body2" sx={{ color: '#ccc' }}>
                info@collegeportal.edu
              </Typography>
            </ContactItem>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Subscribe to our newsletter
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="Your Email"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#fff',
                    },
                  }}
                />
                <NewsletterButton
                  variant="contained"
                  sx={{ ml: 1 }}
                  endIcon={<SendIcon />}
                >
                  Send
                </NewsletterButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            © {currentYear} College Portal. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
            <FooterLink href="#">Privacy Policy</FooterLink> | 
            <FooterLink href="#" sx={{ mx: 1 }}>Terms of Service</FooterLink> | 
            <FooterLink href="#">Sitemap</FooterLink>
    </Typography>
  </Box>
      </Container>
    </FooterContainer>
);
};

export default Footer;  