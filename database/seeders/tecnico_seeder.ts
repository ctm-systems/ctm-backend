import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tecnico from '#models/tecnico'
import Role, { Roles } from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const roleDiretor = await Role.query().where('nome', Roles.diretor).firstOrFail()
    const roleTecnico = await Role.query().where('nome', Roles.tecnico).firstOrFail()

    const tecnicosData = [
      { nome: 'Keylly', matricula: '1886551', roles: [roleDiretor.id] },
      { nome: 'Jardson', matricula: '20241038060006', roles: [roleDiretor.id] },
      { nome: 'Ian', matricula: '20241038060011', roles: [roleDiretor.id] },
      { nome: 'Robério', matricula: '20241038060010', roles: [roleTecnico.id] },
      { nome: 'Lucas', matricula: '20241038060003', roles: [roleTecnico.id] },
    ]

    for (const data of tecnicosData) {
      const tecnico = await Tecnico.updateOrCreate(
        { matricula: data.matricula },
        { nome: data.nome }
      )

      await tecnico.related('roles').sync(data.roles)
    }
  }
}
