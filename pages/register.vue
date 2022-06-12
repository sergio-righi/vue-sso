<template>
  <div class="login-content">
    <Feedback />
    <form @submit.prevent="onSubmit">
      <gv-row>
        <gv-col>
          <gv-input
            v-model="user.name"
            v-validation.required
            :label="$t('label.name')"
            autofocus
          />
        </gv-col>
        <gv-col>
          <Email v-model="user.email" required />
        </gv-col>
        <gv-col>
          <Password
            v-model="user.password"
            required
            @onerror="passwordValidation"
          />
        </gv-col>
        <gv-col>
          <gv-button submit primary stretch :disabled="hasError">
            {{ $t('action.sign_up') }}
          </gv-button>
        </gv-col>
        <gv-col class="justify-content-center">
          <gv-space y md bottom>
            <gv-flexbox align="center" justify="space-evenly">
              <span class="footnote">
                {{ $t('page.register.has_account') }}
                <gv-link :href="$resolve.home(urlParams)" muted>
                  {{ $t('action.sign_in') }}
                </gv-link>
              </span>
            </gv-flexbox>
          </gv-space>
        </gv-col>
      </gv-row>
    </form>
  </div>
</template>

<script>
import { TokenModel } from '@/models'
import { Email, Feedback, Password } from '@/components'

export default {
  name: 'onSubmit',
  components: {
    Email,
    Feedback,
    Password,
  },
  middleware: ['validate', 'not-auth'],
  data() {
    return {
      user: {},
      invalidPassword: false,
    }
  },
  computed: {
    hasError() {
      return this.invalidPassword
    },
    urlParams() {
      return `?${this.$route.fullPath.split('?')[1]}`
    },
  },
  methods: {
    async onSubmit() {
      if (this.hasError) return
      try {
        const hasAccount = await this.$service.auth.find(this.user.email)
        if (!hasAccount) {
          const response = await this.$service.auth.register(this.user)
          if (response) {
            const token = new TokenModel({ userId: response._id })
            await this.$service.token.insertWithCode(token)
            await this.$service.auth.login(
              response.email,
              response.password,
              false
            )
            await this.$service.mail.verificationCode(token.code)
            this.$router.push({
              path: this.$resolve.authorization(),
              query: { ...this.$route.query.callback },
            })
          } else {
            this.$service.auth.feedback(this.$t('message.feedback.error'))
          }
        } else {
          this.$router.push({
            path: this.$resolve.login(),
            query: { email: this.user.email, ...this.$route.query },
          })
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
