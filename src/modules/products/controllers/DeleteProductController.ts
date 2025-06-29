import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { DeleteProductService } from '../services/DeleteProductService'

export async function DeleteProductController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const productParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = productParamsSchema.parse(request.params)

  const showProduct = new DeleteProductService()

  const product = await showProduct.execute({
    id,
  })

  return reply.status(200).send({
    product,
  })
}
