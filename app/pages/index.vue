<script setup lang="ts">
definePageMeta({
  layout: false
})

const { t } = useAppLocale()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-bg to-elevated">
    <UContainer class="flex min-h-screen items-center py-16 sm:py-24">
      <div class="mx-auto flex w-full max-w-3xl flex-col items-start gap-8">
        <UBadge
          color="primary"
          variant="subtle"
          label="Nuxt 4 + Nuxt UI"
        />

        <div class="space-y-4">
          <h1 class="max-w-2xl text-4xl font-semibold tracking-tight text-highlighted sm:text-5xl">
            {{ t('landing.title') }}
          </h1>

          <p class="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {{ t('landing.description') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <UButton
            to="/dashboard"
            size="xl"
            icon="i-lucide-layout-dashboard"
            :label="t('landing.openDashboard')"
          />

          <UButton
            to="/login"
            size="xl"
            color="neutral"
            variant="outline"
            icon="i-lucide-log-in"
            :label="t('landing.login')"
          />
        </div>

        <p class="text-sm text-muted">
          {{ t('landing.noAccount') }}
          <NuxtLink to="/register" class="font-medium text-primary hover:text-primary/80">
            {{ t('landing.register') }}
          </NuxtLink>
        </p>
      </div>
    </UContainer>
  </div>
</template>
