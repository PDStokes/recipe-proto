
export default {
    mode: 'universal',
    /*
  ** Headers of the page
  */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png' },
        ],
        script: [
            { src: 'https://kit.fontawesome.com/b57b99e256.js', crossorigin: 'anonymous' },
        ],
    },
    /*
  ** Customize the progress-bar color
  */
    loading: { color: '#fff' },
    /*
  ** Global CSS
  */
    css: [
        '~/assets/scss/app.scss',
    ],
    styleResources: {
        scss: '~/assets/scss/base/*.scss',
    },
    /*
  ** Plugins to load before mounting the App
  */
    plugins: [
        '~/plugins/siteParser',
    ],
    /*
  ** Nuxt.js modules
  */
    modules: [
    // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/eslint-module',
        '@nuxtjs/style-resources',
    ],
    serverMiddleware: [
        '~/api/crawlResponse',
    ],
    env: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
};
