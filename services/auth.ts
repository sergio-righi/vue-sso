import { eFeedback } from '@/utils/enum'

class AuthService {
  private readonly $axios: any
  private readonly $store: any
  private readonly $config: any

  constructor(context: any) {
    this.$store = context.store
    this.$axios = context.$axios
    this.$config = context.$config
  }

  async find(email: string) {
    const response = await this.$axios.post('/auth/find', { email })
    return response.data ?? null
  }

  async login(email: string, password: string) {
    return this._processResponse(
      await this.$axios.post('/auth/login', { email, password })
    )
  }

  async logout() {
    this.$store.dispatch('setUser', { user: null, key: this.$config.vuexKey })
    this.$store.dispatch('setToken', null)
  }

  async register(payload: any) {
    return this._processResponse(
      await this.$axios.post('/auth/register', payload)
    )
  }

  async refresh(payload: any) {
    return this._processResponse(
      await this.$axios.get('/auth/refresh-token', { params: { payload } })
    )
  }

  async fetch() {
    this._processResponse(await this.$axios.get('/auth'))
  }

  _processResponse(response: any) {
    if (response.data) {
      const { user, ...token } = response.data
      this.$store.dispatch('setUser', { user, key: this.$config.vuexKey })
      this.$store.dispatch('setToken', token.access_token)
      return user
    }
    return null
  }

  feedback(message: string, status: string = eFeedback.error) {
    this.$store.dispatch('setFeedback', { message, status })
  }

  callback(callback: string) {
    this.$store.dispatch('setCallback', callback)
  }
}

export default AuthService
