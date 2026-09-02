export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type ElementType =
  // Basic
  | 'heading'
  | 'paragraph'
  | 'text'
  | 'button'
  | 'image'
  | 'video'
  | 'divider'
  | 'spacer'
  | 'icon'
  | 'badge'
  // Layout
  | 'container'
  | 'row'
  | 'columns'
  | 'card'
  | 'hero'
  | 'feature-grid'
  // Navigation
  | 'navbar'
  | 'footer'
  // Content blocks
  | 'services'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'stats'
  | 'team'
  // Media
  | 'slider'
  | 'gallery'
  // Forms
  | 'contact-form'
  | 'newsletter-form'
  | 'input'
  | 'textarea'
  // E-Commerce
  | 'product-card'
  | 'product-grid'
  | 'cart-drawer-trigger';

export interface ElementStyles {
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  fontSize?: string; // e.g. "16px", "2rem"
  fontWeight?: string; // "400", "600", "700", "bold"
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Box Model
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  width?: string; // e.g. "100%", "300px", "auto"
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  
  // Borders & Effects
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  boxShadow?: string;
  opacity?: number;
  
  // Flex / Layout
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
  
  // Hover & Misc
  hoverBackgroundColor?: string;
  hoverColor?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  content?: string;
  headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  src?: string;
  poster?: string;
  alt?: string;
  linkUrl?: string;
  targetPageId?: string; // Internal page route link e.g. "about"
  
  // Specific configurations
  buttonVariant?: 'solid' | 'outline' | 'ghost' | 'gradient';
  slides?: Array<{ id: string; image: string; caption?: string; title?: string }>;
  autoplay?: boolean;
  slideDuration?: number; // ms
  
  // Video settings
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  
  // E-Commerce bindings
  productId?: string;
  productPrice?: number;
  productSalePrice?: number;
  productImage?: string;
  productCategory?: string;
  
  // Form settings
  formAction?: string;
  placeholder?: string;
  required?: boolean;
  fieldLabel?: string;
  
  // Custom CSS classes
  customCss?: string;
  
  styles: ElementStyles;
  children?: CanvasElement[];
}

export interface WebPage {
  id: string;
  name: string;
  slug: string; // e.g. "home", "about", "store"
  title: string;
  seoDescription?: string;
  isHomePage?: boolean;
  elements: CanvasElement[];
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string; // Base64 or Blob URL or web URL
  type: 'image' | 'video';
  size: number; // bytes
  createdAt: string;
}

export interface ProjectSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  faviconUrl?: string;
  customHeadCode?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  category: 'business' | 'ecommerce' | 'portfolio' | 'saas' | 'blog' | 'general';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  thumbnail?: string;
  pages: WebPage[];
  products: StoreProduct[];
  settings: ProjectSettings;
  media: MediaAsset[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
}
