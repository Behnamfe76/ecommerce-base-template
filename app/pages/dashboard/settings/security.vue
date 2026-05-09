<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const { t } = useAppLocale()

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    :title="t('settings.password')"
    :description="t('settings.passwordDescription')"
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex max-w-xs flex-col gap-4"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          :placeholder="t('settings.currentPassword')"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          :placeholder="t('settings.newPassword')"
          class="w-full"
        />
      </UFormField>

      <UButton :label="t('common.update')" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    :title="t('settings.account')"
    :description="t('settings.accountDescription')"
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton :label="t('settings.deleteAccount')" color="error" />
    </template>
  </UPageCard>
</template>
