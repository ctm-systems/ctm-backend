import type { HttpContext } from '@adonisjs/core/http'
import { SuapService } from '#services/suap_service'
import axios from 'axios'
import env from '#start/env'
import Tecnico from '#models/tecnico'

export default class AuthSuapsController {
  async getData({ request, response }: HttpContext) {
    const token = request.cookie('suap_token')
    if (!token) return response.unauthorized()

    try {
      const res = await axios.get(env.get('SUAP_DATA')!, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const tecnicoLocal = await Tecnico.query()
        .where('matricula', res.data.identificacao)
        .preload('roles')
        .first()

      return response.ok({
        ...res.data,
        roles: tecnicoLocal?.serialize().roles || [],
      })
    } catch {
      return response.unauthorized()
    }
  }

  async getAuthUrl({ response }: HttpContext) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.get('SUAP_CLIENT_ID')!,
      redirect_uri: env.get('SUAP_REDIRECT_URI')!,
      scope: 'identificacao',
    })

    const url = `https://suap.ifrn.edu.br/o/authorize/?${params.toString()}`
    return response.ok({ url })
  }

  async callback({ request, response }: HttpContext) {
    const code = request.input('code')
    const suap = new SuapService()

    try {
      const token = await suap.getAccessToken(code)

      response.cookie('suap_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      })

      return response.ok({ message: 'Autenticado via OAuth' })
    } catch (error) {
      console.error('Controller Auth Suap: Erro no Callback:', error)
      return response.badRequest({ message: 'Falha na autorização' })
    }
  }

  async logout({ response }: HttpContext) {
    response.clearCookie('suap_token', { path: '/' })
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
