
import React, { useContext, useState, useCallback } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { ExperienceItem, ExperienceSectionData, SectionProps } from '../../types';
import EditableText from '../core/EditableText';
import SectionWrapper from '../layout/SectionWrapper';
import Modal from '../core/Modal';
import Button from '../core/Button';
import { AddIcon, EditIcon, DeleteIcon } from '../core/Icon';
import { ThemeContext } from '../../contexts/ThemeContext';

const ExperienceForm: React.FC<{
  item?: ExperienceItem;
  onSave: (item: ExperienceItem | Omit<ExperienceItem, 'id'>) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ExperienceItem>>(
    item || { title: '', company: '', period: '', description: '' }
  );
  const { theme } = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.company && formData.period) {
      onSave(formData as ExperienceItem | Omit<ExperienceItem, 'id'>);
    }
  };
  
  const inputClass = `w-full p-2 border rounded mb-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;


  return (
    <form onSubmit={handleSubmit}>
      <label className={labelClass}>Title</label>
      <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>Company</label>
      <input type="text" name="company" value={formData.company || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>Period (e.g., Jan 2020 - Present)</label>
      <input type="text" name="period" value={formData.period || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>Description</label>
      <textarea name="description" value={formData.description || ''} onChange={handleChange} className={`${inputClass} min-h-[100px]`} />
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  );
};


const ExperienceSection: React.FC<SectionProps<ExperienceSectionData>> = ({ id, data }) => {
  const { addExperienceItem, updateExperienceItem, deleteExperienceItem, editMode, updateSectionData } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | undefined>(undefined);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    updateSectionData('experience', { ...data, title: newTitle });
  }, [data, updateSectionData]);
  
  const handleOpenModal = (item?: ExperienceItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(false);
  };

  const handleSaveItem = (itemData: ExperienceItem | Omit<ExperienceItem, 'id'>) => {
    if ('id' in itemData && itemData.id) {
      updateExperienceItem(itemData as ExperienceItem);
    } else {
      addExperienceItem(itemData as Omit<ExperienceItem, 'id'>);
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
      <div className="space-y-8 relative">
        {data.items.map((item, index) => (
          <div key={item.id} className={`relative p-6 rounded-lg shadow-md transition-all ${theme.mode === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} hover:shadow-xl`}>
            {index !== 0 && <div className={`absolute top-0 left-8 w-px h-full -translate-y-full ${theme.mode === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>}
            <div className={`absolute -left-0 top-6 w-4 h-4 rounded-full ${theme.secondaryColor} ring-4 ${theme.mode === 'dark' ? 'ring-gray-800' : 'ring-white'}`}></div>
            
            <div className="ml-12">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {editMode && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                    <button onClick={() => deleteExperienceItem(item.id)} className="text-red-500 hover:text-red-700"><DeleteIcon /></button>
                  </div>
                )}
              </div>
              <p className={`text-md font-medium ${theme.secondaryColor.replace('bg-','text-')}`}>{item.company}</p>
              <p className={`text-sm mb-2 ${theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.period}</p>
              <p className={`whitespace-pre-wrap ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
            </div>
          </div>
        ))}
        {editMode && (
          <div className="text-center mt-6">
            <Button onClick={() => handleOpenModal()} variant="secondary" leftIcon={<AddIcon />}>
              Add Experience
            </Button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm item={editingItem} onSave={handleSaveItem} onClose={handleCloseModal} />
      </Modal>
    </SectionWrapper>
  );
};

export default ExperienceSection;
