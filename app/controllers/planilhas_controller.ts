import type { HttpContext } from '@adonisjs/core/http'
import Planilha from '#models/planilha'

export default class PlanilhasController {
  async index({ response }: HttpContext) {
    const planilhas = await Planilha.query()
    return response.json(planilhas)
  }

  async show({ params, response }: HttpContext) {
    try {
      const planilha = await Planilha.findOrFail(params.id)
      return response.ok(planilha)
    } catch (error) {
      return response.status(404).json({ message: 'Planilha não encontrada' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['arquivo', 'laudoId'])
    const planilha = await Planilha.create(data)
    return response.created(planilha)
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const planilha = await Planilha.findOrFail(params.id)
      planilha.merge(request.only(['arquivo', 'laudoId']))
      await planilha.save()
      return response.ok(planilha)
    } catch {
      return response.status(404).json({ message: 'Planilha não encontrada' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const planilha = await Planilha.findOrFail(params.id)
      await planilha.delete()
      return response.json({ message: 'Planilha deletada com sucesso' })
    } catch {
      return response.status(404).json({ message: 'Planilha não encontrada' })
    }
  }
}
