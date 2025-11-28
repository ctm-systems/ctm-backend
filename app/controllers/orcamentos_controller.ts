import type { HttpContext } from '@adonisjs/core/http'
import Orcamento from '#models/orcamento'

export default class OrcamentosController {
  async index({ response }: HttpContext) {
    const orcamentos = await Orcamento.query()
      .preload('amostras')
      .preload('cliente')
      .preload('laudos')
    return response.ok(orcamentos)
  }

  async show({ params }: HttpContext) {
    return await Orcamento.query()
      .where('id', params.id)
      .preload('amostras')
      .preload('cliente')
      .preload('laudos')
      .firstOrFail()
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
