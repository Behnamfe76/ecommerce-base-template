<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useAppLocale()

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: t('nav.general'),
  icon: 'i-lucide-user',
  to: '/dashboard/settings',
  exact: true
}, {
  label: t('nav.members'),
  icon: 'i-lucide-users',
  to: '/dashboard/settings/members'
}, {
  label: t('nav.notifications'),
  icon: 'i-lucide-bell',
  to: '/dashboard/settings/notifications'
}, {
  label: t('nav.security'),
  icon: 'i-lucide-shield',
  to: '/dashboard/settings/security'
}], [{
  label: t('settings.documentation'),
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}]])
</script>

<template>
  <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar :title="t('settings.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <UNavigationMenu :items="links" highlight class="-mx-1 flex-1" />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mx-auto flex w-full max-w-2xl flex-col gap-4 sm:gap-6 lg:gap-12">
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
