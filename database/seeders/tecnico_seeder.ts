import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tecnico from '#models/tecnico'

export default class extends BaseSeeder {
  async run() {
    await Tecnico.createMany([
      {
        nome: 'Jardson',
        matricula: '20241038060006',
      },
      {
        nome: 'Ian',
        matricula: '20241038060011',
      },
      {
        nome: 'Robério',
        matricula: '20241038060010',
      },
      {
        nome: 'Lucas',
        matricula: '20241038060003',
      },
    ])
  }
}
