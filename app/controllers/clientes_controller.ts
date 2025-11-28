import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index({ response }: HttpContext) {
    const clientes = await Cliente.query()
      .preload('amostras')
      .preload('laudos')
      .preload('orcamentos')
      .preload('tecnicos', (query) => query.pivotColumns(['tecnicoId']))
    return response.ok(clientes)
  }

  async show({ params }: HttpContext) {
    return await Cliente.query()
      .where('id', params.id)
      .preload('amostras')
      .preload('laudos')
      .preload('orcamentos')
      .preload('tecnicos', (query) => query.pivotColumns(['tecnicoId']))
      .firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'email', 'telefone', 'cpf', 'cnpj', 'cep', 'endereco'])
    const cliente = await Cliente.create(data)
    return response.created(cliente)
  }

  async update({ params, request, response }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)
    const data = request.only(['nome', 'email', 'telefone', 'cpf', 'cnpj', 'cep', 'endereco'])
    cliente.merge(data)
    await cliente.save()

    return response.ok(cliente)
  }

  async destroy({ params, response }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)
    await cliente.delete()
    return response.ok({ message: 'Cliente deletado com sucesso' })
  }
}
