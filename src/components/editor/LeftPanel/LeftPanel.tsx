import React, { useState } from 'react';
import { Plus, Layers, FileText, Image, ShoppingBag, Settings } from 'lucide-react';
import { ElementsTab } from './ElementsTab';
import { PagesTab } from './PagesTab';
import { LayersTab } from './LayersTab';
import { MediaTab } from './MediaTab';
import { StoreTab } from './StoreTab';
import { SettingsTab } from './SettingsTab';
import { CanvasElement, WebPage, StoreProduct, ProjectSettings } from '../../../types';

type LeftPanelTab = 'elements' | 'pages' | 'layers' | 'media' | 'store' | 'settings';

interface LeftPanelProps {
  pages: WebPage[];
  activePageId: string;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  products: StoreProduct[];
  settings: ProjectSettings;
  onAddElement: (element: CanvasElement) => void;
  onSelectPage: (id: string) => void;
  onAddPage: (page: WebPage) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onSetHomePage: (id: string) => void;
  onSelectElement: (el: CanvasElement) => void;
  onMoveElementUp: (id: string) => void;
  onMoveElementDown: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateElementSrc: (src: string) => void;
  onBindProduct: (product: StoreProduct) => void;
  onUpdateSettings: (updated: Partial<ProjectSettings>) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  pages,
  activePageId,
  elements,
  selectedElement,
  products,
  settings,
  onAddElement,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  onSetHomePage,
  onSelectElement,
  onMoveElementUp,
  onMoveElementDown,
  onDeleteElement,
  onUpdateElementSrc,
  onBindProduct,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>('elements');

  const tabs = [
    { id: 'elements' as LeftPanelTab, label: 'Add Blocks', icon: Plus },
    { id: 'pages' as LeftPanelTab, label: 'Pages', icon: FileText },
    { id: 'layers' as LeftPanelTab, label: 'Layers', icon: Layers },
    { id: 'media' as LeftPanelTab, label: 'Media', icon: Image },
    { id: 'store' as LeftPanelTab, label: 'Store', icon: ShoppingBag },
    { id: 'settings' as LeftPanelTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-80 bg-[#F9F7F2] border-r border-[#1A1A1A]/10 flex flex-col shrink-0 h-[calc(100vh-4rem)] text-[#1A1A1A]">
      {/* Top Navigation Tabs */}
      <div className="flex items-center bg-[#E5E2D9] border-b border-[#1A1A1A]/10 p-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all min-w-[48px] ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F9F7F2]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] uppercase tracking-wider whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && <ElementsTab onAddElement={onAddElement} />}
        {activeTab === 'pages' && (
          <PagesTab
            pages={pages}
            activePageId={activePageId}
            onSelectPage={onSelectPage}
            onAddPage={onAddPage}
            onDeletePage={onDeletePage}
            onDuplicatePage={onDuplicatePage}
            onSetHomePage={onSetHomePage}
          />
        )}
        {activeTab === 'layers' && (
          <LayersTab
            elements={elements}
            selectedElementId={selectedElement ? selectedElement.id : null}
            onSelectElement={onSelectElement}
            onMoveUp={onMoveElementUp}
            onMoveDown={onMoveElementDown}
            onDeleteElement={onDeleteElement}
          />
        )}
        {activeTab === 'media' && (
          <MediaTab selectedElement={selectedElement} onUpdateElementSrc={onUpdateElementSrc} />
        )}
        {activeTab === 'store' && (
          <StoreTab products={products} selectedElement={selectedElement} onBindProduct={onBindProduct} />
        )}
        {activeTab === 'settings' && <SettingsTab settings={settings} onUpdateSettings={onUpdateSettings} />}
      </div>
    </aside>
  );
};
