import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye, Edit, Users } from 'lucide-react';
import { t } from '../utils/translations';
import { mockReservations, mockRooms } from '../utils/mockData';

interface CalendarProps {
  language: string;
}

export const Calendar: React.FC<CalendarProps> = ({ language }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getReservationsForDate = (date: Date) => {
    return mockReservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      return date >= checkIn && date < checkOut;
    });
  };

  const getDateStatus = (date: Date) => {
    const reservations = getReservationsForDate(date);
    const totalRooms = mockRooms.length;
    const occupiedRooms = reservations.length;
    
    if (occupiedRooms === 0) return 'available';
    if (occupiedRooms === totalRooms) return 'full';
    return 'partial';
  };

  const getDateColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const reservations = getReservationsForDate(date);
      const status = getDateStatus(date);
      
      days.push(
        <div
          key={day}
          className={`
            h-24 border border-gray-200 p-2 cursor-pointer transition-colors hover:bg-gray-50
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
            ${isToday ? 'bg-blue-50' : ''}
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {reservations.length > 0 && (
              <span className={`px-1 py-0.5 text-xs rounded-full ${getDateColor(status)}`}>
                {reservations.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {reservations.slice(0, 2).map((reservation, index) => (
              <div
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
              >
                {reservation.guestName}
              </div>
            ))}
            {reservations.length > 2 && (
              <div className="text-xs text-gray-500">
                +{reservations.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('calendar', language)}</h1>
        <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus size={20} className="mr-2" />
          Add Reservation
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Partially Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Fully Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Today</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Reservations</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {mockReservations.map((reservation) => {
              const room = mockRooms.find(r => r.id === reservation.roomId);
              const checkInDate = new Date(reservation.checkIn);
              const checkOutDate = new Date(reservation.checkOut);
              
              return (
                <div key={reservation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{reservation.guestName}</h3>
                      <p className="text-sm text-gray-600">
                        Room {room?.number} ({room?.type}) • ${reservation.totalPrice} total
                      </p>
                      <p className="text-sm text-gray-500">
                        {checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${reservation.status === 'checked-in' ? 'bg-blue-100 text-blue-800' : ''}
                      ${reservation.status === 'checked-out' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {reservation.status}
                    </span>
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{mockRooms.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupied</p>
              <p className="text-2xl font-bold text-red-600">{getReservationsForDate(selectedDate).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {mockRooms.length - getReservationsForDate(selectedDate).length}
              </p>
            </div>
          </div>
          
          {getReservationsForDate(selectedDate).length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Reservations for this date:</h3>
              <div className="space-y-2">
                {getReservationsForDate(selectedDate).map((reservation) => {
                  const room = mockRooms.find(r => r.id === reservation.roomId);
                  return (
                    <div key={reservation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{reservation.guestName}</span>
                        <span className="text-gray-600 ml-2">• Room {room?.number}</span>
                      </div>
                      <span className="text-sm text-gray-500">${reservation.totalPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};