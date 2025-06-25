import React, { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', leftIcon, rightIcon, className, ...props }) => {
  const { theme } = useContext(ThemeContext);

  const baseStyles = "font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out inline-flex items-center justify-center";
  
  // Helper to derive focus ring color from background color class
  const getFocusRingColor = (bgColorClass: string): string => {
    if (bgColorClass.startsWith('bg-')) {
      // Example: bg-blue-600 -> focus:ring-blue-500
      // This is a simplification; a more robust solution might map shades or use a consistent focus shade.
      const colorName = bgColorClass.split('-')[1];
      return `focus:ring-${colorName}-500 dark:focus:ring-offset-gray-800`; // Adjusted for dark mode offset
    }
    return 'focus:ring-gray-500'; // Fallback
  };

  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = `${theme.primaryColor} text-white hover:opacity-90 ${getFocusRingColor(theme.primaryColor)}`;
      break;
    case 'secondary':
      variantStyles = `${theme.secondaryColor} text-white hover:opacity-90 ${getFocusRingColor(theme.secondaryColor)}`;
      break;
    case 'danger':
      variantStyles = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-gray-800";
      break;
    case 'ghost':
      variantStyles = `bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-current focus:ring-gray-500 dark:focus:ring-offset-gray-800`;
      break;
    default:
      variantStyles = `${theme.primaryColor} text-white hover:opacity-90 ${getFocusRingColor(theme.primaryColor)}`;
  }

  let sizeStyles = "";
  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5 text-sm";
      break;
    case 'md':
      sizeStyles = "px-4 py-2 text-base";
      break;
    case 'lg':
      sizeStyles = "px-6 py-3 text-lg";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;