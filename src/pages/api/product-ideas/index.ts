import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { productIdeaValidationSchema } from 'validationSchema/product-ideas';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProductIdeas();
    case 'POST':
      return createProductIdea();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProductIdeas() {
    const data = await prisma.product_idea
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'product_idea'));
    return res.status(200).json(data);
  }

  async function createProductIdea() {
    await productIdeaValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.market_research?.length > 0) {
      const create_market_research = body.market_research;
      body.market_research = {
        create: create_market_research,
      };
    } else {
      delete body.market_research;
    }
    const data = await prisma.product_idea.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
