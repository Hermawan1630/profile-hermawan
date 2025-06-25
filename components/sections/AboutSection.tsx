
import React, { useContext, useState, useCallback } from 'react';
import { ProfileDataContext } from '../../contexts/ProfileDataContext';
import { AboutSectionData, SectionProps } from '../../types';
import EditableText from '../core/EditableText';
import SectionWrapper from '../layout/SectionWrapper';
import Button from '../core/Button';
import { generateText } from '../../services/geminiService';
import { ThemeContext } from '../../contexts/ThemeContext';

const AboutSection: React.FC<SectionProps<AboutSectionData>> = ({ id, data }) => {
  const { updateAbout, editMode } = useContext(ProfileDataContext)!;
  const { theme } = useContext(ThemeContext)!;
  const [isLoadingBio, setIsLoadingBio] = useState(false);

  const handleUpdate = useCallback((field: keyof AboutSectionData, value: string) => {
    updateAbout({ [field]: value });
  }, [updateAbout]);

  const handleGenerateBio = async () => {
    setIsLoadingBio(true);
    const prompt = `Based on the following keywords or existing bio, generate a compelling and professional "About Me" bio for a personal profile. 
    Current name: ${data.name}. Current title: ${data.title}. Existing bio (if any): ${data.bio}.
    Please make it concise, engaging, and suitable for a personal portfolio website. Output only the bio text.`;
    try {
      const newBio = await generateText(prompt, "You are a helpful AI assistant that writes professional biographies.");
      if (newBio && !newBio.startsWith("Error:")) {
        updateAbout({ bio: newBio });
      } else {
        // Handle error display, perhaps a toast notification
        console.error("Failed to generate bio:", newBio);
      }
    } catch (error) {
      console.error("Error generating bio:", error);
    }
    setIsLoadingBio(false);
  };

  return (
    <SectionWrapper id={id} title="About Me">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <img 
            src={data.profileImageUrl || 'https://picsum.photos/300/300'} 
            alt={data.name} 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg mb-4"
          />
          {editMode && (
            <div className="w-full">
               <label className="block text-sm font-medium mb-1">Profile Image URL</label>
               <EditableText
                initialValue={data.profileImageUrl}
                onSave={(value) => handleUpdate('profileImageUrl', value)}
                className={`w-full text-sm p-1 rounded ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}
        </div>
        <div className="w-full md:w-2/3">
          <EditableText
            as="h1"
            initialValue={data.name}
            onSave={(value) => handleUpdate('name', value)}
            className="text-4xl font-bold mb-2"
            placeholder="Your Name"
          />
          <EditableText
            as="h2"
            initialValue={data.title}
            onSave={(value) => handleUpdate('title', value)}
            className={`text-2xl ${theme.secondaryColor.replace('bg-', 'text-')} font-medium mb-4`}
            placeholder="Your Title / Profession"
          />
          <EditableText
            initialValue={data.bio}
            onSave={(value) => handleUpdate('bio', value)}
            multiline
            className={`text-lg leading-relaxed mb-6 ${theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            placeholder="Tell us about yourself..."
          />
          {editMode && (
            <Button onClick={handleGenerateBio} disabled={isLoadingBio} className="mb-4">
              {isLoadingBio ? 'Generating Bio...' : '✨ Generate Bio with AI'}
            </Button>
          )}
          {data.resumeUrl || editMode ? (
             <div className="mt-4">
                {editMode ? (
                    <>
                    <label className="block text-sm font-medium mb-1">Resume URL (optional)</label>
                    <EditableText
                        initialValue={data.resumeUrl || ''}
                        onSave={(value) => handleUpdate('resumeUrl', value)}
                        className={`w-full text-sm p-1 rounded ${theme.mode === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                        placeholder="https://example.com/resume.pdf"
                    />
                    </>
                ) : data.resumeUrl && (
                    <a
                        href={data.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-block px-6 py-3 rounded-md shadow-md transition-colors text-white ${theme.primaryColor} hover:opacity-90`}
                    >
                        View Resume
                    </a>
                )}
            </div>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
