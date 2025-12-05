
export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface YouTubeSuggestion {
  title: string;
  channelName: string;
  summary: string;
  searchQuery: string;
}

export interface PlantAnalysis {
  plantName: string;
  scientificName: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Unknown';
  diseaseName?: string;
  confidence: number;
  treatments: string[];
  description: string;
  youtubeSuggestions?: YouTubeSuggestion[];
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  imageUrl: string;
  plantName: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Unknown';
}

export interface MarketItem {
  id: string;
  name: string;
  price: string;
  category: 'Seeds' | 'Plants' | 'Tools' | 'Fertilizer';
  image: string;
  location: string;
  seller: string;
  rating: number;
}

export interface LocationAnalysis {
  locationName: string;
  suitabilityScore: number; // 0-100
  isSuitableForPlanting: boolean;
  climateZone: string;
  soilType: string;
  bestCrops: string[];
  reasoning: string;
  coordinates?: { lat: number, lng: number };
}

export enum AppView {
  HOME = 'HOME',
  SCAN = 'SCAN',
  DASHBOARD = 'DASHBOARD',
  MARKET = 'MARKET',
  MAP = 'MAP'
}
