import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// This component is now a wrapper around React Toastify
// It's kept for backward compatibility
const Notification = ({ open, message, severity, onClose }) => {
  React.useEffect(() => {
    if (open && message) {
      switch (severity) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
        case 'info':
          toast.info(message);
          break;
        default:
          toast(message);
      }
      
      // Call onClose to reset the open state in the parent component
      if (onClose) {
        onClose();
      }
    }
  }, [open, message, severity, onClose]);

  return null; // No need to render anything as ToastContainer is in App.jsx
};

export default Notification;