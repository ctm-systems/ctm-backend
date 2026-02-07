import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export enum Roles {
  diretor = 'diretor',
  tecnico = 'tecnico',
}

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: Roles

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
