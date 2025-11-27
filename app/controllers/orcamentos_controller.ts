import type { HttpContext } from '@adonisjs/core/http'
import Orcamento from '#models/orcamento'

export default class OrcamentosController {
  async index({ response }: HttpContext) {
    const orcamentos = await Orcamento.query()
    return response.ok(orcamentos)
  }

  async show({ params, response }: HttpContext) {
    try {
      const orcamento = await Orcamento.findOrFail(params.id)
      return response.ok(orcamento)
    } catch (error) {
      return response.status(404).json({ message: 'Orçamento não encontrado' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['cliente_id', 'valor', 'descricao', 'status'])
    const orcamento = await Orcamento.create(data)
    return response.created(orcamento)
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const orcamento = await Orcamento.findOrFail(params.id)
      orcamento.merge(request.only(['cliente_id', 'valor', 'descricao', 'status']))
      await orcamento.save()
      return response.ok(orcamento)
    } catch {
      return response.notFound({ message: 'Orçamento não encontrado' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const orcamento = await Orcamento.findOrFail(params.id)
      await orcamento.delete()
      return response.json({ message: 'Orçamento deletado com sucesso' })
    } catch {
      return response.status(404).json({ message: 'Orçamento não encontrado' })
    }
  }
}
