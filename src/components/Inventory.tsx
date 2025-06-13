import React, { useState } from 'react';
import { Edit, Plus, Wrench, Clock, CheckCircle, Users } from 'lucide-react';
import { t } from '../utils/translations';
import { mockRooms } from '../utils/mockData';
import { Room } from '../types';

interface InventoryProps {
  language: string;
}

export const Inventory: React.FC<InventoryProps> = ({ language }) => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const updateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, status: newStatus, lastUpdated: new Date() }
        : room
    ));
  };

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-600" />;
      case 'occupied': return <Users size={16} className="text-red-600" />;
      case 'cleaning': return <Clock size={16} className="text-yellow-600" />;
      case 'maintenance': return <Wrench size={16} className="text-gray-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'bg-green-50 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-50 text-red-800 border-red-200';
      case 'cleaning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-gray-50 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const roomTypes = [...new Set(rooms.map(room => room.type))];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-container">
          <h1 className="section-title">{t('inventory', language)}</h1>
        </div>
        <button className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center btn-text">
          <Plus size={20} className="mr-2 flex-shrink-0" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Room Types Summary */}
      <div className="responsive-grid grid-cols-1 md:grid-cols-3">
        {roomTypes.map((type) => {
          const typeRooms = rooms.filter(room => room.type === type);
          const availableCount = typeRooms.filter(room => room.status === 'available').length;
          const occupiedCount = typeRooms.filter(room => room.status === 'occupied').length;
          const avgPrice = Math.round(typeRooms.reduce((sum, room) => sum + room.price, 0) / typeRooms.length);
          
          return (
            <div key={type} className="card-container">
              <div className="text-container">
                <h3 className="subsection-title text-base sm:text-lg mb-4 text-truncate">{type} Rooms</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="description-text">Total:</span>
                    <span className="font-semibold text-gray-900">{typeRooms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="description-text">{t('available', language)}:</span>
                    <span className="font-semibold text-green-600">{availableCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="description-text">{t('occupied', language)}:</span>
                    <span className="font-semibold text-red-600">{occupiedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="description-text">Average Rate:</span>
                    <span className="font-semibold text-gray-900">${avgPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rooms Grid */}
      <div className="card-container">
        <div className="text-container border-b border-gray-200">
          <h2 className="subsection-title">All Rooms</h2>
        </div>
        
        <div className="text-container">
          <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`
                  border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                  ${getStatusColor(room.status)}
                `}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-truncate">Room {room.number}</h3>
                    <p className="text-xs sm:text-sm opacity-75 text-truncate">{room.type}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getStatusIcon(room.status)}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Status:</span>
                    <span className="text-xs sm:text-sm font-medium text-truncate ml-2">{t(room.status, language)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Rate:</span>
                    <span className="text-xs sm:text-sm font-medium">${room.price}/night</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateRoomStatus(room.id, room.status === 'available' ? 'occupied' : 'available');
                    }}
                    className="flex-1 min-w-0 px-2 py-1.5 text-xs bg-white bg-opacity-50 rounded border hover:bg-opacity-75 transition-colors text-truncate"
                  >
                    {room.status === 'available' ? t('checkIn', language) : t('checkOut', language)}
                  </button>
                  
                  {room.status !== 'cleaning' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateRoomStatus(room.id, 'cleaning');
                      }}
                      className="flex-1 min-w-0 px-2 py-1.5 text-xs bg-white bg-opacity-50 rounded border hover:bg-opacity-75 transition-colors text-truncate"
                    >
                      {t('markCleaning', language)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-container border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="subsection-title text-lg text-truncate pr-4">Room {selectedRoom.number} Details</h3>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none flex-shrink-0"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="text-container space-y-4">
              <div className="flex justify-between items-center">
                <span className="description-text">Room Type:</span>
                <span className="font-semibold text-gray-900 text-truncate ml-4">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Current Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedRoom.status)} ml-4`}>
                  {t(selectedRoom.status, language)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Rate per Night:</span>
                <span className="font-semibold text-gray-900">${selectedRoom.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="description-text">Last Updated:</span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {selectedRoom.lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center btn-text">
                  <Edit size={16} className="mr-2 flex-shrink-0" />
                  <span>Edit Room</span>
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors btn-text">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};