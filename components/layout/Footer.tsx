
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <footer className={`py-6 text-center ${theme.mode === 'dark' ? 'bg-gray-800 border-t border-gray-700 text-gray-400' : 'bg-gray-200 border-t border-gray-300 text-gray-600'}`}>
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
      <p className="text-sm">Powered by React & Tailwind CSS</p>
    </footer>
  );
};

export default Footer;
