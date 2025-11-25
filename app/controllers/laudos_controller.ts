import type { HttpContext } from '@adonisjs/core/http'
import Laudo from '#models/laudo'

export default class LaudosController {
  async index({ response }: HttpContext) {
    const laudos = await Laudo.query()
    return response.ok(laudos)
  }

  async show({ params, response }: HttpContext) {
    try {
      const laudo = await Laudo.findOrFail(params.id)
      return response.ok(laudo)
    } catch (error) {
      return response.status(404).json({ message: 'Laudo não encontrado' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['clienteId', 'orcamentoId'])
    const laudo = await Laudo.create(data)
    return response.created(laudo)
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const laudo = await Laudo.findOrFail(params.id)
      laudo.merge(request.only(['clienteId', 'orcamentoId']))
      await laudo.save()
      return response.ok(laudo)
    } catch {
      return response.status(404).json({ message: 'Laudo não encontrado' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const laudo = await Laudo.findOrFail(params.id)
      await laudo.delete()
      return response.json({ message: 'Laudo deletado com sucesso' })
    } catch {
      return response.status(404).json({ message: 'Laudo não encontrado' })
    }
  }
}
