import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UpdateProductService } from '../services/UpdateProductService'

export async function UpdateProductController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const productBodySchema = z.object({
    name: z
      .string()
      .min(2, 'O nome deve ter pelo menos 2 caracteres')
      .max(100, 'O nome deve ter no máximo 100 caracteres')
      .refine(val => /^[\p{L}\p{N}\s\-']+$/u.test(val), {
        message: 'Nome contém caracteres inválidos',
      }),

    price: z
      .number({
        required_error: 'Preço é obrigatório',
        invalid_type_error: 'Preço deve ser um número',
      })
      .nonnegative('Quantidade não pode ser negativa')
      .positive('Preço deve ser maior que zero')
      .lte(100000, 'Preço muito alto'),

    quantity: z
      .number({
        required_error: 'Quantidade é obrigatória',
        invalid_type_error: 'Quantidade deve ser um número',
      })
      .int('Quantidade deve ser um número inteiro')
      .nonnegative('Quantidade não pode ser negativa')
      .lte(10000, 'Quantidade muito alta'),
  })

  const productParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = productParamsSchema.parse(request.params)
  const { name, price, quantity } = productBodySchema.parse(request.body)

  const createProduct = new UpdateProductService()

  const product = await createProduct.execute({
    id,
    name,
    price,
    quantity,
  })

  return reply.status(204).send({
    product,
  })
}
