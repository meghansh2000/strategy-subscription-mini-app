import api from './api';

export type SubscriptionResponse = {
  id?: number;
  strategyId?: number;
  userId?: number;
  allocatedCapital?: number;
  message?: string;
};

export const subscribeToStrategy = async (
  strategyId: number,
  allocatedCapital: number
): Promise<SubscriptionResponse> => {
  const response = await api.post<SubscriptionResponse>(
    '/users/1/subscriptions',
    {
      strategyId,
      allocatedCapital,
    }
  );

  return response.data;
};
