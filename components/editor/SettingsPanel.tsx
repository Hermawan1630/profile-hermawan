
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { PREDEFINED_THEMES, FONT_FAMILIES } from '../../constants';
import { ThemeSettings, SectionType } from '../../types';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { ArrowUpIcon, ArrowDownIcon } from '../core/Icon';

const SettingsPanel: React.FC = () => {
  const { theme, setTheme, updateThemeSetting, toggleMode } = useContext(ThemeContext);
  const { profileData, updateSectionsOrder, editMode, isEditAccessGranted } = useContext(ProfileDataContext)!;
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (selectedThemeName: string) => {
    const newTheme = PREDEFINED_THEMES[selectedThemeName];
    if (newTheme) {
      setTheme(newTheme);
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateThemeSetting('fontFamily', e.target.value);
  };
  
  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor', colorValue: string) => {
    // Ensure colorValue is a valid Tailwind bg class, or handle conversion if using color pickers
    updateThemeSetting(colorType, colorValue);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...profileData.sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      updateSectionsOrder(newOrder);
    }
  };

  // If edit access is not granted, or if it is granted but user is not in editMode, panel trigger is not needed or panel itself is not useful.
  // The panel content is useful only in editMode. The trigger button is useful if access is granted.
  if (!isEditAccessGranted) {
    return null; 
  }

  // Simple Tailwind color class options for demonstration
  const colorOptions = [
    { name: 'Blue', value: 'bg-blue-600' }, { name: 'Red', value: 'bg-red-600' },
    { name: 'Green', value: 'bg-green-600' }, { name: 'Purple', value: 'bg-purple-600' },
    { name: 'Indigo', value: 'bg-indigo-600' }, { name: 'Teal', value: 'bg-teal-600' },
    { name: 'Pink', value: 'bg-pink-600' }, { name: 'Orange', value: 'bg-orange-600' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-[60] p-3 rounded-r-md shadow-lg transition-transform
                    ${theme.primaryColor} text-white
                    ${isOpen ? 'left-80' : 'left-0'}`} // Adjust left based on panel width
        title="Toggle Settings Panel"
        aria-expanded={isOpen}
        aria-controls="settings-panel-content"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.27.033.514.162.697.355.098.102.162.22.196.354.09-.542.562-1.008 1.11-.951.27.032.514.161.698.354.097.103.162.221.195.354A12.002 12.002 0 0118 10.5c0 1.39-.283 2.7-.813 3.94-.033.133-.097.252-.195.354-.184.192-.428.322-.698.354-.548.057-1.02-.41-1.11-.951-.033-.132-.098-.251-.196-.353a11.965 11.965 0 00-.813-3.941 11.965 11.965 0 00-.813 3.941c-.098.102-.162.221-.196.353-.09.542.562 1.008 1.11.951.27-.033.514-.162.698-.354.098-.102.163-.22.195-.354A12.002 12.002 0 0118 14.5c0 2.062-.578 3.993-1.583 5.567a1.001 1.001 0 01-1.748-.027c-.09-.542-.562-1.008-1.11-.951-.27.033.514.162-.698.354-.098.103-.163.221-.195.354A11.95 11.95 0 0112 21c-1.389 0-2.7-.289-3.917-.814-.033-.132-.097-.251-.195-.353-.184-.193-.428-.322-.698-.354-.548-.057-1.02.409-1.11.951-.034.132-.098.251-.196.353A12.002 12.002 0 016 14.5c0-1.39.283-2.7.813-3.94.033-.133.097-.252.195-.354.184-.192.428-.322.698-.354.548-.057 1.02.41 1.11.951.033.132.098.251.196.353.536 1.246.813 2.551.813 3.941A11.965 11.965 0 008.25 10.5a11.965 11.965 0 00-.813-3.941c-.098-.102-.162-.221-.196-.353-.09-.542.562-1.008 1.11-.951.27.033.514.162.698.354.098.103.163.221.195.354A12.002 12.002 0 0112 4.5c1.389 0 2.7.289 3.917.814.033.132.097.251.195.353.184.193.428-.322.698.354.548.057 1.02-.409 1.11-.95zM12 6.75A4.75 4.75 0 1112 16a4.75 4.75 0 010-9.25z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Only render panel content if editMode is also true, as its features are for editing */}
      {editMode && (
        <div 
          id="settings-panel-content"
          className={`fixed top-0 left-0 h-full w-80 p-6 shadow-xl transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                        ${theme.mode === 'dark' ? 'bg-gray-800 text-white border-r border-gray-700' : 'bg-white text-gray-800 border-r border-gray-200'} 
                        overflow-y-auto z-[55]`}
          aria-hidden={!isOpen}
        >
          <h3 className="text-2xl font-semibold mb-6">Settings</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Theme Mode</label>
            <button onClick={toggleMode} className={`w-full px-3 py-2 rounded-md border ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
              Switch to {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="theme-select" className="block text-sm font-medium mb-1">Predefined Theme</label>
            <select
              id="theme-select"
              value={Object.keys(PREDEFINED_THEMES).find(key => PREDEFINED_THEMES[key].primaryColor === theme.primaryColor && PREDEFINED_THEMES[key].fontFamily === theme.fontFamily && PREDEFINED_THEMES[key].mode === theme.mode) || 'default'}
              onChange={(e) => handleThemeChange(e.target.value)}
              className={`w-full p-2 border rounded-md ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            >
              {Object.keys(PREDEFINED_THEMES).map(name => (
                <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="font-select" className="block text-sm font-medium mb-1">Font Family</label>
            <select
              id="font-select"
              value={theme.fontFamily}
              onChange={handleFontChange}
              className={`w-full p-2 border rounded-md ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            >
              {Object.entries(FONT_FAMILIES).map(([name, value]) => (
                <option key={value} value={value}>{name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button key={color.value} onClick={() => handleColorChange('primaryColor', color.value)}
                  className={`w-full h-10 rounded ${color.value} ${theme.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-current' : ''}`}
                  title={color.name}
                  aria-label={`Set primary color to ${color.name}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Secondary Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button key={color.value} onClick={() => handleColorChange('secondaryColor', color.value)}
                  className={`w-full h-10 rounded ${color.value} ${theme.secondaryColor === color.value ? 'ring-2 ring-offset-2 ring-current' : ''}`}
                  title={color.name}
                  aria-label={`Set secondary color to ${color.name}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Sections Order</h4>
            <ul className="space-y-2">
              {profileData.sectionsOrder.map((sectionType, index) => (
                <li key={sectionType} className={`flex items-center justify-between p-2 rounded 
                  ${theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span>{sectionType.charAt(0) + sectionType.slice(1).toLowerCase()}</span>
                  <div className="space-x-1">
                    <button onClick={() => moveSection(index, 'up')} disabled={index === 0} 
                      className="p-1 disabled:opacity-50 hover:bg-gray-500/30 rounded"
                      aria-label={`Move ${sectionType} section up`}>
                      <ArrowUpIcon />
                    </button>
                    <button onClick={() => moveSection(index, 'down')} disabled={index === profileData.sectionsOrder.length - 1} 
                      className="p-1 disabled:opacity-50 hover:bg-gray-500/30 rounded"
                      aria-label={`Move ${sectionType} section down`}>
                      <ArrowDownIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;
