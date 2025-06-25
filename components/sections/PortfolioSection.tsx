
import React, { useContext, useState, useCallback } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { PortfolioItem, PortfolioSectionData, SectionProps } from '../../types';
import EditableText from '../core/EditableText';
import SectionWrapper from '../layout/SectionWrapper';
import Modal from '../core/Modal';
import Button from '../core/Button';
import { AddIcon, EditIcon, DeleteIcon } from '../core/Icon';
import { ThemeContext } from '../../contexts/ThemeContext';

const PortfolioForm: React.FC<{
  item?: PortfolioItem;
  onSave: (item: PortfolioItem | Omit<PortfolioItem, 'id'>) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<PortfolioItem>>(
    item || { title: '', description: '', imageUrl: '', projectUrl: '', repoUrl: '', videoEmbedUrl: '' }
  );
  const { theme } = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.imageUrl) {
      onSave(formData as PortfolioItem | Omit<PortfolioItem, 'id'>);
    }
  };
  
  const inputClass = `w-full p-2 border rounded mb-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;

  return (
    <form onSubmit={handleSubmit}>
      <label className={labelClass}>Project Title</label>
      <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>Description</label>
      <textarea name="description" value={formData.description || ''} onChange={handleChange} className={`${inputClass} min-h-[100px]`} required />
      <label className={labelClass}>Image URL</label>
      <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://picsum.photos/400/300" required />
      <label className={labelClass}>Project URL (Live Demo)</label>
      <input type="url" name="projectUrl" value={formData.projectUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://example.com/project" />
      <label className={labelClass}>Repository URL (e.g., GitHub)</label>
      <input type="url" name="repoUrl" value={formData.repoUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://github.com/user/repo" />
      <label className={labelClass}>Video Embed URL (e.g., YouTube)</label>
      <input type="url" name="videoEmbedUrl" value={formData.videoEmbedUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://www.youtube.com/embed/VIDEO_ID" />
      {/* Optional: Tags input */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  );
};

const PortfolioSection: React.FC<SectionProps<PortfolioSectionData>> = ({ id, data }) => {
  const { addPortfolioItem, updatePortfolioItem, deletePortfolioItem, editMode, updateSectionData } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>(undefined);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    updateSectionData('portfolio', { ...data, title: newTitle });
  }, [data, updateSectionData]);
  
  const handleOpenModal = (item?: PortfolioItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(false);
  };

  const handleSaveItem = (itemData: PortfolioItem | Omit<PortfolioItem, 'id'>) => {
    if ('id' in itemData && itemData.id) {
      updatePortfolioItem(itemData as PortfolioItem);
    } else {
      addPortfolioItem(itemData as Omit<PortfolioItem, 'id'>);
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
        {data.items.map(item => (
          <div key={item.id} className={`rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-2xl ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            {item.videoEmbedUrl ? (
                <div className="aspect-w-16 aspect-h-9">
                    <iframe src={item.videoEmbedUrl} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
            ) : (
                <img src={item.imageUrl || 'https://picsum.photos/400/300'} alt={item.title} className="w-full h-56 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {editMode && (
                  <div className="flex space-x-1">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-400 hover:text-blue-600 p-1"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={() => deletePortfolioItem(item.id)} className="text-red-400 hover:text-red-600 p-1"><DeleteIcon className="w-4 h-4"/></button>
                  </div>
                )}
              </div>
              <p className={`text-sm mb-4 min-h-[60px] ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.description}</p>
              <div className="flex space-x-2">
                {item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className={`px-3 py-1 text-sm rounded ${theme.primaryColor} text-white hover:opacity-90`}>View Project</a>}
                {item.repoUrl && <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className={`px-3 py-1 text-sm rounded ${theme.secondaryColor} text-white hover:opacity-90`}>View Code</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {editMode && (
        <div className="text-center mt-8">
          <Button onClick={() => handleOpenModal()} variant="secondary" leftIcon={<AddIcon />}>
            Add Project
          </Button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'Edit Project' : 'Add Project'}>
        <PortfolioForm item={editingItem} onSave={handleSaveItem} onClose={handleCloseModal} />
      </Modal>
    </SectionWrapper>
  );
};

export default PortfolioSection;
