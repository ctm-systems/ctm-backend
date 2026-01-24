import type { HttpContext } from '@adonisjs/core/http'
import Orcamento from '#models/orcamento'

export default class OrcamentosController {
  async index({ request, response }: HttpContext) {
    const carregarAmostras = request.input('carregarAmostras', false)

    const orcamentoQuery = Orcamento.query().preload('cliente')

    if (carregarAmostras) {
      orcamentoQuery.preload('amostras', (query) => {
        query.pivotColumns(['orcamento_id'])
      })
    }

    const orcamentos = await orcamentoQuery
    return response.ok(orcamentos)
  }

  async show({ request, params }: HttpContext) {
    const carregarAmostras = request.input('carregarAmostras', false)

    const orcamentoQuery = Orcamento.query()
      .where('id', params.id)
      .preload('cliente')

    if (carregarAmostras) {
      orcamentoQuery.preload('amostras', (query) => {
        query.pivotColumns(['orcamento_id'])
      })
    }

    return await orcamentoQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['identificacao', 'status', 'clienteId'])
    const orcamento = await Orcamento.create(data)
    return response.created(orcamento)
  }

  async update({ params, request, response }: HttpContext) {
    const orcamento = await Orcamento.findOrFail(params.id)
    const data = request.only(['identificacao', 'status', 'clienteId'])
    orcamento.merge(data)
    await orcamento.save()

    return response.ok(orcamento)
  }

  async destroy({ params, response }: HttpContext) {
    const orcamento = await Orcamento.findOrFail(params.id)
    await orcamento.delete()
    return response.ok({ message: 'Orçamento deletado com sucesso' })
  }
}
