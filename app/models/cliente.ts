import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Tecnico from './tecnico.js'
import Amostra from './amostra.js'
import Orcamento from './orcamento.js'
import Planilha from './planilha.js'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare email: string

  @column()
  declare telefone: string

  @column()
  declare cpf?: string

  @column()
  declare cnpj?: string

  @column()
  declare cep: string

  @column()
  declare endereco: string

  @manyToMany(() => Tecnico, {
    pivotTable: 'tecnico_cliente',
  })
  declare tecnicos: ManyToMany<typeof Tecnico>

  @hasMany(() => Amostra)
  declare amostras: HasMany<typeof Amostra>

  @hasMany(() => Orcamento)
  declare orcamentos: HasMany<typeof Orcamento>

  @hasMany(() => Planilha)
  declare planilhas: HasMany<typeof Planilha>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
