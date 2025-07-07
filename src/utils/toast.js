import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast configuration options
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Shows a success toast notification
 * @param {string} message - Message to display in the toast
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Shows an error toast notification
 * @param {string} message - Message to display in the toast
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000, // Error messages stay a bit longer
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Shows an info toast notification
 * @param {string} message - Message to display in the toast
 */
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Shows a warning toast notification
 * @param {string} message - Message to display in the toast
 */
export const showWarningToast = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Default toast notification
export const showToast = (message) => {
  toast(message, toastConfig);
};

// API response handler with toast notification
export const handleApiResponse = (response, successMessage) => {
  if (response && response.success) {
    showSuccessToast(successMessage || 'Operation successful');
    return true;
  } else {
    showErrorToast(response?.error || 'Something went wrong');
    return false;
  }
};

// API error handler with toast notification
export const handleApiError = (error) => {
  const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
  showErrorToast(errorMessage);
  return false;
};

export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showToast,
  handleApiResponse,
  handleApiError
}; 