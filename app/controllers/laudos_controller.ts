import type { HttpContext } from '@adonisjs/core/http'
import Laudo from '#models/laudo'

export default class LaudosController {
  async index({ response }: HttpContext) {
    const laudos = await Laudo.query().preload('cliente').preload('orcamento').preload('planilhas')
    return response.ok(laudos)
  }

  async show({ params }: HttpContext) {
    return await Laudo.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('orcamento')
      .preload('planilhas')
      .firstOrFail()
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
