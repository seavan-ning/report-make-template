<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

useSeoMeta({
  title: t('errors.pageNotFound'),
  description: t('errors.pageNotFoundDescription')
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>
