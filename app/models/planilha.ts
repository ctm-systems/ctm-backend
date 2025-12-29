import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Laudo from './laudo.js'
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

  @manyToMany(() => Laudo, {
    pivotTable: 'laudos_planilhas',
  })
  declare laudos: ManyToMany<typeof Laudo>

  @belongsTo(() => Amostra)
  declare amostra: BelongsTo<typeof Amostra>

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
