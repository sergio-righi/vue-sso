<template>
  <div class="login-content">
    <gv-flexbox flex align="center" justify="center">
      <gv-progress-circle
        v-if="processing"
        color="primary"
        indeterminate
        size="40"
        width="3"
      />
      <gv-space x lg left>
        <span>{{ message }}</span>
      </gv-space>
    </gv-flexbox>
  </div>
</template>

<script>
export default {
  middleware: ['not-auth'],
  data() {
    return {
      processing: true,
      message: this.$t('message.authentication.ongoing'),
    }
  },
  async created() {
    try {
      const { query } = this.$route
      const callback = query.callback || this.$store.getters.getCallback
      const response = await this.$service.auth.refresh(query.token)
      if (response) {
        if (callback) {
          this.$service.auth.callback(null)
          window.location.href = callback
        } else {
          this.processing = false
          this.message = this.$t('message.authentication.no_callback')
        }
      } else {
        this.processing = false
        this.message = this.$t('message.authentication.not_finished')
      }
    } catch (err) {
      this.processing = false
      this.message = this.$t('message.authentication.error')
    }
  },
}
</script>
