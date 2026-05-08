const APP_LOCALES = {
  en: {
    code: 'en',
    name: 'English',
    language: 'en-US',
    dir: 'ltr'
  },
  fa: {
    code: 'fa',
    name: 'فارسی',
    language: 'fa-IR',
    dir: 'rtl'
  }
} as const

export function useAppLocale() {
  const { locale, setLocale, t } = useI18n()

  const availableLocales = Object.values(APP_LOCALES)

  const localeInfo = computed(() => {
    return APP_LOCALES[locale.value as keyof typeof APP_LOCALES] ?? APP_LOCALES.en
  })

  const isRtl = computed(() => localeInfo.value.dir === 'rtl')

  return {
    locale,
    setLocale,
    t,
    localeInfo,
    availableLocales,
    isRtl
  }
}
