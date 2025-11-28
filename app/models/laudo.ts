import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Cliente from './cliente.js'
import Orcamento from './orcamento.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Planilha from './planilha.js'

export default class Laudo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare orcamentoId: number

  @hasMany(() => Planilha)
  declare planilhas: HasMany<typeof Planilha>

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Orcamento)
  declare orcamento: BelongsTo<typeof Orcamento>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
