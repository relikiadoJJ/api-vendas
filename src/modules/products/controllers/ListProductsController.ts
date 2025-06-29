import type { FastifyReply, FastifyRequest } from 'fastify'
import { ListProductsService } from '../services/ListProductsService'

export async function ListProductsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listProducts = new ListProductsService()

  const products = await listProducts.execute()

  return reply.status(200).send({
    products,
  })
}
