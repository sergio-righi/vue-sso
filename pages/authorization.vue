<template>
  <div class="login-content">
    <Feedback />
    <form @submit.prevent="authorization">
      <gv-row>
        <gv-col>
          <gv-verification-code
            v-model="code"
            autofocus
            @ondone="verificationCallback"
          />
        </gv-col>
        <gv-col>
          <gv-button primary stretch>
            {{ $t('action.continue') }}
          </gv-button>
        </gv-col>
        <gv-col>
          <gv-flexbox justify="center">
            <span class="footnote">
              {{ $t('footnote.try_again') }}
              <gv-button inline @onclick="resendEmail">
                {{ $t('action.resend') }}
              </gv-button>
              {{ $t('linking_word.or') }}
              <gv-link :href="$resolve.login()" muted>
                {{ $t('action.sign_out') }}
              </gv-link>
            </span>
          </gv-flexbox>
        </gv-col>
      </gv-row>
    </form>
  </div>
</template>

<script>
import { Feedback } from '@/components'

export default {
  name: 'Authorization',
  components: {
    Feedback,
  },
  middleware: ['validate', 'auth'],
  data() {
    return { code: null }
  },
  methods: {
    async authorization() {
      try {
        const token = await this.$service.token.findByCode(
          this.$auth.user.id,
          this.code
        )
        if (token) {
          await this.$service.token.done(token._id)
          await this.$service.auth.fetch()
          this.$router.go(0)
        } else {
          this.code = null
          this.$service.auth.feedback(
            this.$t('message.authorization.not_match'),
            true
          )
        }
      } catch (err) {
        this.$service.auth.feedback(this.$t('message.feedback.error'), true)
      }
    },
    async resendEmail() {
      this.code = null
      const token = await this.$service.token.findByUser(this.$auth.user.id)
      if (token) {
        this.$service.mail.verificationCode(token.code)
        this.$service.auth.feedback(
          this.$t('message.feedback.mail_sent'),
          false
        )
      } else {
        this.$service.auth.feedback(
          this.$t('message.authorization.not_found'),
          true
        )
      }
    },
    verificationCallback(code) {
      this.code = code
      this.authorization()
    },
  },
}
</script>
