import type { HttpContext } from '@adonisjs/core/http'
import Amostra from '#models/amostra'

export default class AmostrasController {
  async index({ request, response }: HttpContext) {
    const carregarProcessos = request.input('carregarProcessos', false)

    const amostrasQuery = Amostra.query().preload('cliente').preload('tipoAmostra')

    if (carregarProcessos) {
      amostrasQuery
        .preload('processos', (query) => {
          query.pivotColumns(['processo_id'])
        })
        .preload('orcamentos', (query) => {
          query.pivotColumns(['orcamento_id'])
        })
    }

    const amostras = await amostrasQuery
    return response.ok(amostras)
  }

  async show({ request, params }: HttpContext) {
    const carregarProcessos = request.input('carregarProcessos', false)

    const amostraQuery = Amostra.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('tipoAmostra')

    if (carregarProcessos) {
      amostraQuery
        .preload('processos', (query) => {
          query.pivotColumns(['processo_id'])
        })
        .preload('orcamentos', (query) => {
          query.pivotColumns(['orcamento_id'])
        })
    }

    return await amostraQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'foto', 'dataRecebimento', 'clienteId', 'tipoAmostraId'])
    const amostra = await Amostra.create(data)
    return response.created(amostra)
  }

  async update({ params, request, response }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)
    const data = request.only(['nome', 'foto', 'dataRecebimento', 'clienteId', 'tipoAmostraId'])
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
