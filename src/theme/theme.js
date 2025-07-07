import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#5dd39e',
      light: '#8fe7bc',
      dark: '#3ca173',
      contrastText: '#000000',
    },
    secondary: { 
      main: '#333333',
      light: '#555555',
      dark: '#111111',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    background: { 
      default: '#ffffff',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontWeight: 700,
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: '"Poppins", sans-serif',
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(93, 211, 158, 0.2)',
          },
        },
        contained: {
          backgroundColor: '#5dd39e',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#3ca173',
          },
        },
        outlined: {
          borderColor: '#5dd39e',
          color: '#5dd39e',
          '&:hover': {
            backgroundColor: 'rgba(93, 211, 158, 0.08)',
            borderColor: '#3ca173',
          },
        },
        text: {
          color: '#5dd39e',
          '&:hover': {
            backgroundColor: 'rgba(93, 211, 158, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontFamily: '"Poppins", sans-serif',
        },
        colorPrimary: {
          backgroundColor: '#5dd39e',
          color: '#000000',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: '"Poppins", sans-serif',
          '&.Mui-selected': {
            color: '#5dd39e',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#5dd39e',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
  },
});

export default theme;