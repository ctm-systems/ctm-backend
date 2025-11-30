import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { SuapService } from '#services/suap_service'

export default class AuthSuapMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.cookie('suap_token')
    if (!token) {
      return ctx.response.unauthorized({ message: 'Token não fornecido' })
    }

    try {
      const valido = await SuapService.validateToken(token)
      if (!valido) {
        ctx.response.clearCookie('suap_token', { path: '/' })
        return ctx.response.unauthorized({ message: 'Token inválido' })
      }
    } catch (error) {
      ctx.response.clearCookie('suap_token', { path: '/' })
      return ctx.response.unauthorized({ message: 'Erro ao validar token' })
    }

    await next()
  }
}
