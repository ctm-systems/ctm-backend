import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Amostra from './amostra.js'

export default class Processo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare preco: number

  @manyToMany(() => Amostra, {
    pivotTable: 'amostra_processos',
  })
  declare amostras: ManyToMany<typeof Amostra>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}