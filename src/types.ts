export type Language = 'en' | 'hi' | 'ar' | 'es' | 'fr' | 'zh' | 'ru';

export type NavView = 'home' | 'auth' | 'profile' | 'admin';

export interface CleaningStats {
  rowsProcessed: number;
  duplicatesRemoved: number;
  cellsTrimmed: number;
  emptyRowsRemoved: number;
  datesNormalized: number;
  emailsValidated: number;
  cleanTimeMs: number;
}

export interface CleanedFile {
  id: string;
  name: string;
  originalSize: number;
  cleanedSize: number;
  headers: string[];
  rows: string[][];
  stats: CleaningStats;
  cleanedAt: string;
  sourceType: 'upload' | 'url' | 'sample';
}

export interface Sale {
  id: string;
  date: string;
  fileName: string;
  salesType: 'Basic' | 'Premium' | 'Enterprise' | 'Test buy';
  price: number;
  user: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  userType: 'Admin' | 'Premium' | 'Basic';
  signUpDate: string;
  status: 'Active' | 'Suspended';
}

export interface CustomerProfileData {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  plan: 'BASIC' | 'PRO' | 'YEARLY PRO';
  expiryDate: string;
  autoRenewal: boolean;
  totalCleanedFiles: number;
  paymentMethod: {
    brand: string;
    last4: string;
    exp: string;
  };
  monthlyStats: {
    month: string;
    count: number;
  }[];
}
