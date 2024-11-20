export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  //devtools: { enabled: true },
  css: [
    '~/assets/css/style.css',
    '@fortawesome/fontawesome-free/css/all.min.css'
    //  'monaco-editor/min/vs/editor/editor.main.css' 
  ],
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui'],
  // plugins: [
  //   '~/plugins/monaco-editor.js'
  // ]
  
})
