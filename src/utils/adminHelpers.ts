import { AdminUser, AdminMetrics, FilterState, SortField, SortDirection } from '@/types/admin';
import { badge } from '@/components/admin/ui';

export function formatRelativeDate(date: Date | null): string {
  if (!date) return 'fecha desconocida';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  const diffInDays = Math.floor(diffInSeconds / 86400);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  
  return `${Math.floor(diffInDays / 365)}y ago`;
}

export function downloadCSV(
  headers: string[],
  rows: string[][],
  filenamePrefix: string
): void {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getSubscriptionStatusColor(status?: string): string {
  switch (status) {
    case 'active':
      return badge('emerald');
    case 'cancelled':
      return badge('amber');
    case 'expired':
    case 'unpaid':
      return badge('red');
    case 'paused':
    default:
      return badge('zinc');
  }
}

export function filterUsers(users: AdminUser[], filters: FilterState): AdminUser[] {
  return users.filter((user) => {
    const matchesSearch = 
      !filters.searchTerm ||
      user.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesPremium = 
      filters.premiumFilter === 'all' ||
      (filters.premiumFilter === 'premium' && user.isPremium) ||
      (filters.premiumFilter === 'free' && !user.isPremium);

    const matchesSubscription = 
      filters.subscriptionFilter === 'all' ||
      user.subscriptionStatus === filters.subscriptionFilter;

    const matchesDate = (() => {
      if (filters.dateFilter === 'all') return true;
      if (!user.createdAt) return false;

      const now = new Date();
      const userDate = new Date(user.createdAt);
      const diffInDays = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filters.dateFilter) {
        case 'week':
          return diffInDays <= 7;
        case 'month':
          return diffInDays <= 30;
        case 'quarter':
          return diffInDays <= 90;
        case 'year':
          return diffInDays <= 365;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesPremium && matchesSubscription && matchesDate;
  });
}

export function sortUsers(users: AdminUser[], field: SortField, direction: SortDirection): AdminUser[] {
  return [...users].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (field) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'email':
        aValue = a.email?.toLowerCase() || '';
        bValue = b.email?.toLowerCase() || '';
        break;
      case 'premiumSince':
        aValue = a.premiumSince?.getTime() || 0;
        bValue = b.premiumSince?.getTime() || 0;
        break;
      case 'updatedAt':
        aValue = a.updatedAt?.getTime() || 0;
        bValue = b.updatedAt?.getTime() || 0;
        break;
      case 'createdAt':
        aValue = a.createdAt?.getTime() || 0;
        bValue = b.createdAt?.getTime() || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function calculateMetrics(users: AdminUser[]): AdminMetrics {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.isPremium).length;
  const freeUsers = totalUsers - premiumUsers;
  
  const newUsersThisMonth = users.filter(u => 
    u.createdAt && new Date(u.createdAt) >= oneMonthAgo
  ).length;
  
  const newPremiumThisMonth = users.filter(u => 
    u.premiumSince && new Date(u.premiumSince) >= oneMonthAgo
  ).length;

  const activeSubscriptions = users.filter(u => 
    u.subscriptionStatus === 'active'
  ).length;
  
  const cancelledSubscriptions = users.filter(u => 
    u.subscriptionStatus === 'cancelled'
  ).length;
  
  const expiredSubscriptions = users.filter(u => 
    u.subscriptionStatus === 'expired'
  ).length;

  const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;
  const churnRate = premiumUsers > 0 ? (cancelledSubscriptions / (activeSubscriptions + cancelledSubscriptions)) * 100 : 0;
  
  const monthlyRecurringRevenue = activeSubscriptions * 29;

  return {
    totalUsers,
    premiumUsers,
    freeUsers,
    conversionRate,
    newUsersThisMonth,
    newPremiumThisMonth,
    activeSubscriptions,
    cancelledSubscriptions,
    expiredSubscriptions,
    churnRate,
    monthlyRecurringRevenue,
  };
}

export function paginateUsers(users: AdminUser[], page: number, itemsPerPage: number): AdminUser[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return users.slice(startIndex, endIndex);
}