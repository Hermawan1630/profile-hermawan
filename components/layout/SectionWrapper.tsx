
import React, { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { EditIcon } from '../core/Icon'; // Assuming EditIcon is for general section editing

interface SectionWrapperProps {
  id: string;
  title: string;
  children: ReactNode;
  onEditClick?: () => void; // Optional: specific edit action for the whole section
  titleEditable?: boolean;
  onTitleSave?: (newTitle: string) => void;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, onEditClick, titleEditable = false, onTitleSave, className = "" }) => {
  const { theme } = useContext(ThemeContext);
  const { editMode } = useContext(ProfileDataContext)!;
  // EditableText for title can be integrated here if needed
  // For simplicity, direct title editing is not implemented here but can be added.

  return (
    <section id={id} className={`py-12 md:py-16 ${theme.mode === 'dark' ? 'dark:bg-gray-800' : 'bg-white'} my-4 rounded-lg shadow-lg ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${theme.primaryColor.replace('bg-', 'text-')} relative`}>
            {title}
            <span className={`absolute -bottom-2 left-0 w-1/4 h-1 ${theme.secondaryColor}`}></span>
          </h2>
          {editMode && onEditClick && (
            <button
              onClick={onEditClick}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
              title="Edit Section"
            >
              <EditIcon className="w-6 h-6" />
            </button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
