import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowProductService } from '../services/ShowProductService'

export async function ShowProductController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const productParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = productParamsSchema.parse(request.params)

  const showProduct = new ShowProductService()

  const product = await showProduct.execute({
    id,
  })

  return reply.status(200).send({
    product,
  })
}
