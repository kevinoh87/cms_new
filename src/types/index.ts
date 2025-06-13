export interface Room {
  id: string;
  type: string;
  number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  lastUpdated: Date;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'syncing';
  commission: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  roomId: string;
  channelId: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

export interface PricingRecommendation {
  roomType: string;
  currentPrice: number;
  recommendedPrice: number;
  confidence: number;
  reason: string;
}

export interface Translation {
  [key: string]: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}