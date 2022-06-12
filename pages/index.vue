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
        <gv-button :href="$resolve.register(urlParams)" stretch>
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
  middleware: ['validate', 'not-auth'],
  data() {
    return {
      email: null,
    }
  },
  computed: {
    urlParams() {
      return `?${this.$route.fullPath.split('?')[1]}`
    },
  },
  methods: {
    async onSubmit() {
      try {
        const response = await this.$service.auth.find(this.email)
        if (response) {
          this.$router.push({
            path: this.$resolve.login(),
            query: { email: this.email, ...this.$route.query },
          })
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
  },
}
</script>
