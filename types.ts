
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  mode: 'light' | 'dark';
}

export enum SectionType {
  ABOUT = 'ABOUT',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PORTFOLIO = 'PORTFOLIO',
  TESTIMONIALS = 'TESTIMONIALS',
  CONTACT = 'CONTACT',
  CUSTOM = 'CUSTOM',
}

export interface AboutSectionData {
  name: string;
  title: string;
  bio: string;
  profileImageUrl: string;
  resumeUrl?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  achievements?: string[];
}
export interface ExperienceSectionData {
  title: string;
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description?: string;
}

export interface EducationSectionData {
  title: string;
  items: EducationItem[];
}


export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
  icon?: string; // e.g., SVG path or class name for an icon library
}
export interface SkillsSectionData {
  title: string;
  items: SkillItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  repoUrl?: string;
  tags?: string[];
  videoEmbedUrl?: string; // For YouTube/Vimeo embeds
}
export interface PortfolioSectionData {
  title: string;
  items: PortfolioItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  authorTitle?: string;
  authorImageUrl?: string;
}

export interface TestimonialSectionData {
  title: string;
  items: TestimonialItem[];
}

export interface SocialLink {
  id: string;
  platform: 'LinkedIn' | 'GitHub' | 'Twitter' | 'Instagram' | 'Website' | string; // Allow custom platforms
  url: string;
  icon?: React.ReactNode; // Optional: for custom SVG icons
}
export interface ContactSectionData {
  title: string;
  email: string;
  phone?: string;
  socialLinks: SocialLink[];
  customMessage?: string; // e.g. "Feel free to reach out!"
}

export interface CustomSectionBlock {
 id: string;
 type: 'text' | 'image' | 'video'; // More types can be added
 content: string; // Text content, image URL, or video embed URL
}

export interface CustomSectionData {
  id: string;
  title: string;
  layout?: 'single-column' | 'two-column-equal' | 'two-column-aside-left' | 'two-column-aside-right';
  blocks: CustomSectionBlock[];
}


export interface ProfileData {
  themeSettings: ThemeSettings;
  sectionsOrder: SectionType[];
  about: AboutSectionData;
  experience: ExperienceSectionData;
  education: EducationSectionData;
  skills: SkillsSectionData;
  portfolio: PortfolioSectionData;
  testimonials: TestimonialSectionData;
  contact: ContactSectionData;
  customSections: CustomSectionData[]; // For blog-like or other custom content
}

// Props for components that edit parts of the profile data
export interface EditProps<T> {
  data: T;
  onUpdate: (updatedData: Partial<T>) => void;
}

export interface SectionProps<T> {
  id: string;
  data: T;
  // onUpdate specific to section might be passed via context or direct prop
}
