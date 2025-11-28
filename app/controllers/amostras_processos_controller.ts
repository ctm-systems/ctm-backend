import type { HttpContext } from '@adonisjs/core/http'
import Amostra from '#models/amostra'

export default class AmostrasProcessosController {
  async attach({ params, request, response }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)

    await amostra.related('processos').attach(request.input('processos'))
    await amostra.load('processos')

    return response.ok(amostra)
  }

  async detach({ params, request, response }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)

    await amostra.related('processos').detach(request.input('processos'))
    await amostra.load('processos')

    return response.ok(amostra)
  }
}
