import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateOrderService } from '../services/CreateOrderService'

export async function CreateOrderController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const orderBodySchema = z.object({
    customerId: z.string().uuid(),
    products: z.array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ),
  })

  const { customerId, products } = orderBodySchema.parse(request.body)

  const createOrder = new CreateOrderService()

  const order = await createOrder.execute({
    customerId,
    products,
  })

  return reply.status(201).send({
    order,
  })
}
