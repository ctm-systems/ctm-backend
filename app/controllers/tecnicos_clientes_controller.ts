import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'
export default class TecnicosClientesController {
  async attach({ params, request, response }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)

    await cliente.related('tecnicos').attach(request.input('tecnicos'))
    await cliente.load('tecnicos')

    return response.ok(cliente)
  }

  async detach({ params, request, response }: HttpContext) {
    const cliente = await Cliente.findOrFail(params.id)

    await cliente.related('tecnicos').detach(request.input('tecnicos'))
    await cliente.load('tecnicos')

    return response.ok(cliente)
  }
}
