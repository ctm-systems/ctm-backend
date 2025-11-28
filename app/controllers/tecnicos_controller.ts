import type { HttpContext } from '@adonisjs/core/http'
import Tecnico from '#models/tecnico'

export default class TecnicosController {
    async index({}: HttpContext) {
        const tecnicos = await Tecnico.query().preload('clientes')
        return tecnicos
    }

    async show({ params, response }: HttpContext) {
        try {
          const tecnico = await Tecnico
            .query()
            .where('id', params.id)
            .preload('clientes')
            .firstOrFail()
          return response.ok(tecnico)
        } catch {
          return response.notFound({ message: 'Técnico não encontrado' })
        }
    }

    async store({ request, response }: HttpContext) {
        const data = request.only(['nome', 'matricula'])
        if (!data.nome || !data.matricula) {
            return response.status(400).json({ message: 'Nome e matrícula são obrigatórios' })
        }
        const tecnico = await Tecnico.create(data)
        return response.created(tecnico)
    }

    async update({ params, request, response }: HttpContext) {
        try {
            const tecnico = await Tecnico.findOrFail(params.id)
            tecnico.merge(request.only(['nome', 'matricula']))
            await tecnico.save()
            return response.ok(tecnico)
        } catch {
            return response.notFound({ message: 'Técnico não encontrado' })
        }
    }
    
    async destroy({ params, response }: HttpContext) {
        try {
            const tecnico = await Tecnico.findOrFail(params.id)
            await tecnico.delete()
            return response.noContent()
        } catch {
            return response.notFound({ message: 'Técnico não encontrado' })
        }
    }
} 
