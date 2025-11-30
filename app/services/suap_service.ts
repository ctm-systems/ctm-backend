import axios from 'axios'

export class SuapService {
  private static baseUrl = 'https://suap.ifrn.edu.br/api'

  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${SuapService.baseUrl}/token/pair`, {
        username,
        password,
      })
      return response.data.access
    } catch (error) {
      throw new Error('O login falhou. Verifique suas credenciais e tente novamente.')
    }
  }

  async getData(token: string) {
    try {
      const response = await axios.get(`${SuapService.baseUrl}/eu/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error('Falha ao obter os dados. Faça login e tente novamente.')
    }
  }

  static async validateToken(token: string) {
    try {
      const response = await axios.post(`${SuapService.baseUrl}/token/verify`, {
        token,
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}
