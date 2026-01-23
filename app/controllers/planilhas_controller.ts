import type { HttpContext } from '@adonisjs/core/http'
import Planilha from '#models/planilha'
import { ExcelService } from '#services/excel_service'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'

export default class PlanilhasController {
  async index({ request, response }: HttpContext) {
    const carregarLaudos = request.input('carregarLaudos', false)

    const query = Planilha.query().preload('cliente').preload('amostra')

    if (carregarLaudos) {
      query.preload('laudos', (q) => q.pivotColumns(['laudo_id']))
    }

    return response.ok(await query)
  }

  async show({ request, params }: HttpContext) {
    const carregarLaudos = request.input('carregarLaudos', false)

    const query = Planilha.query().where('id', params.id).preload('cliente').preload('amostra')

    if (carregarLaudos) {
      query.preload('laudos', (q) => q.pivotColumns(['laudo_id']))
    }

    return query.firstOrFail()
  }

  async store({ request, response }: HttpContext) {
    const arquivo = request.file('arquivo', {
      extnames: ['xlsx', 'xls'],
      size: '10mb',
    })

    if (!arquivo) {
      return response.badRequest({ message: 'Arquivo não enviado' })
    }

    await arquivo.move(app.tmpPath('uploads'))

    if (!arquivo.filePath) {
      return response.internalServerError({
        message: 'Falha ao salvar arquivo temporário',
      })
    }

    const excelService = new ExcelService()
    const { fileName, outputPath } = await excelService.processAndSave(arquivo.filePath, 17)

    fs.unlinkSync(arquivo.filePath)

    const data = request.only(['identificacao', 'amostraId', 'clienteId'])

    const planilha = await Planilha.create({
      ...data,
      arquivo: fileName,
    })

    return response.created(planilha)
  }

  async update({ params, request, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)

    const data = request.only(['identificacao', 'amostraId', 'clienteId'])

    planilha.merge(data)
    await planilha.save()

    return response.ok(planilha)
  }

  async destroy({ params, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)

    const filePath = app.makePath('storage/planilhas', planilha.arquivo)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await planilha.delete()

    return response.ok({ message: 'Planilha deletada com sucesso' })
  }

  async download({ params, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)

    const filePath = app.makePath('storage/planilhas', planilha.arquivo)

    if (!fs.existsSync(filePath)) {
      return response.notFound({
        message: 'Arquivo da planilha não encontrado',
      })
    }

    return response.download(filePath, true)
  }
}
