
import React, { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const { theme } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className={`rounded-lg shadow-xl w-full max-w-lg overflow-hidden ${theme.mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className={`flex justify-between items-center p-4 border-b ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${theme.mode === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className={`p-4 border-t ${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-2`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
