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

const FloatingElements = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const elementsRef = useRef([]);

  // Educational elements with different sizes, positions, and icons
  const elements = [
    { 
      icon: <SchoolIcon />, 
      size: 60, 
      initialPosition: { x: '10%', y: '20%' }, 
      depth: 0.02,
      color: theme.palette.primary.main,
      opacity: 0.7
    },
    { 
      icon: <MenuBookIcon />, 
      size: 40, 
      initialPosition: { x: '85%', y: '15%' }, 
      depth: 0.04,
      color: theme.palette.primary.main,
      opacity: 0.5
    },
    { 
      icon: <PsychologyIcon />, 
      size: 50, 
      initialPosition: { x: '75%', y: '70%' }, 
      depth: 0.03,
      color: theme.palette.primary.dark,
      opacity: 0.6
    },
    { 
      icon: <ScienceIcon />, 
      size: 45, 
      initialPosition: { x: '20%', y: '80%' }, 
      depth: 0.05,
      color: theme.palette.primary.light,
      opacity: 0.4
    },
    { 
      icon: <CalculateIcon />, 
      size: 35, 
      initialPosition: { x: '40%', y: '30%' }, 
      depth: 0.02,
      color: theme.palette.primary.main,
      opacity: 0.3
    },
    { 
      icon: <ComputerIcon />, 
      size: 55, 
      initialPosition: { x: '60%', y: '40%' }, 
      depth: 0.04,
      color: theme.palette.primary.dark,
      opacity: 0.5
    },
    { 
      icon: <ArchitectureIcon />, 
      size: 38, 
      initialPosition: { x: '25%', y: '50%' }, 
      depth: 0.03,
      color: theme.palette.primary.light,
      opacity: 0.4
    },
    { 
      icon: <BiotechIcon />, 
      size: 42, 
      initialPosition: { x: '80%', y: '60%' }, 
      depth: 0.02,
      color: theme.palette.primary.main,
      opacity: 0.6
    },
  ];

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate element positions based on mouse movement and scroll
  const calculatePosition = (initialPosition, depth) => {
    if (!containerRef.current) return initialPosition;
    
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Convert percentage to pixels
    const initialX = width * (parseFloat(initialPosition.x) / 100);
    const initialY = height * (parseFloat(initialPosition.y) / 100);
    
    // Calculate offset based on mouse position and scroll
    const offsetX = (mousePosition.x - width / 2) * depth;
    const offsetY = (mousePosition.y - height / 2 + scrollY * 0.1) * depth;
    
    return {
      x: initialX + offsetX,
      y: initialY + offsetY
    };
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    >
      {elements.map((element, index) => {
        const position = calculatePosition(element.initialPosition, element.depth);
        
        return (
          <Box
            key={index}
            ref={(el) => elementsRef.current[index] = el}
            sx={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
              width: element.size,
              height: element.size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: element.color,
              opacity: element.opacity,
              fontSize: element.size,
              transition: 'transform 0.1s ease-out',
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

export default FloatingElements; 