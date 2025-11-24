import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import TipoAmostra from './tipo_amostra.js'
import Orcamento from './orcamento.js'
import Processo from './processo.js'

export default class Amostra extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare foto?: string

  @column()
  declare dataRecebimento: DateTime

  @column()
  declare clienteId: number

  @column()
  declare tipoAmostraId: number

  @column()
  declare orcamentoId?: number

  @manyToMany(() => Processo, {
    pivotTable: 'amostra_processos',
  })
  declare processos: ManyToMany<typeof Processo>

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => TipoAmostra)
  declare tipoAmostra: BelongsTo<typeof TipoAmostra>

  @belongsTo(() => Orcamento)
  declare orcamento: BelongsTo<typeof Orcamento>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
