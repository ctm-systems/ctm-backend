import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Laudo from './laudo.js'

export default class Planilha extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare arquivo: string

  @hasOne(() => Laudo)
  declare laudo: HasOne<typeof Laudo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}