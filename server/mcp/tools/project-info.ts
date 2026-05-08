export default defineMcpTool({
  description: 'Return basic information about this Nuxt application.',
  handler: async () => ({
    name: 'ecommerce-base-template',
    framework: 'Nuxt',
    ui: '@nuxt/ui',
    purpose: 'Ecommerce dashboard template'
  })
})
