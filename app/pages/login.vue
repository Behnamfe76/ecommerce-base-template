<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { LoginCredentials } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { t } = useAppLocale()
const toast = useToast()
const { login } = useAuthSession()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const fields = computed<AuthFormField[]>(() => [{
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
}])

const loginMutation = useApiMutation({
  mutation: (credentials: LoginCredentials) => login(credentials)
})

async function onSubmit(event: FormSubmitEvent<LoginCredentials>) {
  await loginMutation.mutateAsync(event.data)

  toast.add({
    title: t('common.success'),
    description: t('auth.loginSuccess'),
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
    :title="t('auth.loginTitle')"
    :description="t('auth.loginDescription')"
    icon="i-lucide-log-in"
    :submit="{ label: t('auth.loginAction') }"
    :loading="loginMutation.isPending.value"
    @submit="onSubmit"
  >
    <template #footer>
      <p class="text-sm text-muted">
        {{ t('auth.noAccount') }}
        <NuxtLink to="/register" class="font-medium text-primary hover:text-primary/80">
          {{ t('auth.registerLink') }}
        </NuxtLink>
      </p>
    </template>
  </UAuthForm>
</template>
