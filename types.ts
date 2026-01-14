export interface PropertyDetails {
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string[];
  imageUrl: string;
}

export interface Listing extends PropertyDetails {
  id: string;
  status: 'active' | 'pending' | 'sold';
  dateAdded: Date;
}

export interface SocialPost {
  id: string;
  platforms: ('instagram' | 'facebook' | 'linkedin')[];
  content: string;
  hashtags: string[];
  scheduledDate: Date | null;
  status: 'draft' | 'scheduled' | 'published';
  templateId: string;
  propertyDetails: PropertyDetails;
}

export type TemplateType = 
  | 'just-listed' 
  | 'open-house' 
  | 'sold' 
  | 'price-drop'
  | 'modern-minimal'
  | 'luxury-serif'
  | 'bold-grid'
  | 'geometric-pop'
  | 'feature-split'
  | 'story-portrait'
  | 'classic-card'
  | 'under-contract'
  | 'new-price'
  | 'neighborhood-focus'
  | 'sidebar-listing'
  | 'diagonal-feature'
  | 'soft-luxury'
  | 'custom-builder';

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  thumbnail: string;
}

export interface ImageStyles {
  brightness: number; // 0-200, default 100
  contrast: number;   // 0-200, default 100
  saturation: number; // 0-200, default 100
  sepia: number;      // 0-100, default 0
  blur: number;       // 0-20, default 0
  zoom: number;       // 1-2, default 1
  rotation: number;   // 0-360, default 0
}

export interface LayoutConfig {
  showLogo: boolean;
  showAgentInfo: boolean;
  showBadge: boolean;
  textAlignment: 'left' | 'center' | 'right';
  contentPosition: 'top' | 'center' | 'bottom' | 'below-image'; // Added 'below-image' for split view
  headerStyle?: 'transparent' | 'solid-primary' | 'solid-secondary' | 'solid-white';
  footerStyle?: 'transparent' | 'solid-primary' | 'solid-secondary' | 'solid-white' | 'minimal';
}

export interface TemplateConfig {
  badgeText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  overlayOpacity?: number;
  imageStyles?: ImageStyles;
  layout?: LayoutConfig;
}

export interface CustomTemplate {
  id: string;
  name: string;
  baseTemplateId: TemplateType;
  config: TemplateConfig;
  createdAt: Date;
}

export const STANDARD_TEMPLATES: {id: TemplateType, label: string}[] = [
    { id: 'custom-builder', label: 'Blank Canvas' },
    { id: 'just-listed', label: 'Just Listed' },
    { id: 'sidebar-listing', label: 'Sidebar Modern' },
    { id: 'diagonal-feature', label: 'Diagonal Accent' },
    { id: 'soft-luxury', label: 'Soft Luxury' },
    { id: 'modern-minimal', label: 'Minimalist' },
    { id: 'luxury-serif', label: 'Luxury' },
    { id: 'story-portrait', label: 'Story Style' },
    { id: 'bold-grid', label: 'Bold Grid' },
    { id: 'feature-split', label: 'Split View' },
    { id: 'open-house', label: 'Open House' },
    { id: 'geometric-pop', label: 'Geometric' },
    { id: 'classic-card', label: 'Classic' },
    { id: 'under-contract', label: 'Contract' },
    { id: 'sold', label: 'Sold' },
    { id: 'price-drop', label: 'Price Drop' },
    { id: 'new-price', label: 'New Price' },
    { id: 'neighborhood-focus', label: 'Location' },
];

export interface GeneratedCaptionResponse {
  caption: string;
  hashtags: string[];
}

export interface BrandSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'Inter' | 'Playfair Display' | 'Montserrat' | 'Lato';
  logoUrl: string | null;
  agentName: string;
  agentPhotoUrl: string | null;
  agencyName: string;
  website: string;
  phone: string;
  email: string;
}