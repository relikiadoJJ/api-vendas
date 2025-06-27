import uploadConfig from '@config/upload'
import type { FastifyInstance } from 'fastify'
import multer from 'fastify-multer'
import { CreateSessionController } from '../controllers/CreateSessionsController'
import { CreateUserController } from '../controllers/CreateUserController'
import { ListUsersController } from '../controllers/ListUsersController'
import { ResetPasswordController } from '../controllers/ResetPasswordController'
import { SendForgotPasswordController } from '../controllers/SendForgotPasswordController'
import { UpdateUserAvatarController } from '../controllers/UpdateUserAvatarController'
import { verifyJWT } from '../middlewares/verifyJWT'

const upload = multer(uploadConfig)

export async function usersRoutes(app: FastifyInstance) {
  app.post('/api/users', CreateUserController)
  app.get('/api/users', ListUsersController)

  app.post('/api/forgot', SendForgotPasswordController)

  app.post('/api/sessions', CreateSessionController)

  app.post('/api/reset', ResetPasswordController)

  app.register(async authApp => {
    authApp.addHook('onRequest', verifyJWT)

    authApp.patch(
      '/api/me/avatar',
      {
        preHandler: upload.single('avatar'),
      },
      UpdateUserAvatarController
    )
  })
}
