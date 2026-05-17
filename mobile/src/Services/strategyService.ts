import { Strategy } from '../types/strategy';
import api from './api';

export const getStrategies = async (): Promise<Strategy[]> => {
  const response = await api.get<Strategy[]>('/strategies');

  return response.data;
};

export const getStrategyById = async (
  id: number
): Promise<Strategy> => {
  const response = await api.get<Strategy>(`/strategies/${id}`);

  return response.data;
};

