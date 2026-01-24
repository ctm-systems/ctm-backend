import type { HttpContext } from '@adonisjs/core/http'
import Planilha from '#models/planilha'
import { ExcelService } from '#services/excel_service'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs'
import { supabase } from '#start/supabase'

export default class PlanilhasController {
  async index({ response }: HttpContext) {
    const query = Planilha.query().preload('cliente').preload('amostra')
    return response.ok(await query)
  }

  async show({ params }: HttpContext) {
    const query = Planilha.query().where('id', params.id).preload('cliente').preload('amostra')
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
    const { fileName } = await excelService.processAndSave(arquivo.filePath, 17)

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

    await supabase.storage.from('planilhas').remove([planilha.arquivo])

    await planilha.delete()
    return response.ok({ message: 'Planilha deletada com sucesso' })
  }

  async download({ params, response }: HttpContext) {
    const planilha = await Planilha.findOrFail(params.id)

    const { data, error } = await supabase.storage
      .from('planilhas')
      .createSignedUrl(planilha.arquivo, 60)

    if (error || !data?.signedUrl) {
      return response.notFound({ message: 'Arquivo não encontrado' })
    }

    const fileResponse = await fetch(data.signedUrl)

    response.header(
      'Content-Type',
      fileResponse.headers.get('content-type') ?? 'application/octet-stream'
    )

    response.header(
      'Content-Disposition',
      `attachment; filename="${planilha.identificacao ?? 'arquivo.xlsx'}"`
    )

    response.send(Buffer.from(await fileResponse.arrayBuffer()))
  }
}
