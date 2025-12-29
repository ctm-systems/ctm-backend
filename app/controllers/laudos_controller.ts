import type { HttpContext } from '@adonisjs/core/http'
import Laudo from '#models/laudo'

export default class LaudosController {
  async index({ request, response }: HttpContext) {
    const carregarPlanilhas = request.input('carregarPlanilhas', false)

    const laudoQuery = Laudo.query().preload('cliente').preload('orcamento')

    if (carregarPlanilhas) {
      laudoQuery.preload('planilhas', (query) => {
        query.pivotColumns(['planilha_id'])
      })
    }

    const laudos = await laudoQuery
    return response.ok(laudos)
  }

  async show({ request, params }: HttpContext) {
    const carregarPlanilhas = request.input('carregarPlanilhas', false)

    const laudoQuery = Laudo.query().where('id', params.id).preload('cliente').preload('orcamento')

    if (carregarPlanilhas) {
      laudoQuery.preload('planilhas', (query) => {
        query.pivotColumns(['planilha_id'])
      })
    }

    return await laudoQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['clienteId', 'orcamentoId'])
    const laudo = await Laudo.create(data)
    return response.created(laudo)
  }

  async update({ params, request, response }: HttpContext) {
    const laudo = await Laudo.findOrFail(params.id)
    const data = request.only(['clienteId', 'orcamentoId'])
    laudo.merge(data)
    await laudo.save()

    return response.ok(laudo)
  }

  async destroy({ params, response }: HttpContext) {
    const laudo = await Laudo.findOrFail(params.id)
    await laudo.delete()
    return response.ok({ message: 'Laudo deletado com sucesso' })
  }
}
