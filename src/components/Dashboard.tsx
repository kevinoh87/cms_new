import React from 'react';
import { 
  Home, 
  Users, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  LogOut,
  Clock,
  AlertCircle
} from 'lucide-react';
import { t } from '../utils/translations';
import { mockRooms, mockReservations } from '../utils/mockData';

interface DashboardProps {
  language: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const occupancyRate = Math.round((mockRooms.filter(r => r.status === 'occupied').length / mockRooms.length) * 100);
  const todayRevenue = mockReservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const avgRoomRate = Math.round(mockRooms.reduce((sum, r) => sum + r.price, 0) / mockRooms.length);
  const roomsNeedCleaning = mockRooms.filter(r => r.status === 'cleaning').length;

  const stats = [
    {
      title: t('totalRooms', language),
      value: mockRooms.length.toString(),
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      title: t('occupancyRate', language),
      value: `${occupancyRate}%`,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: t('todayRevenue', language),
      value: `$${todayRevenue}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: t('avgRoomRate', language),
      value: `$${avgRoomRate}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    {
      title: t('checkInsToday', language),
      count: 2,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      action: 'View Check-ins',
    },
    {
      title: t('checkOutsToday', language),
      count: 1,
      icon: LogOut,
      color: 'bg-blue-100 text-blue-800',
      action: 'View Check-outs',
    },
    {
      title: t('roomsNeedCleaning', language),
      count: roomsNeedCleaning,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      action: 'Manage Housekeeping',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-container">
          <h1 className="section-title">{t('dashboard', language)}</h1>
        </div>
        <div className="flex-shrink-0">
          <button className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-text">
            {t('syncChannels', language)}
          </button>
        </div>
      </div>

      {/* Stats Grid - Enhanced for better readability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex items-center space-x-4">
                  <div className={`${stat.color} p-3 sm:p-4 rounded-lg flex-shrink-0`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-600 mb-2 leading-tight">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="responsive-grid grid-cols-1 md:grid-cols-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div key={index} className="card-container">
              <div className="text-container">
                <div className="flex items-center justify-between mb-4">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="subsection-title text-base sm:text-lg text-truncate-2">{action.title}</h3>
                    <p className="stat-value mt-2">{action.count}</p>
                  </div>
                  <div className={`${action.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon size={24} />
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors btn-text">
                  {action.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Status Overview */}
      <div className="card-container">
        <div className="text-container border-b border-gray-200">
          <h2 className="subsection-title">Room Status Overview</h2>
        </div>
        
        <div className="text-container">
          <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {mockRooms.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base block text-truncate">
                      Room {room.number}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 text-truncate block">
                      {room.type}
                    </span>
                  </div>
                </div>
                <div className={`
                  px-3 py-2 rounded-full text-xs sm:text-sm font-medium text-center mb-3
                  ${room.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                  ${room.status === 'occupied' ? 'bg-red-100 text-red-800' : ''}
                  ${room.status === 'cleaning' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${room.status === 'maintenance' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {t(room.status, language)}
                </div>
                <div className="text-center">
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    ${room.price}/night
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};