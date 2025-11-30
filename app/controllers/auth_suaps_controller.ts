import type { HttpContext } from '@adonisjs/core/http'
import { SuapService } from '#services/suap_service'

export default class AuthSuapsController {
  async login({ request, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    const suap = new SuapService()

    try {
      const token = await suap.login(username, password)

      response.cookie('suap_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000,
        path: '/',
      })

      return response.ok({ message: 'Login realizado com sucesso' })
    } catch (error) {
      return response.badRequest({ message: 'Credenciais inválidas' })
    }
  }

  async getData({ request, response }: HttpContext) {
    const token = request.cookie('suap_token')

    const suap = new SuapService()

    try {
      const userData = await suap.getData(token)
      return response.ok(userData)
    } catch (error) {
      response.clearCookie('suap_token', { path: '/' })
      return response.unauthorized({ message: 'Token inválido ou expirado' })
    }
  }

  async logout({ response }: HttpContext) {
    response.clearCookie('suap_token', { path: '/' })
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
