import type { HttpContext } from '@adonisjs/core/http'
import TipoAmostra from '#models/tipo_amostra'

export default class TiposAmostrasController {
  async index({ response }: HttpContext) {
    const tiposAmostras = await TipoAmostra.query().preload('amostras')
    return response.ok(tiposAmostras)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['nome'])
    const tipoAmostra = await TipoAmostra.create(data)
    return response.created(tipoAmostra)
  }

  async show({ params }: HttpContext) {
    return await TipoAmostra.query().where('id', params.id).preload('amostras').firstOrFail()
  }

  async update({ params, request, response }: HttpContext) {
    const tipoAmostra = await TipoAmostra.findOrFail(params.id)
    const data = request.only(['nome'])
    tipoAmostra.merge(data)
    await tipoAmostra.save()

    return response.ok(tipoAmostra)
  }

  async destroy({ params, response }: HttpContext) {
    const tipoAmostra = await TipoAmostra.findOrFail(params.id)
    await tipoAmostra.delete()
    return response.ok({ message: 'Tipo da amostra deletado com sucesso' })
  }
}
