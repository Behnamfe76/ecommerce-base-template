<script setup lang="ts">
import * as z from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'
import type {
  AuthMethod,
  LoginCredentials,
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload
} from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

type PasswordState = LoginCredentials
type OtpState = OtpVerifyPayload

const { t } = useAppLocale()
const toast = useToast()
const { login, requestOtp, verifyOtp } = useAuthSession()
const {
  availableMethods,
  availableProviders,
  canUsePasskey,
  canUseAuthenticator
} = useAuthMethods()

const activeMethod = ref<AuthMethod>('password')
const otpChallenge = ref<OtpRequestResponse | null>(null)
const otpEmail = ref('')

const passwordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6)
})

const methodItems = computed(() => availableMethods.value.map(method => ({
  label: t(`auth.methods.${method}`),
  value: method
})))

const fields = computed<AuthFormField[]>(() => {
  if (activeMethod.value === 'otp') {
    return [{
      name: 'email',
      type: 'email',
      label: t('auth.email'),
      placeholder: 'name@example.com',
      required: true,
      disabled: Boolean(otpChallenge.value)
    }, {
      name: 'code',
      type: 'otp',
      label: t('auth.otpCode'),
      placeholder: t('auth.otpPlaceholder'),
      required: true
    }]
  }

  return [{
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
  }]
})

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

const loginMutation = useApiMutation({
  mutation: (credentials: PasswordState) => login(credentials)
})

const requestOtpMutation = useApiMutation({
  mutation: (payload: OtpRequestPayload) => requestOtp(payload),
  onSuccess: (response, payload) => {
    otpChallenge.value = response
    otpEmail.value = payload.email
  }
})

const verifyOtpMutation = useApiMutation({
  mutation: (payload: OtpState) => verifyOtp(payload)
})

const isSubmitting = computed(() =>
  loginMutation.isPending.value || requestOtpMutation.isPending.value || verifyOtpMutation.isPending.value
)

const currentSchema = computed(() => activeMethod.value === 'otp' ? otpSchema : passwordSchema)
const submitLabel = computed(() => {
  if (activeMethod.value === 'otp' && !otpChallenge.value) {
    return t('auth.sendOtpAction')
  }

  return activeMethod.value === 'otp'
    ? t('auth.verifyOtpAction')
    : t('auth.loginAction')
})

const formTitle = computed(() => {
  if (activeMethod.value === 'otp' && otpChallenge.value) {
    return t('auth.verifyOtpTitle')
  }

  return activeMethod.value === 'otp'
    ? t('auth.otpTitle')
    : t('auth.loginTitle')
})

const formDescription = computed(() => {
  if (activeMethod.value === 'otp' && otpChallenge.value) {
    return t('auth.verifyOtpDescription', { email: otpEmail.value })
  }

  return activeMethod.value === 'otp'
    ? t('auth.otpDescription')
    : t('auth.loginDescription')
})

watch(activeMethod, () => {
  otpChallenge.value = null
  otpEmail.value = ''
  requestOtpMutation.reset()
  verifyOtpMutation.reset()
})

async function onSubmit(event: FormSubmitEvent<PasswordState | OtpState>) {
  if (activeMethod.value === 'otp') {
    const payload = event.data as OtpState

    if (!otpChallenge.value) {
      const response = await requestOtpMutation.mutateAsync({
        email: payload.email
      })

      toast.add({
        title: t('common.success'),
        description: t('auth.otpSentDescription', { code: response.devCode ?? '******' }),
        color: 'success',
        icon: 'i-lucide-mail-check'
      })
      return
    }

    await verifyOtpMutation.mutateAsync(payload)

    toast.add({
      title: t('common.success'),
      description: t('auth.loginSuccess'),
      color: 'success',
      icon: 'i-lucide-check'
    })

    await navigateTo('/dashboard')
    return
  }

  await loginMutation.mutateAsync(event.data as PasswordState)

  toast.add({
    title: t('common.success'),
    description: t('auth.loginSuccess'),
    color: 'success',
    icon: 'i-lucide-check'
  })

  await navigateTo('/dashboard')
}

function handlePasskey() {
  toast.add({
    title: t('auth.passkeyTitle'),
    description: t('auth.passkeyDescription'),
    color: 'info',
    icon: 'i-lucide-key-round'
  })
}
</script>

<template>
  <div class="space-y-5">
    <div class="rounded-2xl border border-default/60 bg-default/70 p-1">
      <UTabs
        v-model="activeMethod"
        :items="methodItems"
        :content="false"
        class="w-full"
      />
    </div>

    <UAuthForm
      :schema="currentSchema"
      :fields="fields"
      :providers="providers"
      :title="formTitle"
      :description="formDescription"
      icon="i-lucide-shield-check"
      :submit="{ label: submitLabel }"
      :loading="isSubmitting"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="space-y-4">
          <div class="grid gap-2">
            <UButton
              v-if="canUsePasskey"
              color="neutral"
              variant="outline"
              icon="i-lucide-fingerprint"
              block
              :label="t('auth.passkeyAction')"
              @click="handlePasskey"
            />

            <UAlert
              v-else
              color="neutral"
              variant="subtle"
              icon="i-lucide-key-round"
              :title="t('auth.passkeyTitle')"
              :description="t('auth.passkeyDescription')"
            />

            <UAlert
              v-if="canUseAuthenticator"
              color="neutral"
              variant="subtle"
              icon="i-lucide-shield"
              :title="t('auth.authenticatorTitle')"
              :description="t('auth.authenticatorDescription')"
            />
          </div>

          <p class="text-sm text-muted">
            {{ t('auth.noAccount') }}
            <NuxtLink to="/register" class="font-medium text-primary hover:text-primary/80">
              {{ t('auth.registerLink') }}
            </NuxtLink>
          </p>
        </div>
      </template>
    </UAuthForm>
  </div>
</template>
