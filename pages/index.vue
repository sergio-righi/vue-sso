<template>
  <div class="login-content">
    <Feedback />
    <form @submit.prevent="onSubmit">
      <gv-input
        v-model="email"
        v-validation.required.email
        :label="$t('label.email')"
        autofocus
      />
      <gv-flexbox>
        <gv-button submit primary stretch>
          {{ $t('action.sign_in') }}
        </gv-button>
        <gv-button @onclick="redirectToRegister" stretch>
          {{ $t('action.sign_up') }}
        </gv-button>
      </gv-flexbox>
      <div class="horizontal-line">
        <span>{{ $t('linking_word.or') }}</span>
      </div>
      <gv-space y md>
        <Google />
        <gv-space y sm />
        <GitHub />
      </gv-space>
    </form>
  </div>
</template>

<script>
import { Feedback } from '@/components'
import { eFeedback } from '@/utils/enum'
import { Google, GitHub } from '@/components/social'

export default {
  name: 'SignIn',
  components: {
    Feedback,
    Google,
    GitHub,
  },
  middleware: ['not-auth', 'validate'],
  data() {
    return {
      email: null,
    }
  },
  computed: {
    callback() {
      return this.$store.getters.getCallback
    },
  },
  methods: {
    async onSubmit() {
      try {
        const response = await this.$service.auth.find(this.email)
        if (response) {
          this.redirectToLogin()
        } else {
          this.$service.auth.feedback(
            this.$t('message.login.not_exist'),
            eFeedback.warning
          )
        }
      } catch (err) {
        this.$service.auth.feedback(
          this.$t(
            /401/.test(err)
              ? 'message.feedback.not_exist'
              : 'message.feedback.error'
          ),
          true
        )
      }
    },
    redirectToRegister() {
      this.$router.push(this.$resolve.register(this.callback))
    },
    redirectToLogin() {
      this.$router.push(this.$resolve.login(this.email, this.callback))
    },
  },
}
</script>
