import type { HttpContext } from '@adonisjs/core/http'
import Processo from '#models/processo'

export default class ProcessosController {
  async index({ response }: HttpContext) {
    const processos = await Processo.query()
    return response.json(processos)
  }

  async show({ params, response }: HttpContext) {
    try {
      const processo = await Processo.findOrFail(params.id)
      return response.ok(processo)
    } catch (error) {
      return response.status(404).json({ message: 'Processo não encontrado' })
    }
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
    return response.json({ message: 'Processo deletado com sucesso' })
  }
}
