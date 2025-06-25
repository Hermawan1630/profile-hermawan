import React, { useContext, useState, useCallback } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { SkillItem, SkillsSectionData, SectionProps } from '../../types';
import EditableText from '../core/EditableText';
import SectionWrapper from '../layout/SectionWrapper';
import Modal from '../core/Modal';
import Button from '../core/Button';
import { AddIcon, EditIcon, DeleteIcon } from '../core/Icon';
import { ThemeContext } from '../../contexts/ThemeContext';

const SkillForm: React.FC<{
  item?: SkillItem;
  onSave: (item: SkillItem | Omit<SkillItem, 'id'>) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<SkillItem>>(
    item || { name: '', level: 50 }
  );
  const { theme } = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.level != null) {
      onSave(formData as SkillItem | Omit<SkillItem, 'id'>);
    }
  };
  
  const inputClass = `w-full p-2 border rounded mb-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;
  
  // Create accent color class for range input: e.g. bg-blue-600 -> accent-blue-600
  const accentColorClass = theme.primaryColor.startsWith('bg-') 
    ? `accent-${theme.primaryColor.substring(3)}` 
    : 'accent-gray-500'; // fallback


  return (
    <form onSubmit={handleSubmit}>
      <label className={labelClass}>Skill Name</label>
      <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>Proficiency Level ({formData.level || 0}%)</label>
      <input 
        type="range" 
        name="level" 
        min="0" 
        max="100" 
        step="5" 
        value={formData.level || 0} 
        onChange={handleChange} 
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mb-2 ${accentColorClass}`} 
      />
      {/* Optional: Icon input (e.g., text for class name or SVG data) */}
      {/* <label className={labelClass}>Icon (optional)</label>
      <input type="text" name="icon" value={formData.icon || ''} onChange={handleChange} className={inputClass} /> */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  );
};

const SkillsSection: React.FC<SectionProps<SkillsSectionData>> = ({ id, data }) => {
  const { addSkillItem, updateSkillItem, deleteSkillItem, editMode, updateSectionData } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | undefined>(undefined);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    updateSectionData('skills', { ...data, title: newTitle });
  }, [data, updateSectionData]);

  const handleOpenModal = (item?: SkillItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(false);
  };

  const handleSaveItem = (itemData: SkillItem | Omit<SkillItem, 'id'>) => {
    if ('id' in itemData && itemData.id) {
      updateSkillItem(itemData as SkillItem);
    } else {
      addSkillItem(itemData as Omit<SkillItem, 'id'>);
    }
    handleCloseModal();
  };

  return (
    <SectionWrapper id={id} title={editMode ? '' : data.title}>
      {editMode && (
         <EditableText 
            initialValue={data.title}
            onSave={handleUpdateTitle}
            as="h2"
            className={`text-3xl font-bold ${theme.primaryColor.replace('bg-', 'text-')} mb-8 relative w-fit`}
            placeholder="Section Title"
          />
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.items.map(skill => (
          <div key={skill.id} className={`p-4 rounded-lg shadow-md ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">{skill.name}</span>
              {editMode && (
                <div className="flex space-x-1">
                  <button onClick={() => handleOpenModal(skill)} className="text-blue-400 hover:text-blue-600 p-1"><EditIcon className="w-4 h-4" /></button>
                  <button onClick={() => deleteSkillItem(skill.id)} className="text-red-400 hover:text-red-600 p-1"><DeleteIcon className="w-4 h-4"/></button>
                </div>
              )}
            </div>
            <div className={`w-full ${theme.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
              <div 
                className={`${theme.primaryColor} h-2.5 rounded-full`} 
                style={{ width: `${skill.level}%` }}
                title={`${skill.level}%`}
              ></div>
            </div>
            <p className={`text-right text-sm mt-1 ${theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{skill.level}%</p>
          </div>
        ))}
      </div>
      {editMode && (
        <div className="text-center mt-8">
          <Button onClick={() => handleOpenModal()} variant="secondary" leftIcon={<AddIcon />}>
            Add Skill
          </Button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Skill' : 'Add Skill'}>
        <SkillForm item={editingItem} onSave={handleSaveItem} onClose={handleCloseModal} />
      </Modal>
    </SectionWrapper>
  );
};

export default SkillsSection;