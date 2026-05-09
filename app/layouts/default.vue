<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const { t, isRtl } = useAppLocale()

const open = ref(false)

const searchUi = {
  modal: 'sm:max-w-3xl overflow-hidden border border-default/60 bg-default/95 shadow-2xl shadow-black/10 backdrop-blur-xl dark:bg-elevated/95 dark:shadow-black/40',
  content: 'divide-y divide-default/60',
  viewport: 'max-h-[24rem] divide-y divide-default/40',
  group: 'p-2',
  label: 'px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted',
  input: 'flex flex-col h-14 border-0 bg-transparent px-4 text-sm text-highlighted placeholder:text-muted focus:ring-0 text-start',
  empty: 'px-6 py-12',
  footer: 'flex items-center justify-between gap-3 px-4 py-3 bg-elevated/40 dark:bg-elevated/20',
  item: 'group relative flex flex-row rtl:flex-row-reverse w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-start transition-colors data-[selected=true]:bg-primary/10 data-[selected=true]:text-highlighted dark:data-[selected=true]:bg-primary/15',
  itemLeadingIcon: 'size-5 shrink-0 text-dimmed group-data-[selected=true]:text-primary',
  itemLabel: 'truncate text-sm font-medium text-highlighted',
  itemDescription: 'truncate text-xs text-muted',
  itemTrailing: 'flex shrink-0 items-center gap-1.5 text-dimmed'
}

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
        <UDashboardSearchButton
          :label="t('common.search')"
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

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

    <UDashboardSearch
      :groups="groups"
      :ui="searchUi"
      :placeholder="`${t('common.search')}...`"
    >
      <template #group-label="{ label, ui }">
        <div
          :class="[ui.label, 'flex items-center gap-2 text-start flex-row-reverse rtl:flex-row rtl:text-end']"
        >
          <span class="h-px flex-1 bg-default/70" />
          <span>{{ label }}</span>
          <span class="h-px w-6 bg-default/70" />
        </div>
      </template>

      <template #item-leading="{ item, ui }">
        <div class="flex items-center justify-center rounded-lg bg-elevated/80 p-2 ring-1 ring-inset ring-default/60 dark:bg-default/40">
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            :class="ui.itemLeadingIcon"
          />
          <UIcon
            v-else-if="item.checked"
            name="i-lucide-check"
            :class="ui.itemLeadingIcon"
          />
          <UIcon
            v-else
            name="i-lucide-circle"
            :class="ui.itemLeadingIcon"
          />
        </div>
      </template>

      <template #item-label="{ item, ui }">
        <div class="min-w-0 flex-1 text-start rtl:text-end">
          <div :class="ui.itemLabel">
            {{ item.label }}
          </div>
          <div
            v-if="item.suffix"
            :class="ui.itemDescription"
          >
            {{ item.suffix }}
          </div>
        </div>
      </template>

      <template #item-trailing="{ item, ui }">
        <div
          :class="[ui.itemTrailing, 'ltr:ml-auto rtl:mr-auto rtl:flex-row-reverse']"
        >
          <UBadge
            v-if="item.target === '_blank'"
            color="neutral"
            variant="soft"
            size="sm"
            label="↗"
            class="rounded-md"
          />

          <template v-if="item.kbds?.length">
            <UKbd
              v-for="(kbd, index) in item.kbds"
              :key="index"
              size="sm"
              variant="subtle"
              class="uppercase"
            >
              {{ kbd }}
            </UKbd>
          </template>

          <UIcon
            v-if="item.children?.length"
            :name="isRtl ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
            class="size-4 shrink-0 text-dimmed"
          />
        </div>
      </template>

      <template #empty="{ searchTerm }">
        <div class="flex flex-col items-center justify-center gap-3 text-center">
          <div class="flex size-12 items-center justify-center rounded-2xl bg-elevated ring-1 ring-inset ring-default/60 dark:bg-default/40">
            <UIcon name="i-lucide-search-x" class="size-5 text-dimmed" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-highlighted">
              {{ t('common.noResults') }}
            </p>
            <p class="text-xs text-muted">
              {{ searchTerm ? `${t('common.search')}: ${searchTerm}` : t('search.helpText') }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-between gap-3 rtl:flex-row-reverse">
          <div class="min-w-0 text-start rtl:text-end">
            <p class="text-xs font-medium text-highlighted">
              {{ t('search.footerPrimary') }}
            </p>
            <p class="text-[11px] text-muted">
              {{ t('search.footerSecondary') }}
            </p>
          </div>

          <div class="flex items-center gap-1.5 rtl:flex-row-reverse">
            <UKbd size="sm" variant="subtle">
              ↑
            </UKbd>
            <UKbd size="sm" variant="subtle">
              ↓
            </UKbd>
            <UKbd size="sm" variant="subtle">
              Enter
            </UKbd>
          </div>
        </div>
      </template>
    </UDashboardSearch>

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
