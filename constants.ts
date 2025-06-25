
import { ProfileData, SectionType, ThemeSettings } from './types';

export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: 'bg-blue-600', // Tailwind bg class
  secondaryColor: 'bg-indigo-500', // Tailwind bg class
  fontFamily: 'font-sans', // Tailwind font family class
  mode: 'light',
};

export const PREDEFINED_THEMES: Record<string, ThemeSettings> = {
  default: DEFAULT_THEME,
  sunset: { primaryColor: 'bg-red-500', secondaryColor: 'bg-orange-400', fontFamily: 'font-serif', mode: 'light' },
  forest: { primaryColor: 'bg-green-600', secondaryColor: 'bg-teal-500', fontFamily: 'font-mono', mode: 'light' },
  ocean: { primaryColor: 'bg-sky-600', secondaryColor: 'bg-cyan-500', fontFamily: 'font-sans', mode: 'light' },
  darkDefault: { primaryColor: 'bg-blue-500', secondaryColor: 'bg-indigo-400', fontFamily: 'font-sans', mode: 'dark' },
  darkPurple: { primaryColor: 'bg-purple-600', secondaryColor: 'bg-pink-500', fontFamily: 'font-serif', mode: 'dark' },
};

export const FONT_FAMILIES: Record<string, string> = {
  'Sans Serif': 'font-sans',
  'Serif': 'font-serif',
  'Monospace': 'font-mono',
  'Inter': 'font-[Inter,sans-serif]', // Assuming Inter is available or loaded
  'Roboto': 'font-[Roboto,sans-serif]', // Assuming Roboto is available or loaded
};

export const DEFAULT_PROFILE_DATA: ProfileData = {
  themeSettings: DEFAULT_THEME,
  sectionsOrder: [
    SectionType.ABOUT,
    SectionType.EXPERIENCE,
    SectionType.SKILLS,
    SectionType.PORTFOLIO,
    SectionType.CONTACT,
  ],
  about: {
    name: 'Your Name',
    title: 'Your Title / Profession',
    bio: 'A brief and engaging summary about yourself. Highlight your key strengths, passions, and what you do. Make it personal and professional. Click the edit icon to change this text!',
    profileImageUrl: 'https://picsum.photos/300/300',
    resumeUrl: '',
  },
  experience: {
    title: 'Work Experience',
    items: [
      { id: 'exp1', title: 'Software Engineer', company: 'Tech Solutions Inc.', period: 'Jan 2020 - Present', description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.' },
      { id: 'exp2', title: 'Junior Developer', company: 'Innovatech LLC', period: 'Jun 2018 - Dec 2019', description: 'Assisted in the development of mobile applications and websites. Gained experience in agile methodologies and software testing.' },
    ],
  },
  education: {
    title: 'Education',
    items: [
        { id: 'edu1', institution: 'University of Example', degree: 'B.S. in Computer Science', period: '2014 - 2018', description: 'Focused on software development and data structures.'}
    ],
  },
  skills: {
    title: 'Skills',
    items: [
      { id: 'skill1', name: 'React', level: 90 },
      { id: 'skill2', name: 'TypeScript', level: 85 },
      { id: 'skill3', name: 'Node.js', level: 80 },
      { id: 'skill4', name: 'Tailwind CSS', level: 95 },
    ],
  },
  portfolio: {
    title: 'Portfolio',
    items: [
      { id: 'proj1', title: 'Project Alpha', description: 'A personal finance tracker web application built with MERN stack.', imageUrl: 'https://picsum.photos/400/300?random=1', projectUrl: '#', repoUrl: '#' },
      { id: 'proj2', title: 'Project Beta', description: 'An e-commerce platform for handmade crafts.', imageUrl: 'https://picsum.photos/400/300?random=2', projectUrl: '#', videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },
  testimonials: {
    title: "Testimonials",
    items: [
        {id: 'test1', quote: "An amazing collaborator and a true asset to any team.", author: "Jane Doe", authorTitle: "CEO, ExampleCorp"}
    ]
  },
  contact: {
    title: 'Get In Touch',
    email: 'your.email@example.com',
    phone: '+1 234 567 8900',
    socialLinks: [
      { id: 'sl1', platform: 'LinkedIn', url: '#' },
      { id: 'sl2', platform: 'GitHub', url: '#' },
      { id: 'sl3', platform: 'Twitter', url: '#' },
    ],
    customMessage: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. Feel free to reach out!"
  },
  customSections: []
};
