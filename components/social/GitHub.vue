<template>
  <gv-button
    :href="`http://localhost:4000/auth/github?callback=${callback}`"
    bg="black"
    color="white"
    stretch
  >
    <gv-icon value="github" /> {{ $t('auth.github') }}
  </gv-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class GitHub extends Vue {
  @Prop({ type: String }) callback!: string
}
</script>
