<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const { t } = useAppLocale()

const open = ref(false)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: t('nav.home'),
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.inbox'),
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.customers'),
  icon: 'i-lucide-users',
  to: '/customers',
  onSelect: () => {
    open.value = false
  }
}, {
  label: t('nav.settings'),
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: t('nav.general'),
    to: '/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: t('nav.members'),
    to: '/settings/members',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: t('nav.notifications'),
    to: '/settings/notifications',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: t('nav.security'),
    to: '/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}], [{
  label: t('nav.feedback'),
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: t('nav.helpSupport'),
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}]])

const groups = computed(() => [{
  id: 'links',
  label: t('nav.goTo'),
  items: [{
    label: t('nav.home'),
    icon: 'i-lucide-house',
    to: '/'
  }, {
    label: t('nav.inbox'),
    icon: 'i-lucide-inbox',
    to: '/inbox'
  }, {
    label: t('nav.customers'),
    icon: 'i-lucide-users',
    to: '/customers'
  }, {
    label: t('nav.general'),
    icon: 'i-lucide-user',
    to: '/settings'
  }, {
    label: t('nav.members'),
    icon: 'i-lucide-users',
    to: '/settings/members'
  }, {
    label: t('nav.notifications'),
    icon: 'i-lucide-bell',
    to: '/settings/notifications'
  }, {
    label: t('nav.security'),
    icon: 'i-lucide-shield',
    to: '/settings/security'
  }]
}, {
  id: 'code',
  label: t('nav.code'),
  items: [{
    id: 'source',
    label: t('nav.viewPageSource'),
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: t('cookie.title'),
    duration: 0,
    close: false,
    actions: [{
      label: t('cookie.accept'),
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: t('cookie.optOut'),
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]!"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]!"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
