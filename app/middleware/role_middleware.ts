import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { SuapService } from '#services/suap_service'
import Tecnico from '#models/tecnico'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, requiredRoles: string[]) {
    const token = ctx.request.cookie('suap_token')

    if (!token) {
      return ctx.response.unauthorized({ message: 'Token não fornecido' })
    }

    const suapUser = await SuapService.getUserData(token)
    if (!suapUser || !suapUser.identificacao) {
      return ctx.response.unauthorized({ message: 'Sessão inválida ou expirada no SUAP' })
    }

    const tecnico = await Tecnico.query()
      .where('matricula', suapUser.identificacao)
      .preload('roles')
      .first()

    if (!tecnico) {
      return ctx.response.forbidden({ message: 'Usuário não autorizado no sistema local' })
    }

    const userRoles = tecnico.roles.map((role) => role.nome)
    const hasRole = requiredRoles.some((r) => userRoles.includes(r))

    if (!hasRole) {
      return ctx.response.forbidden({ message: 'Você não tem permissão para esta ação' })
    }

    await next()
  }
}
