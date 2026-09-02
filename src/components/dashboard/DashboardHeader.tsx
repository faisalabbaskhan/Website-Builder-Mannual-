import React, { useState } from 'react';
import { Sparkles, Plus, Search, Bell, LogOut, User as UserIcon, CheckCircle, FolderPlus } from 'lucide-react';
import { User } from '../../types';

interface DashboardHeaderProps {
  user: User;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateNewProject: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onCreateNewProject,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 'n1', title: 'Welcome to Studio Lumen Atelier', time: '2 mins ago', read: false },
    { id: 'n2', title: 'Luxe Store project export generated', time: '1 hour ago', read: true },
  ];

  return (
    <header className="h-16 bg-[#F9F7F2] border-b border-[#1A1A1A]/10 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-[#1A1A1A] bg-[#E5E2D9] flex items-center justify-center text-[#1A1A1A]">
          <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
        </div>
        <div>
          <span className="font-bold text-[#1A1A1A] text-lg tracking-tight uppercase font-sans">STUDIO_LUMEN</span>
          <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 ml-2 rounded-full bg-[#E5E2D9] text-[#1A1A1A] border border-[#1A1A1A]/20 uppercase">
            ATELIER
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className="w-3.5 h-3.5 text-[#1A1A1A]/50 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, archives..."
          className="w-full bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] transition-all"
        />
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Create Project Button */}
        <button
          onClick={onCreateNewProject}
          className="bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] font-semibold text-xs px-4 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#E5E2D9] border border-[#1A1A1A]/10 text-[#1A1A1A] hover:border-[#1A1A1A]/30 flex items-center justify-center relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#1A1A1A] absolute top-2 right-2 ring-2 ring-[#F9F7F2]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Dispatches</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#E5E2D9] px-2 py-0.5 rounded-full border border-[#1A1A1A]/10">Activity</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-[#E5E2D9] rounded-xl border border-[#1A1A1A]/10 text-xs">
                    <p className="font-medium text-[#1A1A1A]">{n.title}</p>
                    <span className="text-[10px] text-[#1A1A1A]/60">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 py-1 pr-2 rounded-full bg-[#E5E2D9] border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 transition-colors"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-[#1A1A1A]/20"
            />
            <span className="text-xs font-semibold text-[#1A1A1A] hidden sm:inline">{user.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#F9F7F2] border border-[#1A1A1A]/15 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-[#1A1A1A]/10 mb-1">
                <p className="text-xs font-bold text-[#1A1A1A]">{user.name}</p>
                <p className="text-[11px] text-[#1A1A1A]/60 truncate">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-100/60 rounded-xl flex items-center gap-2 transition-colors font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
