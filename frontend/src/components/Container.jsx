import React from 'react';
import { cn } from '../utils/cn';

/**
 * Container component for consistent content width and padding
 * @param {Object} props - The component props
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - The container content
 * @param {React.ElementType} [props.as='div'] - The HTML element to render
 * @returns {JSX.Element} - The container element
 */
const Container = ({
  className,
  children,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'container mx-auto px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;