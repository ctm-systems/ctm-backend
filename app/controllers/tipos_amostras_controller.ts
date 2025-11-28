import type { HttpContext } from '@adonisjs/core/http'
import TipoAmostra from '#models/tipo_amostra'

export default class TiposAmostrasController {
  async index({ response}: HttpContext) {
    const tiposAmostras = await TipoAmostra.query()
    return response.ok(tiposAmostras)
  }

  async store({ request, response }: HttpContext) {
          const data = request.only(['nome'])
          if (!data.nome) {
              return response.badRequest({ message: 'Nome é obrigatório' })
          }
          const tipoAmostra = await TipoAmostra.create(data)
          return response.created(tipoAmostra)
      }

  async show({ params, response }: HttpContext) {
      try {
        const tipoAmostra = await TipoAmostra.findOrFail(params.id)
        return response.ok(tipoAmostra)
      } catch {
        return response.notFound({ message: 'Tipo de amostra não encontrado' })
      }
    }

  async update({ params, request, response }: HttpContext) {
          try {
            const tipoAmostra = await TipoAmostra
                .query()
                .where('id', params.id)
                .preload('amostras')
                .firstOrFail()
              tipoAmostra.merge(request.only(['nome']))
              await tipoAmostra.save()
              return response.ok(tipoAmostra)
          } catch {
              return response.notFound({ message: 'Tipo de amostra não encontrado' })
          }
      }

  async destroy({ params, response }: HttpContext) {
          try {
              const tipoAmostra = await TipoAmostra.findOrFail(params.id)
              await tipoAmostra.delete()
              return response.noContent()
          } catch {
              return response.notFound({ message: 'Tipo de amostra não encontrado' })
          }
      }
}
