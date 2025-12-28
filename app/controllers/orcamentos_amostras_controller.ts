import type { HttpContext } from '@adonisjs/core/http'
import Orcamento from '#models/orcamento'

export default class OrcamentosAmostrasController {
  async attach({ params, request, response }: HttpContext) {
    const orcamento = await Orcamento.findOrFail(params.id)

    await orcamento.related('amostras').attach(request.input('amostras'))
    await orcamento.load('amostras')

    return response.ok(orcamento)
  }

  async detach({ params, request, response }: HttpContext) {
    const orcamento = await Orcamento.findOrFail(params.id)

    await orcamento.related('amostras').detach(request.input('amostras'))
    await orcamento.load('amostras')

    return response.ok(orcamento)
  }
}
