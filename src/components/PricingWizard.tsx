import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  TrendingUp, 
  TrendingDown,
  Percent,
  DollarSign,
  Brain,
  Calendar,
  Home,
  Wifi,
  Globe
} from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  category: 'booking-engine' | 'international' | 'domestic';
  icon: string;
  selected: boolean;
}

interface RoomType {
  id: string;
  name: string;
  currentPrice: number;
  thumbnail: string;
  selected: boolean;
}

interface PeriodOption {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface PricingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const PricingWizard: React.FC<PricingWizardProps> = ({ isOpen, onClose, language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // State for each step
  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'Direct Booking', category: 'booking-engine', icon: '🏨', selected: false },
    { id: '2', name: 'Booking.com', category: 'international', icon: '🌍', selected: false },
    { id: '3', name: 'Expedia', category: 'international', icon: '✈️', selected: false },
    { id: '4', name: 'Airbnb', category: 'international', icon: '🏠', selected: false },
    { id: '5', name: 'Yanolja', category: 'domestic', icon: '🇰🇷', selected: false },
    { id: '6', name: 'Yeogi Eottae', category: 'domestic', icon: '🏢', selected: false },
    { id: '7', name: 'Naver', category: 'domestic', icon: '🔍', selected: false },
  ]);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { id: '1', name: 'Standard Room', currentPrice: 120, thumbnail: '🛏️', selected: false },
    { id: '2', name: 'Deluxe Room', currentPrice: 180, thumbnail: '🛋️', selected: false },
    { id: '3', name: 'Suite Room', currentPrice: 280, thumbnail: '🏨', selected: false },
  ]);

  const [periods, setPeriods] = useState<PeriodOption[]>([
    { id: '1', name: 'Weekdays', description: 'Mon-Thu', selected: false },
    { id: '2', name: 'Weekends/Holidays', description: 'Fri-Sun & Holidays', selected: false },
    { id: '3', name: 'Semi-Peak Season', description: 'Spring/Fall', selected: false },
    { id: '4', name: 'Peak Season', description: 'Summer/Winter', selected: false },
  ]);

  const [adjustmentMethod, setAdjustmentMethod] = useState<'percentage' | 'fixed' | 'ai'>('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [action, setAction] = useState<'increase' | 'decrease' | 'update'>('increase');

  const [allChannelsSelected, setAllChannelsSelected] = useState(false);
  const [allRoomsSelected, setAllRoomsSelected] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const steps = [
    'Channel Selection',
    'Room Type Selection', 
    'Period Selection',
    'Price Adjustment',
    'Action Selection',
    'Confirmation'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setSlideDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setSlideDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const toggleAllChannels = () => {
    const newState = !allChannelsSelected;
    setAllChannelsSelected(newState);
    setChannels(prev => prev.map(channel => ({ ...channel, selected: newState })));
  };

  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId ? { ...channel, selected: !channel.selected } : channel
    ));
  };

  const toggleAllRooms = () => {
    const newState = !allRoomsSelected;
    setAllRoomsSelected(newState);
    setRoomTypes(prev => prev.map(room => ({ ...room, selected: newState })));
  };

  const toggleRoom = (roomId: string) => {
    setRoomTypes(prev => prev.map(room => 
      room.id === roomId ? { ...room, selected: !room.selected } : room
    ));
  };

  const togglePeriod = (periodId: string) => {
    setPeriods(prev => prev.map(period => 
      period.id === periodId ? { ...period, selected: !period.selected } : period
    ));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getSelectedCount = (items: any[]) => items.filter(item => item.selected).length;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return getSelectedCount(channels) > 0;
      case 1: return getSelectedCount(roomTypes) > 0;
      case 2: return getSelectedCount(periods) > 0;
      case 3: return adjustmentValue !== '' || adjustmentMethod === 'ai';
      case 4: return action !== '';
      default: return true;
    }
  };

  const renderChannelSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Channels</h2>
        <p className="text-gray-600">Choose which channels to update pricing</p>
      </div>

      {/* All Channels Toggle */}
      <div 
        className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200 touch-manipulation"
        onClick={toggleAllChannels}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
            {allChannelsSelected && <Check size={16} className="text-blue-500" />}
          </div>
          <span className="font-semibold text-blue-900">All Channels</span>
        </div>
        <span className="text-sm text-blue-700">{getSelectedCount(channels)} selected</span>
      </div>

      {/* Channel Categories */}
      <div className="space-y-3">
        {/* Booking Engine */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 touch-manipulation"
            onClick={() => toggleCategory('booking-engine')}
          >
            <div className="flex items-center">
              <Home size={20} className="text-gray-600 mr-3" />
              <span className="font-medium">Booking Engine</span>
            </div>
            <ChevronRight 
              size={20} 
              className={`text-gray-400 transition-transform ${
                expandedCategories.has('booking-engine') ? 'rotate-90' : ''
              }`} 
            />
          </div>
          {expandedCategories.has('booking-engine') && (
            <div className="border-t border-gray-200">
              {channels.filter(c => c.category === 'booking-engine').map(channel => (
                <div 
                  key={channel.id}
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 touch-manipulation"
                  onClick={() => toggleChannel(channel.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      channel.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {channel.selected && <Check size={16} className="text-white" />}
                    </div>
                    <span className="text-lg mr-2">{channel.icon}</span>
                    <span>{channel.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* International Channels */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 touch-manipulation"
            onClick={() => toggleCategory('international')}
          >
            <div className="flex items-center">
              <Globe size={20} className="text-gray-600 mr-3" />
              <span className="font-medium">International Channels</span>
            </div>
            <ChevronRight 
              size={20} 
              className={`text-gray-400 transition-transform ${
                expandedCategories.has('international') ? 'rotate-90' : ''
              }`} 
            />
          </div>
          {expandedCategories.has('international') && (
            <div className="border-t border-gray-200">
              {channels.filter(c => c.category === 'international').map(channel => (
                <div 
                  key={channel.id}
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 touch-manipulation"
                  onClick={() => toggleChannel(channel.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      channel.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {channel.selected && <Check size={16} className="text-white" />}
                    </div>
                    <span className="text-lg mr-2">{channel.icon}</span>
                    <span>{channel.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Domestic Channels */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 touch-manipulation"
            onClick={() => toggleCategory('domestic')}
          >
            <div className="flex items-center">
              <Wifi size={20} className="text-gray-600 mr-3" />
              <span className="font-medium">Domestic Channels</span>
            </div>
            <ChevronRight 
              size={20} 
              className={`text-gray-400 transition-transform ${
                expandedCategories.has('domestic') ? 'rotate-90' : ''
              }`} 
            />
          </div>
          {expandedCategories.has('domestic') && (
            <div className="border-t border-gray-200">
              {channels.filter(c => c.category === 'domestic').map(channel => (
                <div 
                  key={channel.id}
                  className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 touch-manipulation"
                  onClick={() => toggleChannel(channel.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      channel.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {channel.selected && <Check size={16} className="text-white" />}
                    </div>
                    <span className="text-lg mr-2">{channel.icon}</span>
                    <span>{channel.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRoomSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Room Types</h2>
        <p className="text-gray-600">Choose which room types to update</p>
      </div>

      {/* All Rooms Toggle */}
      <div 
        className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200 touch-manipulation"
        onClick={toggleAllRooms}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
            {allRoomsSelected && <Check size={16} className="text-green-500" />}
          </div>
          <span className="font-semibold text-green-900">All Rooms</span>
        </div>
        <span className="text-sm text-green-700">{getSelectedCount(roomTypes)} selected</span>
      </div>

      {/* Room Types */}
      <div className="space-y-3">
        {roomTypes.map(room => (
          <div 
            key={room.id}
            className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
              room.selected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
            onClick={() => toggleRoom(room.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                  room.selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {room.selected && <Check size={16} className="text-white" />}
                </div>
                <span className="text-2xl mr-3">{room.thumbnail}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600">Current: ${room.currentPrice}/night</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPeriodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Period</h2>
        <p className="text-gray-600">Choose when to apply pricing changes</p>
      </div>

      <div className="space-y-3">
        {periods.map(period => (
          <div 
            key={period.id}
            className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
              period.selected 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 bg-white'
            }`}
            onClick={() => togglePeriod(period.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                  period.selected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                }`}>
                  {period.selected && <Check size={16} className="text-white" />}
                </div>
                <Calendar size={20} className="text-gray-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{period.name}</h3>
                  <p className="text-sm text-gray-600">{period.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPriceAdjustment = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Price Adjustment</h2>
        <p className="text-gray-600">Choose how to adjust pricing</p>
      </div>

      {/* Adjustment Method Selection */}
      <div className="space-y-3">
        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            adjustmentMethod === 'percentage' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAdjustmentMethod('percentage')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Percent size={20} className="text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Percentage Adjustment</h3>
                <p className="text-sm text-gray-600">Adjust by percentage</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              adjustmentMethod === 'percentage' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}>
              {adjustmentMethod === 'percentage' && <Check size={16} className="text-white" />}
            </div>
          </div>
          {adjustmentMethod === 'percentage' && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="Enter percentage (e.g., 10)"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            adjustmentMethod === 'fixed' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAdjustmentMethod('fixed')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign size={20} className="text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Fixed Amount</h3>
                <p className="text-sm text-gray-600">Adjust by fixed amount</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              adjustmentMethod === 'fixed' ? 'border-green-500 bg-green-500' : 'border-gray-300'
            }`}>
              {adjustmentMethod === 'fixed' && <Check size={16} className="text-white" />}
            </div>
          </div>
          {adjustmentMethod === 'fixed' && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="Enter amount (e.g., 20)"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}
        </div>

        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            adjustmentMethod === 'ai' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAdjustmentMethod('ai')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain size={20} className="text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Recommended</h3>
                <p className="text-sm text-gray-600">Use AI-optimized pricing</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              adjustmentMethod === 'ai' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
            }`}>
              {adjustmentMethod === 'ai' && <Check size={16} className="text-white" />}
            </div>
          </div>
          {adjustmentMethod === 'ai' && (
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-800">
                AI will analyze market conditions and suggest optimal pricing for selected rooms and periods.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActionSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Action</h2>
        <p className="text-gray-600">Choose how to apply the adjustment</p>
      </div>

      <div className="space-y-3">
        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            action === 'increase' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAction('increase')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp size={20} className="text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Increase</h3>
                <p className="text-sm text-gray-600">Increase prices by specified amount</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              action === 'increase' ? 'border-green-500 bg-green-500' : 'border-gray-300'
            }`}>
              {action === 'increase' && <Check size={16} className="text-white" />}
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            action === 'decrease' 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAction('decrease')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingDown size={20} className="text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Decrease</h3>
                <p className="text-sm text-gray-600">Decrease prices by specified amount</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              action === 'decrease' ? 'border-red-500 bg-red-500' : 'border-gray-300'
            }`}>
              {action === 'decrease' && <Check size={16} className="text-white" />}
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border-2 rounded-xl transition-all touch-manipulation ${
            action === 'update' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white'
          }`}
          onClick={() => setAction('update')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check size={20} className="text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Update</h3>
                <p className="text-sm text-gray-600">Set new prices directly</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              action === 'update' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            }`}>
              {action === 'update' && <Check size={16} className="text-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Preview</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Channels:</span> {getSelectedCount(channels)} selected</p>
          <p><span className="font-medium">Room Types:</span> {getSelectedCount(roomTypes)} selected</p>
          <p><span className="font-medium">Periods:</span> {getSelectedCount(periods)} selected</p>
          <p><span className="font-medium">Adjustment:</span> {adjustmentMethod} {adjustmentValue && `(${adjustmentValue})`}</p>
          <p><span className="font-medium">Action:</span> {action}</p>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Changes</h2>
        <p className="text-gray-600">Review your pricing updates before applying</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Channels ({getSelectedCount(channels)})</h4>
          <div className="flex flex-wrap gap-2">
            {channels.filter(c => c.selected).map(channel => (
              <span key={channel.id} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs">
                {channel.icon} {channel.name}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-xl">
          <h4 className="font-semibold text-green-900 mb-2">Selected Room Types ({getSelectedCount(roomTypes)})</h4>
          <div className="space-y-2">
            {roomTypes.filter(r => r.selected).map(room => (
              <div key={room.id} className="flex justify-between items-center">
                <span className="text-sm">{room.thumbnail} {room.name}</span>
                <span className="text-sm font-medium">${room.currentPrice}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl">
          <h4 className="font-semibold text-purple-900 mb-2">Selected Periods ({getSelectedCount(periods)})</h4>
          <div className="flex flex-wrap gap-2">
            {periods.filter(p => p.selected).map(period => (
              <span key={period.id} className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs">
                {period.name}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-xl">
          <h4 className="font-semibold text-orange-900 mb-2">Pricing Adjustment</h4>
          <p className="text-sm text-orange-800">
            {action.charAt(0).toUpperCase() + action.slice(1)} prices by {adjustmentMethod} 
            {adjustmentValue && ` (${adjustmentValue}${adjustmentMethod === 'percentage' ? '%' : '$'})`}
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold touch-manipulation"
        >
          Back to Edit
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold touch-manipulation"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderChannelSelection();
      case 1: return renderRoomSelection();
      case 2: return renderPeriodSelection();
      case 3: return renderPriceAdjustment();
      case 4: return renderActionSelection();
      case 5: return renderConfirmation();
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {currentStep > 0 && currentStep < 5 && (
              <button
                onClick={prevStep}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full touch-manipulation"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pricing Wizard</h1>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`px-6 pb-6 transition-all duration-300 ${
            isAnimating 
              ? `transform ${slideDirection === 'right' ? 'translate-x-full' : '-translate-x-full'} opacity-0`
              : 'transform translate-x-0 opacity-100'
          }`}>
            {renderCurrentStep()}
          </div>
        </div>

        {/* Footer */}
        {currentStep < 5 && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-xl font-semibold text-lg touch-manipulation transition-all ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 2 ? 'Review Changes' : 'Continue'}
              <ChevronRight size={20} className="inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};