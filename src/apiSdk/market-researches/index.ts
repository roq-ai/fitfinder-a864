import axios from 'axios';
import queryString from 'query-string';
import { MarketResearchInterface, MarketResearchGetQueryInterface } from 'interfaces/market-research';
import { GetQueryInterface } from '../../interfaces';

export const getMarketResearches = async (query?: MarketResearchGetQueryInterface) => {
  const response = await axios.get(`/api/market-researches${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMarketResearch = async (marketResearch: MarketResearchInterface) => {
  const response = await axios.post('/api/market-researches', marketResearch);
  return response.data;
};

export const updateMarketResearchById = async (id: string, marketResearch: MarketResearchInterface) => {
  const response = await axios.put(`/api/market-researches/${id}`, marketResearch);
  return response.data;
};

export const getMarketResearchById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/market-researches/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMarketResearchById = async (id: string) => {
  const response = await axios.delete(`/api/market-researches/${id}`);
  return response.data;
};
