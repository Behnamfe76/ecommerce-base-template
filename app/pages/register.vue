<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'
import type { RegisterCredentials } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { t } = useAppLocale()
const toast = useToast()
const { register } = useAuthSession()
const { availableProviders } = useAuthMethods()

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type RegisterFormState = RegisterCredentials & {
  confirmPassword: string
}

const fields = computed<AuthFormField[]>(() => [{
  name: 'name',
  type: 'text',
  label: t('auth.name'),
  placeholder: t('auth.namePlaceholder'),
  required: true
}, {
  name: 'email',
  type: 'email',
  label: t('auth.email'),
  placeholder: 'name@example.com',
  required: true
}, {
  name: 'password',
  type: 'password',
  label: t('auth.password'),
  placeholder: t('auth.passwordPlaceholder'),
  required: true
}, {
  name: 'confirmPassword',
  type: 'password',
  label: t('auth.confirmPassword'),
  placeholder: t('auth.confirmPasswordPlaceholder'),
  required: true
}])

const providers = computed<ButtonProps[]>(() => availableProviders.value.map(provider => ({
  label: t(`auth.providers.${provider}`),
  icon: provider === 'google' ? 'i-simple-icons-google' : 'i-simple-icons-github',
  color: 'neutral',
  variant: 'subtle',
  block: true,
  onClick: () => {
    toast.add({
      title: t('auth.providerUnavailableTitle'),
      description: t('auth.providerUnavailableDescription', { provider: t(`auth.providers.${provider}`) }),
      color: 'warning',
      icon: 'i-lucide-info'
    })
  }
})))

const registerMutation = useApiMutation({
  mutation: ({ confirmPassword: _confirmPassword, ...payload }: RegisterFormState) => register(payload)
})

async function onSubmit(event: FormSubmitEvent<RegisterFormState>) {
  await registerMutation.mutateAsync(event.data)

  toast.add({
    title: t('common.success'),
    description: t('auth.registerSuccess'),
    color: 'success',
    icon: 'i-lucide-check'
  })

  await navigateTo('/dashboard')
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :providers="providers"
    :title="t('auth.registerTitle')"
    :description="t('auth.registerDescription')"
    icon="i-lucide-user-plus"
    :submit="{ label: t('auth.registerAction') }"
    :loading="registerMutation.isPending.value"
    @submit="onSubmit"
  >
    <template #footer>
      <p class="text-sm text-muted">
        {{ t('auth.haveAccount') }}
        <NuxtLink to="/login" class="font-medium text-primary hover:text-primary/80">
          {{ t('auth.loginLink') }}
        </NuxtLink>
      </p>
    </template>
  </UAuthForm>
</template>
