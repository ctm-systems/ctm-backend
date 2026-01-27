import type { HttpContext } from '@adonisjs/core/http'
import Amostra from '#models/amostra'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { SupabaseService } from '#services/supabase_service'

export default class AmostrasController {
  async index({ request, response }: HttpContext) {
    const carregarProcessos = request.input('carregarProcessos', false)

    const amostrasQuery = Amostra.query()
      .preload('cliente')
      .preload('tipoAmostra')
      .preload('planilhas')

    if (carregarProcessos) {
      amostrasQuery
        .preload('processos', (query) => {
          query.pivotColumns(['processo_id'])
        })
        .preload('orcamentos', (query) => {
          query.pivotColumns(['orcamento_id'])
        })
    }

    const amostras = await amostrasQuery
    return response.ok(amostras)
  }

  async show({ request, params }: HttpContext) {
    const carregarProcessos = request.input('carregarProcessos', false)

    const amostraQuery = Amostra.query()
      .where('id', params.id)
      .preload('cliente')
      .preload('tipoAmostra')
      .preload('planilhas')

    if (carregarProcessos) {
      amostraQuery
        .preload('processos', (query) => {
          query.pivotColumns(['processo_id'])
        })
        .preload('orcamentos', (query) => {
          query.pivotColumns(['orcamento_id'])
        })
    }

    return await amostraQuery.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const foto = request.file('foto', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '5mb',
    })

    let fotoPath: string | null = null

    if (foto) {
      await foto.move(app.tmpPath('uploads'))

      if (!foto.filePath) {
        return response.internalServerError({
          message: 'Erro ao processar imagem',
        })
      }

      fotoPath = await SupabaseService.uploadPublicImage(foto.filePath, foto.extname!)
    }

    const amostra = await Amostra.create({
      nome: request.input('nome'),
      dataRecebimento: request.input('dataRecebimento'),
      clienteId: request.input('clienteId'),
      tipoAmostraId: request.input('tipoAmostraId'),
      foto: fotoPath,
    })

    return response.created(amostra)
  }

  async update({ params, request, response }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)

    const foto = request.file('foto', {
      extnames: ['jpg', 'jpeg', 'png'],
      size: '5mb',
    })

    if (foto) {
      const fileName = `${cuid()}.${foto.extname}`

      await foto.move(app.publicPath('uploads'), {
        name: fileName,
      })

      amostra.foto = `/uploads/${fileName}`
    }

    amostra.merge({
      nome: request.input('nome'),
      dataRecebimento: request.input('dataRecebimento'),
      clienteId: request.input('clienteId'),
      tipoAmostraId: request.input('tipoAmostraId'),
    })

    await amostra.save()
    return response.ok(amostra)
  }

  async destroy({ response, params }: HttpContext) {
    const amostra = await Amostra.findOrFail(params.id)
    await amostra.delete()
    return response.ok({ message: 'Amostra deletada com sucesso' })
  }
}
