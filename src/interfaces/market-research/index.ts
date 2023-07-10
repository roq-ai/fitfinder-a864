import { ProductIdeaInterface } from 'interfaces/product-idea';
import { GetQueryInterface } from 'interfaces';

export interface MarketResearchInterface {
  id?: string;
  data: string;
  product_idea_id: string;
  created_at?: any;
  updated_at?: any;

  product_idea?: ProductIdeaInterface;
  _count?: {};
}

export interface MarketResearchGetQueryInterface extends GetQueryInterface {
  id?: string;
  data?: string;
  product_idea_id?: string;
}
