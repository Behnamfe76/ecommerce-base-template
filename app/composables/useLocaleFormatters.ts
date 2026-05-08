type DateLike = Date | string | number

function toDate(value: DateLike) {
  return value instanceof Date ? value : new Date(value)
}

export function useLocaleFormatters() {
  const { localeInfo } = useAppLocale()

  const language = computed(() => localeInfo.value.language)

  function formatDate(value: DateLike, options?: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat(language.value, options).format(toDate(value))
  }

  function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat(language.value, options).format(value)
  }

  function formatCurrency(value: number, currency = 'USD', options?: Intl.NumberFormatOptions) {
    return formatNumber(value, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
      ...options
    })
  }

  function formatRelativeTimeFromNow(value: DateLike) {
    const date = toDate(value)
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
    const absSeconds = Math.abs(diffSeconds)

    const rtf = new Intl.RelativeTimeFormat(language.value, { numeric: 'auto' })

    if (absSeconds < 60) {
      return rtf.format(diffSeconds, 'second')
    }

    const diffMinutes = Math.round(diffSeconds / 60)
    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, 'minute')
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, 'hour')
    }

    const diffDays = Math.round(diffHours / 24)
    if (Math.abs(diffDays) < 7) {
      return rtf.format(diffDays, 'day')
    }

    const diffWeeks = Math.round(diffDays / 7)
    if (Math.abs(diffWeeks) < 5) {
      return rtf.format(diffWeeks, 'week')
    }

    const diffMonths = Math.round(diffDays / 30)
    if (Math.abs(diffMonths) < 12) {
      return rtf.format(diffMonths, 'month')
    }

    const diffYears = Math.round(diffDays / 365)
    return rtf.format(diffYears, 'year')
  }

  return {
    language,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTimeFromNow
  }
}
