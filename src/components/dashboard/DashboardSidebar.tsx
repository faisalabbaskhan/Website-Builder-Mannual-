import React from 'react';
import { LayoutGrid, LayoutTemplate, Image, ShoppingBag, Settings, HardDrive, Cpu } from 'lucide-react';

export type DashboardTab = 'projects' | 'templates' | 'media' | 'store' | 'settings';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  projectCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onSelectTab, projectCount }) => {
  const menuItems = [
    { id: 'projects' as DashboardTab, label: 'Website Archive', icon: LayoutGrid, count: projectCount },
    { id: 'templates' as DashboardTab, label: 'Atelier Presets', icon: LayoutTemplate },
    { id: 'media' as DashboardTab, label: 'Media Library', icon: Image },
    { id: 'store' as DashboardTab, label: 'Store Inventory', icon: ShoppingBag },
    { id: 'settings' as DashboardTab, label: 'Workspace Config', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#E5E2D9] border-r border-[#1A1A1A]/10 p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/50 px-3">ATELIER NAVIGATION</span>
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F9F7F2] shadow-sm'
                      : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#F9F7F2]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#F9F7F2] text-[#1A1A1A]' : 'bg-[#DED9CE] text-[#1A1A1A]/70'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Cloud Storage & System Usage Widget */}
      <div className="p-3.5 bg-[#F9F7F2] border border-[#1A1A1A]/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-[#1A1A1A]" /> Asset Storage
          </span>
          <span className="text-[#1A1A1A]/60 text-[11px]">2.4 MB / 1 GB</span>
        </div>
        <div className="w-full bg-[#E5E2D9] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#1A1A1A] h-full w-[12%]" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest font-mono">
          <Cpu className="w-3 h-3 text-[#1A1A1A]" /> Atelier Services Operational
        </div>
      </div>
    </aside>
  );
};
