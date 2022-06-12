import { token as tk } from "@/utils"

class TokenService {
  private readonly $axios: any

  constructor(context: any) {
    this.$axios = context.$axios
  }

  async insertWithCode(token: any) {
    token.code = tk.generateCode()
    const response = await this.$axios.post('/token/', token)
    return response.data ?? null
  }

  async insertWithToken(token: any) {
    token.number = tk.generateKey()
    const response = await this.$axios.post('/token/', token)
    return response.data ?? null
  }

  async findByUser(userId: string, code: boolean = false) {
    const params = code ? { number: { $exists: false } } : { code: { $exists: false } }
    const response = await this.$axios.get('/token/', { userId, ...params, done: { $exists: false }, expires: { $gte: new Date() } })
    return response.data ?? null
  }

  async findByToken(number: string) {
    const response = await this.$axios.get('/token/', { number, done: { $exists: false }, expires: { $gte: new Date() } })
    return response.data ?? null
  }

  async findByCode(userId: string, code: string) {
    const response = await this.$axios.get('/token/', { userId, code, done: { $exists: false }, expires: { $gte: new Date() } })
    return response.data ?? null
  }

  async update(document: any) {
    const response = await this.$axios.put('/token/update/', document)
    return response.data ?? null
  }

  async done(id: string) {
    const response = await this.$axios.patch('/token/done/' + id)
    return response.data ?? null
  }

  async undone(id: string) {
    const response = await this.$axios.patch('/token/undone/' + id)
    return response.data ?? null
  }

  async reset(id: string, query: string) {
    return await this.$axios.patch('/token/reset/' + id, query)
  }
}

export default TokenService