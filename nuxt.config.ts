import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: 'pt-BR'
            },
            meta: [
                { name: 'description', content: 'Sistema de gestão financeira' }
            ],
            link: [
                { rel: 'icon', type: 'image/png', href: '/icon.png' }
            ]
        }
    },
    nitro: {
        publicAssets: [
            {
                baseURL: '/',
                dir: 'public',
                maxAge: 60 * 60 * 24 * 7
            }
        ],
        prerender: {
            routes: ['/robots.txt', '/sitemap.xml']
        }
    },
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: [
        '@primevue/nuxt-module',
        '@nuxt/content',
        '@nuxt/image',
        '@nuxt/scripts',
        '@pinia/nuxt'
    ],
    css: [
        '../assets/styles/main.css',
    ],
    primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
            }
        }
    }
})