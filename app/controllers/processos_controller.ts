import type { HttpContext } from '@adonisjs/core/http'
import Processo from '#models/processo'

export default class ProcessosController {
  async index({ response }: HttpContext) {
    const processos = await Processo.query().preload('amostras')
    return response.ok(processos)
  }

  async show({ params }: HttpContext) {
    return await Processo.query()
      .where('id', params.id)
      .preload('amostras', (query) => query.pivotColumns(['amostraId']))
      .firstOrFail()
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
