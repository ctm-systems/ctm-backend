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

    async attachClientes({ params, request, response }: HttpContext) {
        try {
            const tecnico = await Tecnico.findOrFail(params.id)
            // Recebe os IDs dos clientes enviados na requisição.
            const clienteIds = request.input('clientes')
            // Valida se o clienteIds é um array e não está vazio.
            if (!Array.isArray(clienteIds) || clienteIds.length === 0) {
                return response.badRequest({
                    message: 'Envie uma lista de IDs de clientes válida.'
                })
            }
            // Faz a vinculação dos clientes ao técnico via tabela pivot.
            // attach() já cuida de criar os registros na tabela técnico_cliente.
            await tecnico.related('clientes').attach(clienteIds)
            await tecnico.load('clientes')
            return response.ok(tecnico)
        } catch (error) {
            // Caso tente vincular um cliente que já está relacionado,
            // bancos diferentes retornam códigos diferentes.
            // ER_DUP_ENTRY -> MySQL
            // SQLITE_CONSTRAINT_UNIQUE -> SQLite
            // 23505 -> PostgreSQL
            if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === '23505') {
                return response.badRequest({
                    message: 'Alguns clientes já estão vinculados a este técnico.'
                })
            }
            // Captura qualquer outro erro inesperado.
            return response.internalServerError({
                message: 'Erro ao vincular clientes ao técnico.'
            })
        }
    }

    async detachClientes({ params, request, response }: HttpContext) {
        try {
            const tecnico = await Tecnico.findOrFail(params.id)

            const clienteIds = request.input('clientes')

            // Validação básica
            if (!Array.isArray(clienteIds) || clienteIds.length === 0) {
            return response.badRequest({
                message: 'Envie uma lista de IDs de clientes válida.'
            })
            }

            // Remove apenas os registros da tabela pivot
            await tecnico.related('clientes').detach(clienteIds)

            await tecnico.load('clientes')

            return response.ok({
            message: 'Clientes removidos do técnico com sucesso.',
            tecnico,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao remover clientes do técnico.'
            })
        }
    }
} 
