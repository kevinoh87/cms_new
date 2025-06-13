import { Room, Channel, Reservation, PricingRecommendation } from '../types';

export const mockRooms: Room[] = [
  { id: '1', type: 'Standard', number: '101', status: 'occupied', price: 120, lastUpdated: new Date() },
  { id: '2', type: 'Standard', number: '102', status: 'available', price: 120, lastUpdated: new Date() },
  { id: '3', type: 'Deluxe', number: '201', status: 'cleaning', price: 180, lastUpdated: new Date() },
  { id: '4', type: 'Deluxe', number: '202', status: 'available', price: 180, lastUpdated: new Date() },
  { id: '5', type: 'Suite', number: '301', status: 'maintenance', price: 280, lastUpdated: new Date() },
];

export const mockChannels: Channel[] = [
  { id: '1', name: 'Booking.com', logo: '🏨', status: 'connected', commission: 15 },
  { id: '2', name: 'Expedia', logo: '✈️', status: 'connected', commission: 18 },
  { id: '3', name: 'Airbnb', logo: '🏠', status: 'syncing', commission: 14 },
  { id: '4', name: 'Hotels.com', logo: '🌟', status: 'disconnected', commission: 16 },
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    guestName: 'John Smith',
    roomId: '1',
    channelId: '1',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalPrice: 240,
    status: 'confirmed'
  },
  {
    id: '2',
    guestName: 'Maria Garcia',
    roomId: '3',
    channelId: '2',
    checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    totalPrice: 540,
    status: 'confirmed'
  },
];

export const mockPricingRecommendations: PricingRecommendation[] = [
  {
    roomType: 'Standard',
    currentPrice: 120,
    recommendedPrice: 135,
    confidence: 87,
    reason: 'High demand detected for weekend bookings'
  },
  {
    roomType: 'Deluxe',
    currentPrice: 180,
    recommendedPrice: 195,
    confidence: 92,
    reason: 'Competitor analysis suggests price increase opportunity'
  },
  {
    roomType: 'Suite',
    currentPrice: 280,
    recommendedPrice: 265,
    confidence: 78,
    reason: 'Lower occupancy, consider slight price reduction'
  },
];