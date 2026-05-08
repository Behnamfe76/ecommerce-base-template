<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Period, Range, Sale } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()
const { t } = useAppLocale()
const { formatCurrency, formatDate } = useLocaleFormatters()

const UBadge = resolveComponent('UBadge')

const sampleEmails = [
  'james.anderson@example.com',
  'mia.white@example.com',
  'william.brown@example.com',
  'emma.davis@example.com',
  'ethan.harris@example.com'
]

const { data } = await useAsyncData('sales', async () => {
  const sales: Sale[] = []
  const currentDate = new Date()

  for (let i = 0; i < 5; i++) {
    const hoursAgo = randomInt(0, 48)
    const date = new Date(currentDate.getTime() - hoursAgo * 3600000)

    sales.push({
      id: (4600 - i).toString(),
      date: date.toISOString(),
      status: randomFrom(['paid', 'failed', 'refunded']),
      email: randomFrom(sampleEmails),
      amount: randomInt(100, 1000)
    })
  }

  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, {
  watch: [() => props.period, () => props.range],
  default: () => []
})

const columns: TableColumn<Sale>[] = [
  {
    accessorKey: 'id',
    header: t('sales.id'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'date',
    header: t('sales.date'),
    cell: ({ row }) => {
      return formatDate(row.getValue('date') as string, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'status',
    header: t('sales.status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const color = {
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      }[status]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        t(`sales.${status}`)
      )
    }
  },
  {
    accessorKey: 'email',
    header: t('customers.email')
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-end' }, t('sales.amount')),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      return h('div', { class: 'text-end font-medium' }, formatCurrency(amount, 'EUR', { maximumFractionDigits: 2 }))
    }
  }
]
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-s-lg last:rounded-e-lg border-y border-default first:border-s last:border-e',
      td: 'border-b border-default'
    }"
  />
</template>
