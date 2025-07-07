import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';
import CalculateIcon from '@mui/icons-material/Calculate';
import ComputerIcon from '@mui/icons-material/Computer';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import BiotechIcon from '@mui/icons-material/Biotech';
import { useTheme } from '@mui/material/styles';

// Performance optimization using requestAnimationFrame
const useAnimationFrame = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  
  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};

const GlobalFloatingElements = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const elementsRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(true);
  
  // Educational elements with different sizes, positions, and icons
  // These will be positioned throughout the entire page
  const elements = [
    { 
      icon: <SchoolIcon />, 
      size: 60, 
      initialPosition: { x: '10%', y: '15%' }, 
      depth: 0.01,
      color: theme.palette.primary.main,
      opacity: 0.3
    },
    { 
      icon: <MenuBookIcon />, 
      size: 40, 
      initialPosition: { x: '85%', y: '25%' }, 
      depth: 0.02,
      color: theme.palette.primary.main,
      opacity: 0.2
    },
    { 
      icon: <PsychologyIcon />, 
      size: 50, 
      initialPosition: { x: '75%', y: '60%' }, 
      depth: 0.015,
      color: theme.palette.primary.dark,
      opacity: 0.25
    },
    { 
      icon: <ScienceIcon />, 
      size: 45, 
      initialPosition: { x: '15%', y: '75%' }, 
      depth: 0.02,
      color: theme.palette.primary.light,
      opacity: 0.2
    },
    { 
      icon: <CalculateIcon />, 
      size: 35, 
      initialPosition: { x: '25%', y: '40%' }, 
      depth: 0.01,
      color: theme.palette.primary.main,
      opacity: 0.15
    },
    { 
      icon: <ComputerIcon />, 
      size: 55, 
      initialPosition: { x: '60%', y: '85%' }, 
      depth: 0.02,
      color: theme.palette.primary.dark,
      opacity: 0.2
    },
    { 
      icon: <ArchitectureIcon />, 
      size: 38, 
      initialPosition: { x: '30%', y: '95%' }, 
      depth: 0.015,
      color: theme.palette.primary.light,
      opacity: 0.2
    },
    { 
      icon: <BiotechIcon />, 
      size: 42, 
      initialPosition: { x: '90%', y: '45%' }, 
      depth: 0.01,
      color: theme.palette.primary.main,
      opacity: 0.25
    },
  ];

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: document.documentElement.scrollHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Check visibility based on performance
    const checkPerformance = () => {
      // Check if device is low-end (you can expand this logic)
      const isLowEndDevice = !window.matchMedia('(min-device-memory: 4gb)').matches;
      setIsVisible(!isLowEndDevice);
    };
    
    checkPerformance();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle mouse movement with throttling
  useEffect(() => {
    let lastTime = 0;
    const throttleTime = 16; // ~60fps
    
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastTime >= throttleTime) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
        lastTime = currentTime;
      }
    };

    // Handle scroll with throttling
    let lastScrollTime = 0;
    const handleScroll = () => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime >= throttleTime) {
        setScrollY(window.scrollY);
        lastScrollTime = currentTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate element positions based on mouse movement and scroll
  const calculatePosition = (initialPosition, depth, index) => {
    if (!dimensions.width || !dimensions.height) return { x: 0, y: 0 };
    
    // Convert percentage to pixels
    const initialX = dimensions.width * (parseFloat(initialPosition.x) / 100);
    const initialY = dimensions.height * (parseFloat(initialPosition.y) / 100);
    
    // Calculate offset based on mouse position and scroll
    const offsetX = (mousePosition.x - dimensions.width / 2) * depth;
    const offsetY = (mousePosition.y - dimensions.height / 2 + scrollY * 0.1) * depth;
    
    return {
      x: initialX + offsetX,
      y: initialY + offsetY
    };
  };

  // Use requestAnimationFrame for smooth animations
  useAnimationFrame(() => {
    if (!isVisible) return;
    
    elements.forEach((element, index) => {
      if (elementsRef.current[index]) {
        const position = calculatePosition(element.initialPosition, element.depth, index);
        const el = elementsRef.current[index];
        el.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;
      }
    });
  });

  if (!isVisible) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    >
      {elements.map((element, index) => {
        // Initial position calculation
        const initialX = dimensions.width * (parseFloat(element.initialPosition.x) / 100);
        const initialY = dimensions.height * (parseFloat(element.initialPosition.y) / 100);
        
        return (
          <Box
            key={index}
            ref={(el) => elementsRef.current[index] = el}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(-50%, -50%) translate(${initialX}px, ${initialY}px)`,
              width: element.size,
              height: element.size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: element.color,
              opacity: element.opacity,
              fontSize: element.size,
              willChange: 'transform', // Performance optimization
              '& svg': {
                fontSize: 'inherit',
              },
            }}
          >
            {element.icon}
          </Box>
        );
      })}
    </Box>
  );
};

export default GlobalFloatingElements; 