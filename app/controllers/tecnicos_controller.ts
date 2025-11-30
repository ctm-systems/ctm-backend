import type { HttpContext } from '@adonisjs/core/http'
import Tecnico from '#models/tecnico'

export default class TecnicosController {
  async index({ request, response }: HttpContext) {
    const carregarClientes = request.input('carregarClientes', false)

    const tecnicosQuery = Tecnico.query()

    if (carregarClientes) {
      tecnicosQuery.preload('clientes', (query) => query.pivotColumns(['cliente_id']))
    }

    const tecnicos = await tecnicosQuery
    return response.ok(tecnicos)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'matricula'])
    const tecnico = await Tecnico.create(data)
    return response.created(tecnico)
  }

  async show({ request, params }: HttpContext) {
    const carregarClientes = request.input('carregarClientes', false)

    const tecnicoQuery = Tecnico.query().where('id', params.id)

    if (carregarClientes) {
      tecnicoQuery.preload('clientes', (query) => query.pivotColumns(['cliente_id']))
    }

    return await tecnicoQuery.firstOrFail()
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
