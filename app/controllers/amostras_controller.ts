import type { HttpContext } from '@adonisjs/core/http'
import Amostra from '#models/amostra'

export default class AmostrasController {
  async index({}: HttpContext) {
    const amostras = await Amostra.query()
      .preload('cliente')
      .preload('tipoAmostra')
      .preload('orcamento')
      .preload('processos')
    return amostras
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

  async store({ request }: HttpContext) {
    const data = request.only([
      'nome',
      'foto',
      'dataRecebimento',
      'clienteId',
      'tipoAmostraId',
      'orcamentoId',
    ])
    const amostra = await Amostra.create(data)
    return amostra
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

  async destroy({ params }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)
    await amostra.delete()
    return { message: 'Amostra deletada com sucesso' }
  }
}
