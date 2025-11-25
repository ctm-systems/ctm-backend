import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index({ response }: HttpContext) {
    const clientes = await Cliente.query()
    return response.ok(clientes)
  }

  async show({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      return response.ok(cliente)
    } catch {
      return response.status(404).json({ message: 'Cliente não encontrado' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome', 'email', 'telefone', 'cpf', 'cnpj', 'cep', 'endereco'])
    const cliente = await Cliente.create(data)
    return response.created(cliente)
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      cliente.merge(request.only(['nome', 'email', 'telefone', 'cpf', 'cnpj', 'cep', 'endereco']))
      await cliente.save()
      return response.ok(cliente)
    } catch {
      return response.notFound({ message: 'Cliente não encontrado' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.findOrFail(params.id)
      await cliente.delete()
      return response.noContent()
    } catch {
      return response.notFound({ message: 'Cliente não encontrado' })
    }
  }
}
