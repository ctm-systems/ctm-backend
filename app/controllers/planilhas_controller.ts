import type { HttpContext } from '@adonisjs/core/http'
import Planilha from '#models/planilha'

export default class PlanilhasController {
  async index({ response }: HttpContext) {
    const planilhas = await Planilha.query().preload('laudo').preload('amostra').preload('cliente')
    return response.ok(planilhas)
  }

  async show({ params }: HttpContext) {
    return await Planilha.query()
      .where('id', params.id)
      .preload('laudo')
      .preload('amostra')
      .preload('cliente')
      .firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['arquivo', 'laudoId', 'amostraId', 'clienteId'])
    const planilha = await Planilha.create(data)
    return response.created(planilha)
  }

  async update({ params, request, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)
    const data = request.only(['arquivo', 'laudoId', 'amostraId', 'clienteId'])
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
