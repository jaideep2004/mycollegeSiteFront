import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * ScrollToTopButton component that displays a floating action button
 * in the bottom-right corner of the screen when the user scrolls down.
 * Clicking the button smoothly scrolls the page back to the top.
 */
const ScrollToTopButton = () => {
  // Track if the button should be visible
  const [visible, setVisible] = useState(false);
  
  // Use MUI's useScrollTrigger to detect scroll position
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300, // Show button after scrolling 300px
  });
  
  useEffect(() => {
    setVisible(trigger);
  }, [trigger]);
  
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="medium"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton; 