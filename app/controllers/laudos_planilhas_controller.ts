import type { HttpContext } from '@adonisjs/core/http'
import Laudo from '#models/laudo'

export default class OrcamentosAmostrasController {
  async attach({ params, request, response }: HttpContext) {
    const laudo = await Laudo.findOrFail(params.id)

    await laudo.related('planilhas').attach(request.input('planilhas'))
    await laudo.load('planilhas')

    return response.ok(laudo)
  }

  async detach({ params, request, response }: HttpContext) {
    const laudo = await Laudo.findOrFail(params.id)
    await laudo.related('planilhas').detach(request.input('planilhas'))
    await laudo.load('planilhas')

    return response.ok(laudo)
  }
}
