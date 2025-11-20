import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import TipoAmostra from './tipo_amostra.js'
import Processo from './processo.js'
import Orcamento from './orcamento.js'

export default class Amostra extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare foto: string

  @column()
  declare dataRecebimento: DateTime
  
  @column()
  declare clienteId: number
  
  @column()
  declare tipoAmostraId: number

  @column()
  declare processoId: number

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => TipoAmostra)
  declare tipoAmostra: BelongsTo<typeof TipoAmostra>

  @belongsTo(() => Processo)
  declare processo: BelongsTo<typeof Processo>

  @hasOne(() => Orcamento)
  declare orcamento: HasOne<typeof Orcamento>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}