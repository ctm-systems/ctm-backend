import type { HttpContext } from '@adonisjs/core/http'
import Processo from '#models/processo'

export default class ProcessosController {
  async index({ request, response }: HttpContext) {
    const carregarAmostras = request.input('carregarAmostras', false)

    const processosQuery = Processo.query()

    if (carregarAmostras) {
      processosQuery.preload('amostras', (query) => query.pivotColumns(['amostra_id']))
    }

    const processos = await processosQuery
    return response.ok(processos)
  }

  async show({ request, params }: HttpContext) {
    const carregarAmostras = request.input('carregarAmostras', false)

    const processoQuery = Processo.query().where('id', params.id)

    if (carregarAmostras) {
      processoQuery.preload('amostras', (query) => query.pivotColumns(['amostra_id']))
    }

    return await processoQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'preco'])
    const processo = await Processo.create(data)
    return response.created(processo)
  }

  async update({ params, request, response }: HttpContext) {
    const processo = await Processo.findOrFail(params.id)
    processo.merge(request.only(['nome', 'preco']))
    await processo.save()

    return response.ok(processo)
  }

  async destroy({ params, response }: HttpContext) {
    const processo = await Processo.findOrFail(params.id)
    await processo.delete()
    return response.ok({ message: 'Processo deletado com sucesso' })
  }
}
