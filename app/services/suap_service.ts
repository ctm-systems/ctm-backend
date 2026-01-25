import axios from 'axios'
import env from '#start/env'

export class SuapService {
  private static baseUrl = 'https://suap.ifrn.edu.br/o/token/'
  private static clientId = env.get('SUAP_CLIENT_ID')
  private static clientSecret = env.get('SUAP_CLIENT_SECRET')
  private static redirectUri = env.get('SUAP_REDIRECT_URI')

  async getAccessToken(code: string) {
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'authorization_code')
      params.append('code', code)
      params.append('redirect_uri', SuapService.redirectUri!)
      params.append('client_id', SuapService.clientId!)
      params.append('client_secret', SuapService.clientSecret!)

      const response = await axios.post(SuapService.baseUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      return response.data.access_token
    } catch (error) {
      if (error.response) {
        console.error('Suap Service: Motivo real do SUAP:', error.response.data)
      } else {
        console.error('Suap Service: Erro de conexão ou configuração:', error.message)
      }
      throw error
    }
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      console.log('Suap Service: Token no Cookie:', token)
      await axios.get(env.get('SUAP_DATA')!, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return true
    } catch (error) {
      console.error('Suap Service: SUAP rejeitou Token:', error.response?.data)
      return false
    }
  }
}
