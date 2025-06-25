
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeContext }  from './contexts/ThemeContext';
import { ProfileDataContext } from './contexts/ProfileDataContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AboutSection from './components/sections/AboutSection';
import ExperienceSection from './components/sections/ExperienceSection';
import SkillsSection from './components/sections/SkillsSection';
import PortfolioSection from './components/sections/PortfolioSection';
import ContactSection from './components/sections/ContactSection';
import SettingsPanel from './components/editor/SettingsPanel';
import { SectionType, ProfileData, AboutSectionData, ExperienceSectionData, SkillsSectionData, PortfolioSectionData, ContactSectionData, EducationSectionData, TestimonialSectionData } from './types';

// Placeholder components for sections not fully implemented
const EducationPage: React.FC<{data: EducationSectionData}> = ({data}) => <div id={SectionType.EDUCATION.toLowerCase()} className="p-8 text-center min-h-[calc(100vh-200px)] flex items-center justify-center"><div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">Education Section Page Content for: {data.title} (Content not fully implemented)</div></div>;
const TestimonialsPage: React.FC<{data: TestimonialSectionData}> = ({data}) => <div id={SectionType.TESTIMONIALS.toLowerCase()} className="p-8 text-center min-h-[calc(100vh-200px)] flex items-center justify-center"><div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">Testimonials Section Page Content for: {data.title} (Content not fully implemented)</div></div>;
const CustomPage: React.FC<{data: any}> = ({data}) => <div id={SectionType.CUSTOM.toLowerCase()} className="p-8 text-center min-h-[calc(100vh-200px)] flex items-center justify-center"><div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">Custom Section Page (Content not fully implemented)</div></div>;


const App: React.FC = () => {
  const { theme, fontClass } = useContext(ThemeContext);
  const { profileData, editMode, toggleEditMode, isEditAccessGranted } = useContext(ProfileDataContext)!;
  
  const getCustomSectionData = (sectionId: string) => {
    return profileData.customSections?.find(cs => cs.id === sectionId);
  }

  return (
    <div className={`flex flex-col min-h-screen ${fontClass} ${theme.mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Navbar />
      <SettingsPanel />
      
      {isEditAccessGranted && (
        <button
          onClick={toggleEditMode}
          className={`fixed top-20 right-4 z-50 p-2 rounded-md shadow-lg transition-colors
                      ${editMode ? 'bg-red-500 hover:bg-red-600' : `${theme.primaryColor} hover:opacity-90`} text-white`}
          aria-label={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
          {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </button>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Routes>
          <Route path="/" element={<AboutSection id={SectionType.ABOUT.toLowerCase()} data={profileData.about} />} />
          <Route path="/about" element={<Navigate replace to="/" />} />
          
          {profileData.sectionsOrder.map(sectionType => {
            const path = `/${sectionType.toLowerCase()}`;
            if (sectionType === SectionType.ABOUT) return null; // Already handled by "/"

            switch (sectionType) {
              case SectionType.EXPERIENCE:
                return <Route key={sectionType} path={path} element={<ExperienceSection id={sectionType.toLowerCase()} data={profileData.experience} />} />;
              case SectionType.SKILLS:
                return <Route key={sectionType} path={path} element={<SkillsSection id={sectionType.toLowerCase()} data={profileData.skills} />} />;
              case SectionType.PORTFOLIO:
                return <Route key={sectionType} path={path} element={<PortfolioSection id={sectionType.toLowerCase()} data={profileData.portfolio} />} />;
              case SectionType.CONTACT:
                return <Route key={sectionType} path={path} element={<ContactSection id={sectionType.toLowerCase()} data={profileData.contact} />} />;
              case SectionType.EDUCATION:
                 return <Route key={sectionType} path={path} element={<EducationPage data={profileData.education} />} />;
              case SectionType.TESTIMONIALS:
                return <Route key={sectionType} path={path} element={<TestimonialsPage data={profileData.testimonials} />} />;
              // For CUSTOM sections, you might need a more dynamic routing strategy if there are many,
              // or handle them based on their ID if they are unique.
              // This example assumes CUSTOM sections are not part of general navigation in this way.
              // If they were, each custom section would need a unique path.
              default:
                // Handle custom sections if needed, or return null for unhandled section types.
                // const customSectionData = getCustomSectionData(sectionType); // This logic needs to align if SectionType enum can include custom IDs
                // if (customSectionData) {
                //   return <Route key={sectionType} path={path} element={<CustomPage data={customSectionData} />} />;
                // }
                return null; 
            }
          })}
          {/* Fallback for any other path */}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
