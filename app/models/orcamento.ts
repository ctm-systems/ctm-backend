import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import Amostra from './amostra.js'
import Laudo from './laudo.js'

export enum Status {
    PENDENTE = 'pendente',
    APROVADO = 'aprovado',
    REPROVADO = 'reprovado'
  }

export default class Orcamento extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identificacao: string
  
  @column()
  declare valorOrcamento: number

  @column()
  declare status: Status

  @column()
  declare clienteId: number

  @column()
  declare amostraId: number

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Amostra)
  declare amostra: BelongsTo<typeof Amostra>

  @hasMany(() => Laudo)
  declare laudos: HasMany<typeof Laudo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}