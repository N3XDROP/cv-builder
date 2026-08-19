export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  comments?: string;
  period: string;
};

export type CVData = {
  name: string;
  title: string;
  github: string;
  certificados: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  hardSkills: string[];
  softSkills: string[];
};
