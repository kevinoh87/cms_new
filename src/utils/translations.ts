import { Translation, Language } from '../types';

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    channels: 'Channels',
    pricing: 'Pricing',
    calendar: 'Calendar',
    settings: 'Settings',
    
    // Dashboard
    totalRooms: 'Total Rooms',
    occupancyRate: 'Occupancy Rate',
    todayRevenue: 'Today\'s Revenue',
    avgRoomRate: 'Avg Room Rate',
    checkInsToday: 'Check-ins Today',
    checkOutsToday: 'Check-outs Today',
    roomsNeedCleaning: 'Rooms Need Cleaning',
    
    // Room Status
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    cleaning: 'Cleaning',
    
    // Channels
    bookingCom: 'Booking.com',
    expedia: 'Expedia',
    airbnb: 'Airbnb',
    connected: 'Connected',
    disconnected: 'Disconnected',
    syncing: 'Syncing',
    
    // Actions
    checkIn: 'Check In',
    checkOut: 'Check Out',
    markCleaning: 'Mark for Cleaning',
    applyPricing: 'Apply AI Pricing',
    syncChannels: 'Sync Channels',
    
    // AI Pricing
    aiRecommendations: 'AI Pricing Recommendations',
    confidenceLevel: 'Confidence Level',
    applyAll: 'Apply All',
    
    // Settings
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    hotelSettings: 'Hotel Settings',
    channelSettings: 'Channel Settings',
  },
  es: {
    dashboard: 'Panel',
    inventory: 'Inventario',
    channels: 'Canales',
    pricing: 'Precios',
    calendar: 'Calendario',
    settings: 'Configuración',
    totalRooms: 'Habitaciones Totales',
    occupancyRate: 'Tasa de Ocupación',
    todayRevenue: 'Ingresos de Hoy',
    avgRoomRate: 'Tarifa Promedio',
    checkInsToday: 'Check-ins Hoy',
    checkOutsToday: 'Check-outs Hoy',
    roomsNeedCleaning: 'Habitaciones por Limpiar',
    available: 'Disponible',
    occupied: 'Ocupada',
    maintenance: 'Mantenimiento',
    cleaning: 'Limpieza',
    bookingCom: 'Booking.com',
    expedia: 'Expedia',
    airbnb: 'Airbnb',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    syncing: 'Sincronizando',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    markCleaning: 'Marcar para Limpieza',
    applyPricing: 'Aplicar Precios IA',
    syncChannels: 'Sincronizar Canales',
    aiRecommendations: 'Recomendaciones de Precios IA',
    confidenceLevel: 'Nivel de Confianza',
    applyAll: 'Aplicar Todo',
    languageSettings: 'Configuración de Idioma',
    selectLanguage: 'Seleccionar Idioma',
    hotelSettings: 'Configuración del Hotel',
    channelSettings: 'Configuración de Canales',
  },
};

export const t = (key: string, language: string = 'en'): string => {
  return translations[language]?.[key] || translations.en[key] || key;
};