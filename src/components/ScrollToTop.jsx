import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * when navigating between routes. This component doesn't render anything,
 * it just uses the useLocation hook to detect route changes and scrolls
 * to the top when that happens.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Add smooth scrolling effect
    });
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop; 