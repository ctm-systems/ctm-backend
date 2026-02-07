import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role, { Roles } from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const roles = [{ nome: Roles.diretor }, { nome: Roles.tecnico }]

    for (const roleData of roles) {
      await Role.updateOrCreate({ nome: roleData.nome }, { nome: roleData.nome })
    }
  }
}
