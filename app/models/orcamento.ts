import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import Amostra from './amostra.js'
import Laudo from './laudo.js'

export enum Status {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
}

export default class Orcamento extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare identificacao: string

  @column()
  declare status: Status

  @column()
  declare clienteId: number

  @manyToMany(() => Amostra, {
    pivotTable: 'amostra_orcamentos',
  })
  declare amostras: ManyToMany<typeof Amostra>

  @belongsTo(() => Cliente)
  declare cliente: BelongsTo<typeof Cliente>

  @hasMany(() => Laudo)
  declare laudos: HasMany<typeof Laudo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
