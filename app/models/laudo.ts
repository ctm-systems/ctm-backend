import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Cliente from './cliente.js'
import Planilha from './planilha.js'
import Orcamento from './orcamento.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Laudo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clienteId: number

  @column()
  declare planilhaId: number

  @column()
  declare orcamentoId: number

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Planilha)
  declare planilha: BelongsTo<typeof Planilha>

  @belongsTo(() => Orcamento)
  declare orcamento: BelongsTo<typeof Orcamento>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}