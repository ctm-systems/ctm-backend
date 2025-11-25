import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Laudo from './laudo.js'

export default class Planilha extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare arquivo: string

  @column()
  declare laudoId: number

  @belongsTo(() => Laudo)
  declare laudo: BelongsTo<typeof Laudo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
