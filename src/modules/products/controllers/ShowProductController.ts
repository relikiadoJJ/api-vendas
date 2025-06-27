import type { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowProductService } from '../services/ShowProductService'

export async function ShowProductController(request: FastifyRequest) {
  const productParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = productParamsSchema.parse(request.params)

  const showProduct = new ShowProductService()

  const product = await showProduct.execute({
    id,
  })

  return {
    product,
  }
}
