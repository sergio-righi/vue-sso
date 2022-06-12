<template>
  <gv-button
    href="http://localhost:4000/auth/github/"
    bg="gray-800"
    color="white"
    stretch
  >
    <gv-icon value="github" /> {{ $t('auth.github') }}
  </gv-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class GitHub extends Vue {}
</script>
