
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  onLogout: () => void;
  userRole: string;
  userName?: string;
}

const Sidebar = ({ items, activeItem, onItemClick, onLogout, userRole, userName }: SidebarProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  
  // Get display name from profile first, then fallback to user metadata, then email
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (userName) {
      return userName;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const displayName = getDisplayName();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center mb-4">
          <GraduationCap className="h-8 w-8 text-orange-500 mr-3" />
          <span className="text-xl font-bold text-white">CourseCompass</span>
        </div>
        <div className="text-sm text-gray-400 capitalize">{userRole} Portal</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800",
                activeItem === item.id && "bg-orange-600 text-white hover:bg-orange-700"
              )}
              onClick={() => onItemClick(item.id)}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="mb-3">
          <div className="text-sm text-gray-400">Signed in as</div>
          <div className="text-white font-medium">{displayName}</div>
          {user?.email && (
            <div className="text-xs text-gray-500">{user.email}</div>
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-3">Log Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
