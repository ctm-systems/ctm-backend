import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tecnico from '#models/tecnico'

export default class CheckAuthorizedUserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { username } = ctx.request.only(['username'])

    if (!username) {
      return ctx.response.badRequest({ message: 'Username não fornecido' })
    }

    const isNumeric = /^\d+$/.test(username)

    if (!isNumeric) {
      return ctx.response.badRequest({ message: 'Usuário inválido' })
    }

    const authorized = await Tecnico.query().where('matricula', username).first()

    if (!authorized) {
      return ctx.response.unauthorized({ message: 'Usuário não autorizado' })
    }

    await next()
  }
}
