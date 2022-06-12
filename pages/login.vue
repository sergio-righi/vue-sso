<template>
  <div class="login-content">
    <Feedback />
    <form @submit.prevent="onSubmit">
      <gv-input :value="email" readonly :label="$t('label.email')">
        <template #trailing>
          <gv-button :href="$resolve.home(urlParams)" sm>
            <gv-icon value="swap-horizontal" size="24px" />
          </gv-button>
        </template>
      </gv-input>
      <gv-input
        v-model="password"
        v-validation.required
        :label="$t('label.password')"
        type="password"
      />
      <gv-flexbox>
        <gv-button submit primary stretch>
          {{ $t('action.sign_in') }}
        </gv-button>
        <gv-button :href="$resolve.register(urlParams)" stretch>
          {{ $t('action.sign_up') }}
        </gv-button>
      </gv-flexbox>
      <gv-space y sm>
        <gv-flexbox justify="center">
          <gv-link class="footnote" :href="$resolve.password(urlParams)" muted>
            {{ $t('page.login.forget_password') }}
          </gv-link>
        </gv-flexbox>
      </gv-space>
    </form>
  </div>
</template>

<script>
import { Feedback } from '@/components'

export default {
  name: 'SignIn',
  components: {
    Feedback,
  },
  middleware: ['validate', 'not-auth'],
  data() {
    return {
      password: null,
    }
  },
  computed: {
    email() {
      return this.$route.query.email
    },
    urlParams() {
      return `?callback=${this.$store.getters.getCallback}`
    },
  },
  methods: {
    async onSubmit() {
      try {
        const response = await this.$service.auth.login(
          this.email,
          this.password
        )
        if (response) {
          window.location = this.$store.getters.getCallback
        } else {
          this.$service.auth.feedback(this.$t('message.login.wrong_password'))
        }
      } catch (err) {
        this.$service.auth.feedback(this.$t('message.feedback.error'))
      }
    },
  },
}
</script>
