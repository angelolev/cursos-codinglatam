export interface UserProps {
  aud: string;
  id: string;
  image: string;
  name: string;
}

export interface UserSubscriptionData {
  isPremium: boolean;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'cancelled' | 'expired' | 'unpaid' | 'paused';
  endsAt?: string | null; // ISO date string or null
  premiumSince?: string | null; // ISO date string or null
  updatedAt?: string | null; // ISO date string or null
}
