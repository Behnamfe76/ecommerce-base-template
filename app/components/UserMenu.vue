<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  collapsed?: boolean
}>()

const colorMode = useColorMode()
const appConfig = useAppConfig()
const { t, availableLocales, locale, setLocale, isRtl } = useAppLocale()
const { user: authUser, fetchSession, logout } = useAuthSession()

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const fallbackUser = {
  name: 'Demo User',
  avatar: {
    src: 'https://i.pravatar.cc/128?u=demo-user',
    alt: 'Demo User'
  }
}

const user = computed(() => {
  if (authUser.value) {
    return {
      name: authUser.value.name,
      avatar: {
        src: `https://i.pravatar.cc/128?u=${authUser.value.email}`,
        alt: authUser.value.name
      }
    }
  }

  return fallbackUser
})

const contentAlign = computed(() => {
  if (isRtl.value) {
    return props.collapsed ? 'center' : 'end'
  }

  return props.collapsed ? 'center' : 'start'
})

const primaryContentAlign = computed(() => isRtl.value ? 'end' : 'start')
const neutralContentAlign = computed(() => isRtl.value ? 'start' : 'end')

const items = computed<DropdownMenuItem[][]>(() => ([[{
  type: 'label',
  label: user.value.name,
  avatar: user.value.avatar
}], [{
  label: t('userMenu.profile'),
  icon: 'i-lucide-user'
}, {
  label: t('userMenu.billing'),
  icon: 'i-lucide-credit-card'
}, {
  label: t('userMenu.settings'),
  icon: 'i-lucide-settings',
  to: '/dashboard/settings'
}], [{
  label: t('userMenu.theme'),
  icon: 'i-lucide-palette',
  children: [{
    label: t('userMenu.primary'),
    slot: 'chip',
    chip: appConfig.ui.colors.primary,
    content: {
      align: primaryContentAlign.value,
      collisionPadding: 16
    },
    children: colors.map(color => ({
      label: color,
      chip: color,
      slot: 'chip',
      checked: appConfig.ui.colors.primary === color,
      type: 'checkbox',
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.primary = color
      }
    }))
  }, {
    label: t('userMenu.neutral'),
    slot: 'chip',
    chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
    content: {
      align: neutralContentAlign.value,
      collisionPadding: 16
    },
    children: neutrals.map(color => ({
      label: color,
      chip: color === 'neutral' ? 'old-neutral' : color,
      slot: 'chip',
      type: 'checkbox',
      checked: appConfig.ui.colors.neutral === color,
      onSelect: (e) => {
        e.preventDefault()

        appConfig.ui.colors.neutral = color
      }
    }))
  }]
}, {
  label: t('userMenu.appearance'),
  icon: 'i-lucide-sun-moon',
  children: [{
    label: t('userMenu.light'),
    icon: 'i-lucide-sun',
    type: 'checkbox',
    checked: colorMode.value === 'light',
    onSelect(e: Event) {
      e.preventDefault()

      colorMode.preference = 'light'
    }
  }, {
    label: t('userMenu.dark'),
    icon: 'i-lucide-moon',
    type: 'checkbox',
    checked: colorMode.value === 'dark',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        colorMode.preference = 'dark'
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }]
}, {
  label: t('locale.label'),
  icon: 'i-lucide-languages',
  children: availableLocales.map(localeItem => ({
    label: t(`locale.${localeItem.code}`),
    type: 'checkbox',
    checked: locale.value === localeItem.code,
    onUpdateChecked(checked: boolean) {
      if (checked) {
        setLocale(localeItem.code)
      }
    },
    onSelect(e: Event) {
      e.preventDefault()
    }
  }))
}], [{
  label: t('userMenu.templates'),
  icon: 'i-lucide-layout-template',
  children: [{
    label: t('userMenu.starter'),
    to: 'https://starter-template.nuxt.dev/'
  }, {
    label: t('userMenu.landing'),
    to: 'https://landing-template.nuxt.dev/'
  }, {
    label: t('userMenu.docs'),
    to: 'https://docs-template.nuxt.dev/'
  }, {
    label: t('userMenu.saas'),
    to: 'https://saas-template.nuxt.dev/'
  }, {
    label: t('userMenu.dashboard'),
    to: 'https://dashboard-template.nuxt.dev/',
    color: 'primary',
    checked: true,
    type: 'checkbox'
  }, {
    label: t('userMenu.chat'),
    to: 'https://chat-template.nuxt.dev/'
  }, {
    label: t('userMenu.portfolio'),
    to: 'https://portfolio-template.nuxt.dev/'
  }, {
    label: t('userMenu.changelog'),
    to: 'https://changelog-template.nuxt.dev/'
  }]
}], [{
  label: t('userMenu.documentation'),
  icon: 'i-lucide-book-open',
  to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
  target: '_blank'
}, {
  label: t('userMenu.github'),
  icon: 'i-simple-icons-github',
  to: 'https://github.com/nuxt-ui-templates/dashboard',
  target: '_blank'
}, {
  label: t('userMenu.logout'),
  icon: 'i-lucide-log-out',
  async onSelect() {
    await logout()
    await navigateTo('/login')
  }
}]]))

onMounted(() => {
  if (!authUser.value) {
    fetchSession()
  }
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: contentAlign, collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
      itemLabel: 'text-start',
      itemDescription: 'text-start'
    }"
  >
    <UButton
      v-bind="{
        ...user,
        label: props.collapsed ? undefined : user?.name,
        trailingIcon: props.collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="props.collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        base: props.collapsed ? undefined : 'justify-between',
        label: 'text-start truncate',
        trailingIcon: 'text-dimmed shrink-0'
      }"
    />

    <template #item-trailing="{ item }">
      <UIcon
        v-if="item.children?.length"
        :name="isRtl ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
        class="shrink-0 size-5"
      />
    </template>

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5 ltr:mr-2 rtl:ml-2">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
