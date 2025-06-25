
import React, { useContext, useState, useCallback } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { ContactSectionData, SectionProps, SocialLink } from '../../types';
import EditableText from '../core/EditableText';
import SectionWrapper from '../layout/SectionWrapper';
import { ThemeContext } from '../../contexts/ThemeContext';
import Button from '../core/Button';
import Modal from '../core/Modal';
import { AddIcon, EditIcon, DeleteIcon } from '../core/Icon';

// A more specific icon mapping for social platforms
const PlatformIcon: React.FC<{platform: string, className?: string}> = ({platform, className="w-6 h-6"}) => {
  switch(platform.toLowerCase()) {
    case 'linkedin': return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
    case 'github': return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
    case 'twitter': return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.422.724-.665 1.56-.665 2.455 0 1.636.832 3.078 2.093 3.915-.774-.024-1.503-.237-2.143-.593v.077c0 2.288 1.625 4.195 3.78 4.632-.394.107-.81.164-1.24.164-.304 0-.598-.03-.883-.083.601 1.872 2.343 3.235 4.416 3.273-1.613 1.264-3.644 2.016-5.85 2.016-.38 0-.754-.023-1.122-.066 2.086 1.336 4.571 2.112 7.252 2.112 8.599 0 13.295-7.266 13.062-13.567.904-.652 1.688-1.464 2.308-2.391z"/></svg>;
    case 'instagram': return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.23.194-6.771 2.693-6.963 6.963-.059 1.28-.073 1.689-.073 4.948s.014 3.667.072 4.947c.196 4.27 2.734 6.771 6.963 6.963 1.28.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.23-.194 6.771-2.693 6.963-6.963.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.27-2.734-6.771-6.963-6.963-1.28-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    default: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>; // Generic Link Icon
  }
}

const SocialLinkForm: React.FC<{
  link?: SocialLink;
  onSave: (link: SocialLink | Omit<SocialLink, 'id'>) => void;
  onClose: () => void;
}> = ({ link, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<SocialLink>>(link || { platform: '', url: '' });
  const { theme } = useContext(ThemeContext);
  const inputClass = `w-full p-2 border rounded mb-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.platform && formData.url) {
      onSave(formData as SocialLink | Omit<SocialLink, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className={labelClass}>Platform (e.g., LinkedIn, GitHub)</label>
      <input type="text" name="platform" value={formData.platform || ''} onChange={handleChange} className={inputClass} required />
      <label className={labelClass}>URL</label>
      <input type="url" name="url" value={formData.url || ''} onChange={handleChange} className={inputClass} required placeholder="https://www.linkedin.com/in/yourprofile"/>
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">Save Link</Button>
      </div>
    </form>
  );
};


const ContactSection: React.FC<SectionProps<ContactSectionData>> = ({ id, data }) => {
  const { updateContact, addSocialLink, updateSocialLink, deleteSocialLink, editMode, updateSectionData } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | undefined>(undefined);

  const handleUpdate = useCallback((field: keyof Omit<ContactSectionData, 'socialLinks' | 'title'>, value: string) => {
    updateContact({ [field]: value });
  }, [updateContact]);

  const handleUpdateTitle = useCallback((newTitle: string) => {
    updateSectionData('contact', { ...data, title: newTitle });
  }, [data, updateSectionData]);
  
  const handleOpenLinkModal = (link?: SocialLink) => {
    setEditingLink(link);
    setIsLinkModalOpen(true);
  };

  const handleCloseLinkModal = () => {
    setEditingLink(undefined);
    setIsLinkModalOpen(false);
  };

  const handleSaveSocialLink = (linkData: SocialLink | Omit<SocialLink, 'id'>) => {
    if ('id' in linkData && linkData.id) {
      updateSocialLink(linkData as SocialLink);
    } else {
      addSocialLink(linkData as Omit<SocialLink, 'id'>);
    }
    handleCloseLinkModal();
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
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <EditableText
            initialValue={data.customMessage || "Let's connect!"}
            onSave={(value) => handleUpdate('customMessage', value)}
            multiline
            className={`text-lg leading-relaxed ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            placeholder="Your contact message..."
          />
          <div>
            <h4 className="text-xl font-semibold mb-2">Email</h4>
            {editMode ? (
              <EditableText initialValue={data.email} onSave={(value) => handleUpdate('email', value)} placeholder="your.email@example.com" className="text-lg"/>
            ) : (
              <a href={`mailto:${data.email}`} className={`text-lg ${theme.secondaryColor.replace('bg-', 'text-')} hover:underline`}>{data.email}</a>
            )}
          </div>
          { (data.phone || editMode) && (
            <div>
              <h4 className="text-xl font-semibold mb-2">Phone</h4>
              {editMode ? (
                <EditableText initialValue={data.phone || ''} onSave={(value) => handleUpdate('phone', value)} placeholder="+1 234 567 8900" className="text-lg"/>
              ) : data.phone && (
                <a href={`tel:${data.phone}`} className={`text-lg ${theme.secondaryColor.replace('bg-', 'text-')} hover:underline`}>{data.phone}</a>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-xl font-semibold mb-3">Follow Me</h4>
            <div className="flex flex-wrap gap-4 items-center">
              {data.socialLinks.map(link => (
                <div key={link.id} className="relative group">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" 
                     className={`p-3 rounded-full transition-colors ${theme.mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                    <PlatformIcon platform={link.platform} />
                  </a>
                  {editMode && (
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <button onClick={() => handleOpenLinkModal(link)} className="p-1 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 text-xs"><EditIcon className="w-3 h-3"/></button>
                      <button onClick={() => deleteSocialLink(link.id)} className="p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 text-xs ml-1"><DeleteIcon className="w-3 h-3"/></button>
                    </div>
                  )}
                </div>
              ))}
              {editMode && (
                <Button onClick={() => handleOpenLinkModal()} variant="ghost" size="sm" className={`p-3 rounded-full ${theme.mode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                  <AddIcon className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Simple Contact Form Placeholder - No actual submission logic */}
          <h4 className="text-xl font-semibold mb-4">Send a Message</h4>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input type="text" name="name" id="name" className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`} />
            </div>
            <div>
              <label htmlFor="email_form" className={`block text-sm font-medium ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input type="email" name="email_form" id="email_form" className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`} />
            </div>
            <div>
              <label htmlFor="message" className={`block text-sm font-medium ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
              <textarea id="message" name="message" rows={4} className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}></textarea>
            </div>
            <div>
              <Button type="button" variant="primary" onClick={() => alert('Contact form submission is not implemented in this demo.')}>
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={isLinkModalOpen} onClose={handleCloseLinkModal} title={editingLink ? 'Edit Social Link' : 'Add Social Link'}>
        <SocialLinkForm link={editingLink} onSave={handleSaveSocialLink} onClose={handleCloseLinkModal} />
      </Modal>
    </SectionWrapper>
  );
};

export default ContactSection;
