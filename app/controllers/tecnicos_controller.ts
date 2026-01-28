import type { HttpContext } from '@adonisjs/core/http'
import Tecnico from '#models/tecnico'
import Role from '#models/role'

export default class TecnicosController {
  async index({ request, response }: HttpContext) {
    const carregarClientes = request.input('carregarClientes', false)

    const tecnicosQuery = Tecnico.query().preload('roles')

    if (carregarClientes) {
      tecnicosQuery.preload('clientes', (query) => query.pivotColumns(['cliente_id']))
    }

    const tecnicos = await tecnicosQuery
    return response.ok(tecnicos)
  }

  public async store({ request }: HttpContext) {
    const data = request.all()

    const tecnico = await Tecnico.create({
      nome: data.nome,
      matricula: data.matricula,
    })

    if (data.role_nome) {
      const role = await Role.findByOrFail('nome', data.role_nome)
      await tecnico.related('roles').attach([role.id])
    }

    return tecnico
  }

  async show({ request, params }: HttpContext) {
    const carregarClientes = request.input('carregarClientes', false)

    const tecnicoQuery = Tecnico.query().where('id', params.id).preload('roles')

    if (carregarClientes) {
      tecnicoQuery.preload('clientes', (query) => query.pivotColumns(['cliente_id']))
    }

    return await tecnicoQuery.firstOrFail()
  }

  public async update({ params, request, response }: HttpContext) {
    const data = request.all()

    const tecnico = await Tecnico.findOrFail(params.id)

    tecnico.merge({ nome: data.nome, matricula: data.matricula })
    await tecnico.save()

    if (data.role_nome) {
      const role = await Role.findByOrFail('nome', data.role_nome)
      await tecnico.related('roles').sync([role.id])
    }

    await tecnico.load('roles')

    return response.ok(tecnico)
  }

  async destroy({ params, response }: HttpContext) {
    const tecnico = await Tecnico.findOrFail(params.id)
    await tecnico.delete()
    return response.ok({ message: 'Tecnico deletado com sucesso' })
  }
}
