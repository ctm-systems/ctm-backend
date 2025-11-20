import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tecnico from './tecnico.js'
import Amostra from './amostra.js'
import Orcamento from './orcamento.js'
import Laudo from './laudo.js'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare cpf: string

  @column()
  declare cnpj: string

  @column()
  declare cep: string

  @column()
  declare endereco: string
  
  @column()
  declare tecnicoId: number

  @belongsTo(() => Tecnico)
  declare tecnico: BelongsTo<typeof Tecnico>

  @hasMany(() => Amostra)
  declare amostras: HasMany<typeof Amostra>

  @hasMany(() => Orcamento)
  declare orcamentos: HasMany<typeof Orcamento>

  @hasMany(() => Laudo)
  declare laudos: HasMany<typeof Laudo>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}