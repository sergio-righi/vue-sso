<template>
  <div id="login">
    <div class="login-container">
      <div class="login-header">
        <gv-image class="brand" src="logo_horizontal.png" />
      </div>
      <Nuxt />
      <div class="login-footer">
        <div class="message">
          {{ $t('footnote.login') }}
          <gv-link href="#" muted>{{
            $t('agreement.terms_of_service')
          }}</gv-link
          >,
          <gv-link href="#" muted>{{ $t('agreement.privacy_policy') }}</gv-link>
          {{ $t('linking_word.and') }}
          <gv-link href="#" muted>{{ $t('agreement.cookie_policy') }}</gv-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$service.auth.feedback(null)
    this.$service.auth.callback(this.$route.query.callback ?? null)
  },
}
</script>
