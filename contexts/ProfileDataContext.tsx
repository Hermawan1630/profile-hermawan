
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProfileData, AboutSectionData, ExperienceItem, SkillItem, PortfolioItem, ContactSectionData, SocialLink, SectionType, ThemeSettings, CustomSectionData, EducationSectionData, TestimonialSectionData, EducationItem, TestimonialItem } from '../types';
import { DEFAULT_PROFILE_DATA, DEFAULT_THEME } from '../constants';
import { v4 as uuidv4 } from 'uuid';


interface ProfileDataContextType {
  profileData: ProfileData;
  editMode: boolean;
  isEditAccessGranted: boolean; // To control if edit mode can be entered at all
  setProfileData: (data: ProfileData) => void;
  updateAbout: (updatedAbout: Partial<AboutSectionData>) => void;
  addExperienceItem: (item: Omit<ExperienceItem, 'id'>) => void;
  updateExperienceItem: (item: ExperienceItem) => void;
  deleteExperienceItem: (itemId: string) => void;
  addEducationItem: (item: Omit<EducationItem, 'id'>) => void;
  updateEducationItem: (item: EducationItem) => void;
  deleteEducationItem: (itemId: string) => void;
  addSkillItem: (item: Omit<SkillItem, 'id'>) => void;
  updateSkillItem: (item: SkillItem) => void;
  deleteSkillItem: (itemId: string) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (itemId: string) => void;
  addTestimonialItem: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonialItem: (item: TestimonialItem) => void;
  deleteTestimonialItem: (itemId: string) => void;
  updateContact: (updatedContact: Partial<ContactSectionData>) => void;
  addSocialLink: (item: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (item: SocialLink) => void;
  deleteSocialLink: (itemId: string) => void;
  toggleEditMode: () => void;
  updateSectionData: <K extends keyof ProfileData>(sectionKey: K, data: ProfileData[K]) => void;
  updateSectionsOrder: (newOrder: SectionType[]) => void;
}

export const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined);

interface ProfileDataProviderProps {
  children: ReactNode;
}

const initializeProfileData = (): ProfileData => {
  const storedDataString = localStorage.getItem('profileData');
  let loadedData: Partial<ProfileData> = {};

  if (storedDataString) {
    try {
      loadedData = JSON.parse(storedDataString);
    } catch (e) {
      console.error("Failed to parse profileData from localStorage", e);
      // Fallback to complete default if parsing fails
      return DEFAULT_PROFILE_DATA;
    }
  }

  const result = { ...DEFAULT_PROFILE_DATA };

  // Helper to merge section data (like about, experience, etc.)
  const mergeSection = <T extends keyof ProfileData>(key: T, defaultSectionData: ProfileData[T], loadedSectionData?: Partial<ProfileData[T]>) => {
    const section = { ...(defaultSectionData as object), ...(loadedSectionData as object || {}) } as ProfileData[T];
    // Ensure 'items' array exists if default has it and loaded data might have messed it up
    if (defaultSectionData && typeof defaultSectionData === 'object' && 'items' in defaultSectionData && Array.isArray((defaultSectionData as any).items)) {
        if (!(section as any).items || !Array.isArray((section as any).items)) {
            (section as any).items = (defaultSectionData as any).items;
        }
    }
    return section;
  };
  
  result.about = mergeSection('about', DEFAULT_PROFILE_DATA.about, loadedData.about);
  result.experience = mergeSection('experience', DEFAULT_PROFILE_DATA.experience, loadedData.experience);
  result.education = mergeSection('education', DEFAULT_PROFILE_DATA.education, loadedData.education);
  result.skills = mergeSection('skills', DEFAULT_PROFILE_DATA.skills, loadedData.skills);
  result.portfolio = mergeSection('portfolio', DEFAULT_PROFILE_DATA.portfolio, loadedData.portfolio);
  result.testimonials = mergeSection('testimonials', DEFAULT_PROFILE_DATA.testimonials, loadedData.testimonials);
  result.contact = mergeSection('contact', DEFAULT_PROFILE_DATA.contact, loadedData.contact);

  // Handle sectionsOrder with validation
  if (loadedData.sectionsOrder && Array.isArray(loadedData.sectionsOrder) && loadedData.sectionsOrder.length > 0) {
    const validSectionTypes = Object.values(SectionType);
    const filteredOrder = loadedData.sectionsOrder.filter(
      type => typeof type === 'string' && validSectionTypes.includes(type as SectionType)
    );
    if (filteredOrder.length > 0) {
      result.sectionsOrder = filteredOrder as SectionType[];
    } else {
      console.warn("localStorage sectionsOrder was empty or invalid after filtering, resetting to default.");
      result.sectionsOrder = DEFAULT_PROFILE_DATA.sectionsOrder; // Default if all items were invalid
    }
  } else {
     result.sectionsOrder = DEFAULT_PROFILE_DATA.sectionsOrder; // Default if not present or empty array
  }
  
  // Handle themeSettings
  result.themeSettings = { ...DEFAULT_THEME, ...(loadedData.themeSettings || {}) };

  // Handle customSections (ensure it's an array)
  result.customSections = (Array.isArray(loadedData.customSections) ? loadedData.customSections : DEFAULT_PROFILE_DATA.customSections) as CustomSectionData[];

  return result;
};


