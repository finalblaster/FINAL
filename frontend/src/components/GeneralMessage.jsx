import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ICONS = {
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
};

const COLORS = {
  error: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
  info: 'bg-blue-600 text-white',
};

const GeneralMessage = ({ type = 'info', message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`mt-8 mb-6 p-4 rounded-lg shadow-md relative flex items-start ${COLORS[type]}`}
  >
    {ICONS[type]}
    <div className="flex-1">
      <p className="font-medium">{message}</p>
    </div>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/70 rounded"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </motion.div>
);

GeneralMessage.propTypes = {
  type: PropTypes.oneOf(['error', 'success', 'info']),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onClose: PropTypes.func,
};

export default GeneralMessage; 