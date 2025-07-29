// types/lemon-squeezy.ts
export interface Subscription {
  id: string;
  type: string;
  attributes: {
    status: 'active' | 'cancelled' | 'expired' | 'unpaid' | 'paused';
    renews_at: string | null;
    ends_at: string | null;
    user_email: string;
  };
}

export interface WebhookPayload {
  meta: {
    event_name: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | 'subscription_expired' | 'subscription_payment_failed' | 'subscription_paused' | 'subscription_unpaused' | 'order_created';
  };
  data: {
    id: string;
    type: string;
    attributes: {
      status: 'active' | 'cancelled' | 'expired' | 'unpaid' | 'paused';
      renews_at: string | null;
      ends_at: string | null;
      user_email: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
  };
}