export const ProfileDataProvider: React.FC<ProfileDataProviderProps> = ({ children }) => {
  const [profileData, setProfileDataState] = useState<ProfileData>(initializeProfileData);
  
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isEditAccessGranted, setIsEditAccessGranted] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const unlockParam = queryParams.get('unlock_edit');
    const emailParam = queryParams.get('editor_email');
    const passwordParam = queryParams.get('editor_password');
    
    const allowedEmail = 'hermawantrisantoso96@gmail.com';
    const allowedPassword = 'hermawanadmin161005';

    if (unlockParam === 'true' && emailParam === allowedEmail && passwordParam === allowedPassword) {
      setIsEditAccessGranted(true);
    } else {
      setIsEditAccessGranted(false);
      if (editMode) {
        setEditMode(false);
      }
    }
  }, [editMode]); // Added editMode to dependencies to re-check if URL changes or on initial load

  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  const setProfileData = (data: ProfileData) => {
    setProfileDataState(data);
  };

  const updateSectionData = useCallback(<K extends keyof ProfileData>(sectionKey: K, data: ProfileData[K]) => {
    setProfileDataState(prev => ({ ...prev, [sectionKey]: data }));
  }, []);

  const updateAbout = useCallback((updatedAbout: Partial<AboutSectionData>) => {
    setProfileDataState(prev => ({ ...prev, about: { ...prev.about, ...updatedAbout } }));
  }, []);

  // Experience
  const addExperienceItem = useCallback((item: Omit<ExperienceItem, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      experience: { ...prev.experience, items: [...prev.experience.items, { ...item, id: uuidv4() }] },
    }));
  }, []);

  const updateExperienceItem = useCallback((updatedItem: ExperienceItem) => {
    setProfileDataState(prev => ({
      ...prev,
      experience: { ...prev.experience, items: prev.experience.items.map(item => item.id === updatedItem.id ? updatedItem : item) },
    }));
  }, []);

  const deleteExperienceItem = useCallback((itemId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      experience: { ...prev.experience, items: prev.experience.items.filter(item => item.id !== itemId) },
    }));
  }, []);

  // Education
  const addEducationItem = useCallback((item: Omit<EducationItem, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      education: { ...prev.education, items: [...prev.education.items, { ...item, id: uuidv4() }] },
    }));
  }, []);

  const updateEducationItem = useCallback((updatedItem: EducationItem) => {
    setProfileDataState(prev => ({
      ...prev,
      education: { ...prev.education, items: prev.education.items.map(item => item.id === updatedItem.id ? updatedItem : item) },
    }));
  }, []);

  const deleteEducationItem = useCallback((itemId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      education: { ...prev.education, items: prev.education.items.filter(item => item.id !== itemId) },
    }));
  }, []);


  // Skills
  const addSkillItem = useCallback((item: Omit<SkillItem, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      skills: { ...prev.skills, items: [...prev.skills.items, { ...item, id: uuidv4() }] },
    }));
  }, []);

  const updateSkillItem = useCallback((updatedItem: SkillItem) => {
    setProfileDataState(prev => ({
      ...prev,
      skills: { ...prev.skills, items: prev.skills.items.map(item => item.id === updatedItem.id ? updatedItem : item) },
    }));
  }, []);
  
  const deleteSkillItem = useCallback((itemId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      skills: { ...prev.skills, items: prev.skills.items.filter(item => item.id !== itemId) },
    }));
  }, []);

  // Portfolio
  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: [...prev.portfolio.items, { ...item, id: uuidv4() }] },
    }));
  }, []);

  const updatePortfolioItem = useCallback((updatedItem: PortfolioItem) => {
     setProfileDataState(prev => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: prev.portfolio.items.map(item => item.id === updatedItem.id ? updatedItem : item) },
    }));
  }, []);

  const deletePortfolioItem = useCallback((itemId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: prev.portfolio.items.filter(item => item.id !== itemId) },
    }));
  }, []);

  // Testimonials
  const addTestimonialItem = useCallback((item: Omit<TestimonialItem, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: [...prev.testimonials.items, { ...item, id: uuidv4() }] },
    }));
  }, []);

  const updateTestimonialItem = useCallback((updatedItem: TestimonialItem) => {
    setProfileDataState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: prev.testimonials.items.map(item => item.id === updatedItem.id ? updatedItem : item) },
    }));
  }, []);

  const deleteTestimonialItem = useCallback((itemId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: prev.testimonials.items.filter(item => item.id !== itemId) },
    }));
  }, []);
  
  // Contact & Social Links
  const updateContact = useCallback((updatedContact: Partial<ContactSectionData>) => {
    setProfileDataState(prev => ({ ...prev, contact: { ...prev.contact, ...updatedContact } }));
  }, []);

  const addSocialLink = useCallback((link: Omit<SocialLink, 'id'>) => {
    setProfileDataState(prev => ({
      ...prev,
      contact: { ...prev.contact, socialLinks: [...prev.contact.socialLinks, { ...link, id: uuidv4() }] },
    }));
  }, []);

  const updateSocialLink = useCallback((updatedLink: SocialLink) => {
    setProfileDataState(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialLinks: prev.contact.socialLinks.map(link => link.id === updatedLink.id ? updatedLink : link),
      },
    }));
  }, []);
  
  const deleteSocialLink = useCallback((linkId: string) => {
    setProfileDataState(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialLinks: prev.contact.socialLinks.filter(link => link.id !== linkId),
      },
    }));
  }, []);

  const toggleEditMode = useCallback(() => {
    if (isEditAccessGranted) {
      setEditMode(prev => !prev);
    } else {
        setEditMode(false);
        console.warn("Attempted to toggle edit mode without access.");
    }
  }, [isEditAccessGranted]);

  const updateSectionsOrder = useCallback((newOrder: SectionType[]) => {
    setProfileDataState(prev => ({...prev, sectionsOrder: newOrder }));
  }, []);

  return (
    <ProfileDataContext.Provider value={{ 
      profileData, 
      editMode,
      isEditAccessGranted, 
      setProfileData, 
      updateAbout,
      addExperienceItem, updateExperienceItem, deleteExperienceItem,
      addEducationItem, updateEducationItem, deleteEducationItem,
      addSkillItem, updateSkillItem, deleteSkillItem,
      addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      addTestimonialItem, updateTestimonialItem, deleteTestimonialItem,
      updateContact, addSocialLink, updateSocialLink, deleteSocialLink,
      toggleEditMode, updateSectionData, updateSectionsOrder
    }}>
      {children}
    </ProfileDataContext.Provider>
  );
};
