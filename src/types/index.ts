export type ProjectCategory = "FinTech" | "Tokenization" | "Payments" | "strategy" | "Sports Media";

export type AspectRatio = "portrait" | "landscape" | "square";

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  projectType?: "case-study" | "product-demo";
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  client?: string;
  slug: string;
  externalUrl?: string;
}

export interface PersonInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string[];
  interests: string[];
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}
