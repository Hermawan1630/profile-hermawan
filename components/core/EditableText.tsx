
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { ThemeContext } from '../../contexts/ThemeContext';

interface EditableTextProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  as?: keyof JSX.IntrinsicElements; // e.g., 'h1', 'p', 'div'
}

const EditableText: React.FC<EditableTextProps> = ({ initialValue, onSave, className, multiline = false, placeholder = "Enter text...", as: Component = 'div' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { editMode } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(initialValue);
      setIsEditing(false);
    }
  };

  if (!editMode && !isEditing) {
    return <Component className={`${className} whitespace-pre-wrap`}>{currentValue || placeholder}</Component>;
  }
  
  if (isEditing) {
    const inputClasses = `w-full p-1 border rounded ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} ${className}`;
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${inputClasses} min-h-[60px]`}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={inputClasses}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Component
      className={`${className} cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded whitespace-pre-wrap`}
      onClick={() => editMode && setIsEditing(true)}
      title={editMode ? "Click to edit" : ""}
    >
      {currentValue || <span className="text-gray-400 italic">{placeholder}</span>}
    </Component>
  );
};

export default EditableText;
