import type { HttpContext } from '@adonisjs/core/http'
import Amostra from '#models/amostra'

export default class AmostrasController {
  async index({ response }: HttpContext) {
    const amostras = await Amostra.query()
      .preload('cliente')
      .preload('tipoAmostra')
      .preload('orcamento')
      .preload('processos')
    return response.ok(amostras)
  }

  async show({ params }: HttpContext) {
    return await Amostra.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('tipoAmostra')
      .preload('orcamento')
      .preload('processos', (query) => query.pivotColumns(['processoId']))
      .firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'nome',
      'foto',
      'dataRecebimento',
      'clienteId',
      'tipoAmostraId',
      'orcamentoId',
    ])
    const amostra = await Amostra.create(data)
    return response.created(amostra)
  }

  async update({ params, request, response }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)
    const data = request.only([
      'nome',
      'foto',
      'dataRecebimento',
      'clienteId',
      'tipoAmostraId',
      'orcamentoId',
    ])
    amostra.merge(data)
    await amostra.save()

    return response.ok(amostra)
  }

  async destroy({ response, params }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)
    await amostra.delete()
    return response.ok({ message: 'Amostra deletada com sucesso' })
  }
}
