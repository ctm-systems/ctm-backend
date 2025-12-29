import type { HttpContext } from '@adonisjs/core/http'
import Planilha from '#models/planilha'

export default class PlanilhasController {
  async index({ request, response }: HttpContext) {
    const carregarLaudos = request.input('carregarLaudos', false)

    const planilhaQuery = Planilha.query().preload('cliente').preload('amostra')

    if (carregarLaudos) {
      planilhaQuery.preload('laudos', (query) => {
        query.pivotColumns(['laudo_id'])
      })
    }

    const planilhas = await planilhaQuery
    return response.ok(planilhas)
  }

  async show({ request, params }: HttpContext) {
    const carregarLaudos = request.input('carregarLaudos', false)

    const planilhaQuery = Planilha.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('amostra')

    if (carregarLaudos) {
      planilhaQuery.preload('laudos', (query) => {
        query.pivotColumns(['laudo_id'])
      })
    }

    return await planilhaQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['identificacao', 'arquivo', 'amostraId', 'clienteId'])
    const planilha = await Planilha.create(data)
    return response.created(planilha)
  }

  async update({ params, request, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)
    const data = request.only(['identificacao', 'arquivo', 'amostraId', 'clienteId'])
    planilha.merge(data)
    await planilha.save()

    return response.ok(planilha)
  }

  async destroy({ params, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)
    await planilha.delete()
    return response.ok({ message: 'Planilha deletada com sucesso' })
  }
}
