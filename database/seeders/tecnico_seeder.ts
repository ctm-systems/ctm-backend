import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tecnico from '#models/tecnico'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const roleDiretor = await Role.updateOrCreate({ nome: 'diretor' }, { nome: 'diretor' })
    const roleTecnico = await Role.updateOrCreate({ nome: 'tecnico' }, { nome: 'tecnico' })

    const tecnicosData = [
      { nome: 'Jardson', matricula: '20241038060006' },
      { nome: 'Ian', matricula: '20241038060011' },
      { nome: 'Robério', matricula: '20241038060010' },
      { nome: 'Lucas', matricula: '20241038060003' },
    ]

    for (const data of tecnicosData) {
      const tecnico = await Tecnico.updateOrCreate(
        { matricula: data.matricula },
        { nome: data.nome }
      )

      if (tecnico.nome === 'Jardson') {
        await tecnico.related('roles').sync([roleDiretor.id])
      } else {
        await tecnico.related('roles').sync([roleTecnico.id])
      }
    }
  }
}
