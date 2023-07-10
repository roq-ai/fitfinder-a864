import axios from 'axios';
import queryString from 'query-string';
import { ProductIdeaInterface, ProductIdeaGetQueryInterface } from 'interfaces/product-idea';
import { GetQueryInterface } from '../../interfaces';

export const getProductIdeas = async (query?: ProductIdeaGetQueryInterface) => {
  const response = await axios.get(`/api/product-ideas${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProductIdea = async (productIdea: ProductIdeaInterface) => {
  const response = await axios.post('/api/product-ideas', productIdea);
  return response.data;
};

export const updateProductIdeaById = async (id: string, productIdea: ProductIdeaInterface) => {
  const response = await axios.put(`/api/product-ideas/${id}`, productIdea);
  return response.data;
};

export const getProductIdeaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/product-ideas/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteProductIdeaById = async (id: string) => {
  const response = await axios.delete(`/api/product-ideas/${id}`);
  return response.data;
};
