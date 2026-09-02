import React from 'react';
import {
  Type,
  Heading,
  MousePointerClick,
  Image as ImageIcon,
  Video,
  Box,
  LayoutGrid,
  Columns,
  Sparkles,
  ShoppingBag,
  Mail,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Users,
} from 'lucide-react';
import { ElementType, CanvasElement } from '../../../types';
import { generateId } from '../../../utils/idGenerator';

interface ElementsTabProps {
  onAddElement: (element: CanvasElement) => void;
}

export const ElementsTab: React.FC<ElementsTabProps> = ({ onAddElement }) => {
  const createElement = (type: ElementType, customProps: Partial<CanvasElement> = {}): CanvasElement => {
    return {
      id: generateId(type),
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      styles: {
        paddingTop: '16px',
        paddingBottom: '16px',
      },
      ...customProps,
    };
  };

  const categories = [
    {
      title: 'Basic Elements',
      items: [
        {
          label: 'Heading',
          icon: Heading,
          onClick: () =>
            onAddElement(
              createElement('heading', {
                content: 'Heading Title Text',
                headingTag: 'h2',
                styles: { fontSize: '2rem', fontWeight: 'bold', color: '#1A1A1A' },
              })
            ),
        },
        {
          label: 'Paragraph',
          icon: Type,
          onClick: () =>
            onAddElement(
              createElement('paragraph', {
                content: 'Add your paragraph description text here to engage your website visitors.',
                styles: { fontSize: '1rem', color: '#1A1A1A', lineHeight: '1.6' },
              })
            ),
        },
        {
          label: 'Button',
          icon: MousePointerClick,
          onClick: () =>
            onAddElement(
              createElement('button', {
                content: 'Call To Action',
                buttonVariant: 'solid',
                styles: { paddingTop: '12px', paddingBottom: '12px', paddingLeft: '24px', paddingRight: '24px' },
              })
            ),
        },
        {
          label: 'Image',
          icon: ImageIcon,
          onClick: () =>
            onAddElement(
              createElement('image', {
                src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
                styles: { width: '100%', height: '320px', borderRadius: '12px' },
              })
            ),
        },
        {
          label: 'Video',
          icon: Video,
          onClick: () =>
            onAddElement(
              createElement('video', {
                controls: true,
                poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                styles: { width: '100%', height: '360px', borderRadius: '12px' },
              })
            ),
        },
      ],
    },
    {
      title: 'Layout & Containers',
      items: [
        {
          label: 'Container Box',
          icon: Box,
          onClick: () =>
            onAddElement(
              createElement('container', {
                styles: {
                  paddingTop: '32px',
                  paddingBottom: '32px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  backgroundColor: '#E5E2D9',
                  borderRadius: '16px',
                },
                children: [],
              })
            ),
        },
        {
          label: 'Hero Banner',
          icon: Sparkles,
          onClick: () =>
            onAddElement(
              createElement('hero', {
                content: 'Transform Your Digital Canvas',
                styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#E5E2D9' },
              })
            ),
        },
        {
          label: 'Feature Grid',
          icon: LayoutGrid,
          onClick: () =>
            onAddElement(
              createElement('feature-grid', {
                styles: { paddingTop: '64px', paddingBottom: '64px', backgroundColor: '#F9F7F2' },
              })
            ),
        },
      ],
    },
    {
      title: 'E-Commerce & Content',
      items: [
        {
          label: 'Product Grid',
          icon: ShoppingBag,
          onClick: () =>
            onAddElement(
              createElement('product-grid', {
                styles: { paddingTop: '48px', paddingBottom: '48px' },
              })
            ),
        },
        {
          label: 'Contact Form',
          icon: Mail,
          onClick: () =>
            onAddElement(
              createElement('contact-form', {
                styles: { paddingTop: '64px', paddingBottom: '64px', backgroundColor: '#E5E2D9' },
              })
            ),
        },
        {
          label: 'Footer Bar',
          icon: ShieldCheck,
          onClick: () =>
            onAddElement(
              createElement('footer', {
                styles: { paddingTop: '32px', paddingBottom: '32px', backgroundColor: '#1A1A1A', color: '#F9F7F2' },
              })
            ),
        },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-6 text-[#1A1A1A]">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Add Canvas Elements</h3>
        <p className="text-xs text-[#1A1A1A]/60 mt-0.5">Click any block below to insert into active page.</p>
      </div>

      {categories.map((cat, idx) => (
        <div key={idx} className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">{cat.title}</span>
          <div className="grid grid-cols-2 gap-2">
            {cat.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="p-3 bg-[#E5E2D9] border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-[#1A1A1A] transition-all shadow-xs group text-center"
                >
                  <Icon className="w-5 h-5 text-[#1A1A1A] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
