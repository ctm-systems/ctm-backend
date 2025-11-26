import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Amostra from './amostra.js'

export enum TipoAmostraNome {
  MINERIO = 'MINERIO',
  SEDIMENTO = 'SEDIMENTO',
  TESTEMUNHO = 'TESTEMUNHO',
  SOLO = 'SOLO',
  REJEITO = 'REJEITO',
  POLPA = 'POLPA',
}

export default class TipoAmostra extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: TipoAmostraNome

  @hasMany(() => Amostra)
  declare amostras: HasMany<typeof Amostra>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
