import { TokenModel } from '@/models'

class TokenService {
  private readonly $store: any
  private readonly $axios: any

  constructor(context: any) {
    this.$store = context.store
    this.$axios = context.$axios
  }

  async insertWithCode(userId: string) {
    const token = new TokenModel({ userId, code: null })
    const response = await this.$axios.post('/token/', token)
    return response.data ?? null
  }

  async findByToken(number: string) {
    const response = await this.$axios.get('/token/', { params: { number } })
    return response.data ?? null
  }

  async grant(usedId: string, code: string) {
    return this._processResponse(await this.$axios.patch('/token/grant/' + usedId, { code }))
  }

  async revoke(userId: string) {
    return this._processResponse(await this.$axios.patch('/token/revoke/' + userId))
  }

  async reset(number: string, password: string) {
    return await this.$axios.patch('/token/reset/' + number, { password })
  }

  _processResponse(response: any) {
    if (response.data) {
      this.$store.dispatch('setUser', response.data);
      return response.data;
    }
    return null;
  }
}

export default TokenService