import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Wifi, 
  DollarSign, 
  Calendar, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { t } from '../utils/translations';

interface NavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
  language: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onScreenChange,
  language,
  isOpen,
  onToggle,
}) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard', language) },
    { id: 'inventory', icon: Package, label: t('inventory', language) },
    { id: 'channels', icon: Wifi, label: t('channels', language) },
    { id: 'pricing', icon: DollarSign, label: t('pricing', language) },
    { id: 'calendar', icon: Calendar, label: t('calendar', language) },
    { id: 'settings', icon: Settings, label: t('settings', language) },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight text-center">
              HotelManager
            </h1>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onScreenChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} className="mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-tight text-truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};