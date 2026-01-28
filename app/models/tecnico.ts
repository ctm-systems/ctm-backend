import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Cliente from './cliente.js'
import Role from './role.js'

export default class Tecnico extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare matricula: string

  @manyToMany(() => Cliente, {
    pivotTable: 'tecnico_cliente',
  })
  declare clientes: ManyToMany<typeof Cliente>

  @manyToMany(() => Role, {
    pivotTable: 'tecnico_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
