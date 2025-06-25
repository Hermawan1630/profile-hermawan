
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { SectionType } from '../../types';

const Navbar: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { profileData } = useContext(ProfileDataContext)!;

  const getPathForSection = (sectionKey: SectionType): string => {
    if (sectionKey === SectionType.ABOUT) {
      return "/";
    }
    return `/${sectionKey.toLowerCase()}`;
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string => {
    const baseLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    
    if (isActive) {
      const activeBg = theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'; // Neutral active background
      const activeText = theme.primaryColor.replace('bg-', 'text-'); // Theme's primary color for text
      return `${baseLinkClasses} ${activeBg} ${activeText}`;
    } else {
      // Regular, non-active link styling
      const inactiveStyle = theme.mode === 'dark' 
        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
      return `${baseLinkClasses} ${inactiveStyle}`;
    }
  };
  
  const navLinkStyle = ({isActive}: {isActive: boolean}) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    // Color is now handled by navLinkClasses
  });


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 shadow-md ${theme.mode === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className={`text-xl font-bold ${theme.primaryColor.replace('bg-', 'text-')}`}>
          {profileData.about.name || 'My Profile'}
        </Link>
        <div className="space-x-1 md:space-x-2">
          {profileData.sectionsOrder.map((sectionKey) => (
             <NavLink 
                key={sectionKey}
                to={getPathForSection(sectionKey)}
                className={navLinkClasses}
                style={navLinkStyle}
              >
              {sectionKey.charAt(0) + sectionKey.slice(1).toLowerCase()}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
