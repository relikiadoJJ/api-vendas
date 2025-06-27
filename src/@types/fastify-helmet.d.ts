declare module '@fastify/helmet' {
  import type { FastifyPluginCallback } from 'fastify'

  interface HelmetOptions {
    contentSecurityPolicy?: {
      directives?: Record<string, string[]>
    }
  }

  const helmet: FastifyPluginCallback<HelmetOptions>
  export default helmet
}
