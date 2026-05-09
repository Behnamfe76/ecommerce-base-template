<script setup lang="ts">
const { t } = useAppLocale()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-bg to-elevated">
    <UContainer class="flex min-h-screen flex-col py-8 sm:py-10">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink to="/" class="text-sm font-medium text-muted transition-colors hover:text-highlighted">
          {{ t('auth.backToHome') }}
        </NuxtLink>

        <UButton
          to="/dashboard"
          color="neutral"
          variant="ghost"
          icon="i-lucide-layout-dashboard"
          :label="t('auth.openDashboard')"
        />
      </div>

      <div class="flex flex-1 items-center justify-center py-10">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </div>
    </UContainer>
  </div>
</template>
