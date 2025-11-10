import type { LoadsResponse, LoadsQueryParams, Status, Carrier } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async getLoads(params: LoadsQueryParams = {}): Promise<LoadsResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status.toString());
    if (params.carrier) queryParams.append('carrier', params.carrier.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/loads?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch loads');
    }

    return response.json();
  },

  async getStatuses(): Promise<Status[]> {
    const response = await fetch(`${API_BASE_URL}/statuses`);

    if (!response.ok) {
      throw new Error('Failed to fetch statuses');
    }

    return response.json();
  },

  async getCarriers(): Promise<Carrier[]> {
    const response = await fetch(`${API_BASE_URL}/carriers`);

    if (!response.ok) {
      throw new Error('Failed to fetch carriers');
    }

    return response.json();
  },
};
