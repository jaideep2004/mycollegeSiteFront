import React, { useCallback } from 'react';
import { useTheme } from '@mui/material';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
  const theme = useTheme();
  
  // Initialize particles with callback
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Configuration for the particles
  const options = {
    fpsLimit: 60,
    fullScreen: false,
    particles: {
      color: {
        value: theme.palette.primary.main,
      },
      links: {
        color: theme.palette.primary.main,
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: ["circle", "triangle", "polygon"],
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBackground; 