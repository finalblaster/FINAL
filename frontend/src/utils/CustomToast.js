import { toast } from 'react-toastify';
import { TOAST_CONFIG } from './config';

/**
 * Custom toast utility for consistent toast notifications across the application
 */
const CustomToast = {
  /**
   * Display a success toast
   * @param {string} message - The message to display
   * @param {Object} options - Additional options to pass to toast
   */
  success: (message, options = {}) => {
    toast.success(message, {
      ...TOAST_CONFIG.DEFAULT_OPTIONS,
      className: TOAST_CONFIG.THEME.SUCCESS.className,
      ...options,
    });
  },

  /**
   * Display an error toast
   * @param {string} message - The message to display
   * @param {Object} options - Additional options to pass to toast
   */
  error: (message, options = {}) => {
    toast.error(message, {
      ...TOAST_CONFIG.DEFAULT_OPTIONS,
      className: TOAST_CONFIG.THEME.ERROR.className,
      ...options,
    });
  },

  /**
   * Display an info toast
   * @param {string} message - The message to display
   * @param {Object} options - Additional options to pass to toast
   */
  info: (message, options = {}) => {
    toast.info(message, {
      ...TOAST_CONFIG.DEFAULT_OPTIONS,
      className: TOAST_CONFIG.THEME.INFO.className,
      ...options,
    });
  },

  /**
   * Display a warning toast
   * @param {string} message - The message to display
   * @param {Object} options - Additional options to pass to toast
   */
  warning: (message, options = {}) => {
    toast.warning(message, {
      ...TOAST_CONFIG.DEFAULT_OPTIONS,
      className: TOAST_CONFIG.THEME.WARNING.className,
      ...options,
    });
  },
};

export default CustomToast; 