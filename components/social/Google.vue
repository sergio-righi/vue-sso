<template>
  <gv-button
    href="http://localhost:4000/auth/google/"
    bg="red-600"
    color="white"
    stretch
  >
    <gv-icon value="google" /> {{ $t('auth.google') }}
  </gv-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Google extends Vue {}
</script>
