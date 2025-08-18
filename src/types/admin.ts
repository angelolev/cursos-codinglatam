export interface AdminUser {
  aud: string;
  email: string | null;
  github: string | null;
  name: string | null;
  isPremium: boolean;
  premiumSince: Date | null;
  updatedAt: Date | null;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired' | 'unpaid' | 'paused';
  subscriptionId?: string;
  endsAt?: Date | null;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface AdminMetrics {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  conversionRate: number;
  newUsersThisMonth: number;
  newPremiumThisMonth: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  churnRate: number;
  monthlyRecurringRevenue: number;
}

export type SortField = 'name' | 'email' | 'premiumSince' | 'updatedAt' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  searchTerm: string;
  premiumFilter: 'all' | 'premium' | 'free';
  subscriptionFilter: 'all' | 'active' | 'cancelled' | 'expired';
  dateFilter: 'all' | 'week' | 'month' | 'quarter' | 'year';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}