// types/lemon-squeezy.ts
export interface Subscription {
  id: string;
  type: string;
  attributes: {
    status: string;
    renews_at: string | null;
    ends_at: string | null;
  };
}

export interface WebhookPayload {
  meta: {
    event_name: string;
  };
  data: {
    id: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes: Record<string, any>;
  };
}
