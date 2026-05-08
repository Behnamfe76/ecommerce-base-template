<script setup lang="ts">
const { t } = useAppLocale()

const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = computed(() => [{
  title: t('settings.notificationChannels'),
  description: t('settings.notificationChannelsDescription'),
  fields: [{
    name: 'email',
    label: t('settings.channelEmail'),
    description: t('settings.channelEmailDescription')
  }, {
    name: 'desktop',
    label: t('settings.channelDesktop'),
    description: t('settings.channelDesktopDescription')
  }]
}, {
  title: t('settings.accountUpdates'),
  description: t('settings.accountUpdatesDescription'),
  fields: [{
    name: 'weekly_digest',
    label: t('settings.weeklyDigest'),
    description: t('settings.weeklyDigestDescription')
  }, {
    name: 'product_updates',
    label: t('settings.productUpdates'),
    description: t('settings.productUpdatesDescription')
  }, {
    name: 'important_updates',
    label: t('settings.importantUpdates'),
    description: t('settings.importantUpdatesDescription')
  }]
}])

async function onChange() {
  // Do something with data
  console.log(state)
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
