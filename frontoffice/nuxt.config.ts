import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        'nuxt-toast',
        '@pinia/nuxt'
    ],
    vite: {
        plugins: [
            tailwindcss()
        ]
    },
    pinia: {
       autoImport: true
    },
})