export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  //devtools: { enabled: true },
  css: [
    '~/assets/css/style.css',
    '@fortawesome/fontawesome-free/css/all.min.css'  // הוספת Font Awesome כאן
  ],
  modules: ['@nuxt/ui'],
  
})
