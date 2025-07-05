import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowOrderService } from '../services/ShowOrderService'

export async function ShowOrderController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const orderParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = orderParamsSchema.parse(request.params)

  const showOrder = new ShowOrderService()

  const order = await showOrder.execute({
    id,
  })

  return reply.status(200).send({
    order,
  })
}
