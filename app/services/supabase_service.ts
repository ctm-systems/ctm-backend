import { supabase } from '#start/supabase'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs/promises'

export class SupabaseService {
  static async uploadPublicImage(filePath: string, ext: string, folder = 'imagens') {
    const fileName = `${folder}/${cuid()}.${ext}`
    const buffer = await fs.readFile(filePath)

    const { error } = await supabase.storage.from('imagens').upload(fileName, buffer, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      upsert: false,
    })

    if (error) {
      throw new Error('Erro ao enviar imagem para o Supabase')
    }

    await fs.unlink(filePath)

    return fileName
  }
}
