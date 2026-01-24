import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Amostra from './amostra.js'
import Cliente from './cliente.js'

export default class Planilha extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identificacao: string

  @column()
  declare arquivo: string

  @column()
  declare amostraId: number

  @column()
  declare clienteId: number

  @belongsTo(() => Amostra)
  declare amostra: BelongsTo<typeof Amostra>

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
