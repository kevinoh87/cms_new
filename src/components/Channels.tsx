import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Settings, Plus, TrendingUp } from 'lucide-react';
import { t } from '../utils/translations';
import { mockChannels, mockRooms } from '../utils/mockData';
import { Channel } from '../types';

interface ChannelsProps {
  language: string;
}

export const Channels: React.FC<ChannelsProps> = ({ language }) => {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const getStatusIcon = (status: Channel['status']) => {
    switch (status) {
      case 'connected': return <Wifi size={20} className="text-green-600" />;
      case 'disconnected': return <WifiOff size={20} className="text-red-600" />;
      case 'syncing': return <RefreshCw size={20} className="text-blue-600 animate-spin" />;
      default: return null;
    }
  };

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-800 border-green-200';
      case 'disconnected': return 'bg-red-50 text-red-800 border-red-200';
      case 'syncing': return 'bg-blue-50 text-blue-800 border-blue-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const toggleChannelStatus = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, status: channel.status === 'connected' ? 'disconnected' : 'connected' }
        : channel
    ));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-container">
          <h1 className="section-title">{t('channels', language)}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center btn-text">
            <Plus size={20} className="mr-2 flex-shrink-0" />
            <span>Add Channel</span>
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center btn-text">
            <RefreshCw size={20} className="mr-2 flex-shrink-0" />
            <span>{t('syncChannels', language)}</span>
          </button>
        </div>
      </div>

      {/* Channel Overview */}
      <div className="responsive-grid grid-cols-1 md:grid-cols-3">
        <div className="card-container">
          <div className="text-container">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
                <Wifi size={24} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="stat-label mb-1">Connected Channels</p>
                <p className="stat-value">
                  {channels.filter(c => c.status === 'connected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-container">
          <div className="text-container">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="stat-label mb-1">Avg Commission</p>
                <p className="stat-value">
                  {Math.round(channels.reduce((sum, c) => sum + c.commission, 0) / channels.length)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-container">
          <div className="text-container">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-3 rounded-lg flex-shrink-0">
                <RefreshCw size={24} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="stat-label mb-1">Last Sync</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight">2 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`
              card-container cursor-pointer transition-all duration-200 hover:shadow-md border-2
              ${getStatusColor(channel.status)}
            `}
            onClick={() => setSelectedChannel(channel)}
          >
            <div className="text-container">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl sm:text-3xl">{channel.logo}</div>
                <div className="flex-shrink-0">
                  {getStatusIcon(channel.status)}
                </div>
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-truncate">{channel.name}</h3>
              <p className="text-xs sm:text-sm opacity-75 mb-3 text-truncate">{t(channel.status, language)}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Commission:</span>
                  <span className="font-medium">{channel.commission}%</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Bookings:</span>
                  <span className="font-medium">12 this month</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChannelStatus(channel.id);
                  }}
                  className={`
                    flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors font-medium
                    ${channel.status === 'connected' 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }
                  `}
                >
                  {channel.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
                <button className="px-3 py-2 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0">
                  <Settings size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Grid */}
      <div className="card-container">
        <div className="text-container border-b border-gray-200">
          <h2 className="subsection-title">Room Distribution Grid</h2>
          <p className="description-text mt-1">Manage room availability across all channels</p>
        </div>
        
        <div className="text-container overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm sm:text-base">
                    Room Type
                  </th>
                  {channels.filter(c => c.status === 'connected').map(channel => (
                    <th key={channel.id} className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg sm:text-xl">{channel.logo}</span>
                        <span className="text-xs sm:text-sm text-truncate">{channel.name}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm sm:text-base">
                    Total Available
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...new Set(mockRooms.map(r => r.type))].map(roomType => {
                  const availableRooms = mockRooms.filter(r => r.type === roomType && r.status === 'available').length;
                  
                  return (
                    <tr key={roomType} className="border-b border-gray-100">
                      <td className="py-4 px-2 sm:px-4 font-medium text-gray-900 text-sm sm:text-base">
                        {roomType}
                      </td>
                      {channels.filter(c => c.status === 'connected').map(channel => (
                        <td key={channel.id} className="py-4 px-2 sm:px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={availableRooms}
                            defaultValue={Math.floor(availableRooms / 2)}
                            className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                      ))}
                      <td className="py-4 px-2 sm:px-4 text-center font-medium text-green-600 text-sm sm:text-base">
                        {availableRooms}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btn-text">
              Update Distribution
            </button>
          </div>
        </div>
      </div>

      {/* Channel Details Modal */}
      {selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-container border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1 pr-4">
                  <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">{selectedChannel.logo}</span>
                  <h3 className="subsection-title text-lg text-truncate">{selectedChannel.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="text-container space-y-4">
              <div className="flex justify-between items-center">
                <span className="description-text">Status:</span>
                <div className="flex items-center ml-4">
                  {getStatusIcon(selectedChannel.status)}
                  <span className="ml-2 font-medium text-sm sm:text-base">{t(selectedChannel.status, language)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Commission Rate:</span>
                <span className="font-medium text-sm sm:text-base">{selectedChannel.commission}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Bookings This Month:</span>
                <span className="font-medium text-sm sm:text-base">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Revenue Generated:</span>
                <span className="font-medium text-sm sm:text-base">$2,400</span>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center btn-text">
                  <Settings size={16} className="mr-2 flex-shrink-0" />
                  <span>Channel Settings</span>
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors btn-text">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};