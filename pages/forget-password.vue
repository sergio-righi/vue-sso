<template>
  <div class="login-content">
    <Feedback />
    <form @submit.prevent="onSubmit">
      <gv-row>
        <gv-col v-if="!isUpdate">
          <Email v-model="email" ignore />
        </gv-col>
        <gv-col v-if="isUpdate">
          <Password v-model="password" required @onerror="passwordValidation" />
        </gv-col>
        <gv-col v-if="isUpdate">
          {{ $t('message.footnote.password') }}
          <gv-list>
            <li v-for="item in passwordPolicy" :key="item.id">{{ item }}</li>
          </gv-list>
        </gv-col>
        <gv-col>
          <gv-button submit primary stretch :disabled="hasError">
            {{ $t('action.send') }}
          </gv-button>
        </gv-col>
        <gv-col>
          <gv-flexbox justify="center">
            <span class="footnote">
              {{ $t('page.forget_password.remember_it') }}
              <gv-link :href="$resolve.home(urlParams)" muted>
                {{ $t('action.sign_in') }}
              </gv-link>
            </span>
          </gv-flexbox>
        </gv-col>
      </gv-row>
    </form>
  </div>
</template>

<script>
import { Email, Feedback, Password } from '@/components'
import { eFeedback } from '@/utils/enum'
import { TokenModel } from '@/models'

export default {
  name: 'ForgotPassword',
  components: {
    Email,
    Feedback,
    Password,
  },
  middleware: ['validate', 'not-auth'],
  data() {
    return {
      email: null,
      password: null,
      invalidPassword: false,
    }
  },
  async fetch() {
    const { error, query, $service, $resolve, redirect } = this.$nuxt.context
    try {
      if ('token' in query) {
        const token = await $service.token.findByToken(query.token)
        if (!token) {
          return redirect($resolve.login(urlParams))
        }
      }
    } catch {
      error({
        statusCode: 503,
        message: 'Unable to fetch',
      })
    }
  },
  computed: {
    isUpdate() {
      return this.$route.query && 'token' in this.$route.query
    },
    hasError() {
      return this.invalidPassword
    },
    passwordPolicy() {
      return Object.values(this.$t('password_policy'))
    },
    token() {
      return this.isUpdate ? this.$route.query.token : null
    },
    urlParams() {
      return `?callback=${this.$store.getters.getCallback}`
    },
  },
  methods: {
    async onSubmit() {
      try {
        if (this.isUpdate) {
          if (this.hasError) return
          const token = await this.$service.token.findByToken()

          if (token) {
            this.$service.token.reset(token._id, { password: this.password })
            window.location = this.$store.getters.getCallback
          } else {
            this.$service.auth.feedback(
              this.$t('message.forget_password.expired')
            )
          }
        } else {
          const response = await this.$service.auth.find(this.email)

          if (response) {
            let token = await this.$service.token.findByUser(response._id)

            if (token) {
              token.expires = TokenModel.expireDate()
              await this.$service.token.update(token)
            } else {
              token = new TokenModel({ userId: response._id })
              await this.$service.token.insertWithToken(token)
            }

            this.$service.mail.forgetPassword(response.email, token.number)

            this.$router.push(this.$resolve.home(urlParams))
            this.$service.auth.feedback(
              this.$t('message.feedback.mail_sent'),
              eFeedback.success
            )
          }
        }
      } catch (err) {
        this.$service.auth.feedback(this.$t('message.feedback.error'))
      }
    },
    passwordValidation(error) {
      this.invalidPassword = error
    },
  },
}
</script>
