import type { HttpContext } from '@adonisjs/core/http'
import Tecnico from '#models/tecnico'

export default class TecnicosController {
  async index({ response }: HttpContext) {
    const tecnicos = await Tecnico.query().preload('clientes', (query) =>
      query.pivotColumns(['clienteId'])
    )
    return response.ok(tecnicos)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'matricula'])
    const tecnico = await Tecnico.create(data)
    return response.created(tecnico)
  }

  async show({ params }: HttpContext) {
    return await Tecnico.query()
      .where('id', params.id)
      .preload('clientes', (query) => query.pivotColumns(['clienteId']))
      .firstOrFail()
  }

  async update({ params, request, response }: HttpContext) {
    const tecnico = await Tecnico.findOrFail(params.id)
    const data = request.only(['nome', 'matricula'])
    tecnico.merge(data)
    await tecnico.save()

    return response.ok(tecnico)
  }

  async destroy({ params, response }: HttpContext) {
    const tecnico = await Tecnico.findOrFail(params.id)
    await tecnico.delete()
    return response.ok({ message: 'Tecnico deletado com sucesso' })
  }
}
