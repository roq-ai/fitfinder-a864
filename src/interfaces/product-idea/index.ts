import { MarketResearchInterface } from 'interfaces/market-research';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface ProductIdeaInterface {
  id?: string;
  idea: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  market_research?: MarketResearchInterface[];
  company?: CompanyInterface;
  _count?: {
    market_research?: number;
  };
}

export interface ProductIdeaGetQueryInterface extends GetQueryInterface {
  id?: string;
  idea?: string;
  company_id?: string;
}
