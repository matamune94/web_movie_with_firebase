export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,
  target: 'static',
  srcDir: 'src/',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s | Zerophim.Com',
    title: 'Chia Sẻ Đam Mê, Thành Công Sẽ Đến',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
        crossorigin: 'anonymous'
      }
    ],
    script: [
      { src: '//connect.facebook.net/vi_VN/sdk.js' },
      { src: '//connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['element-ui/lib/theme-chalk/index.css', '@assets/css/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/element-ui', { mode: 'client', src: '@/plugins/fb' }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
    // '@nuxtjs/google-analytics'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/firebase'
    // https://sitemap.nuxtjs.org
    // '@nuxtjs/sitemap'
  ],

  // sitemap: [
  //   {
  //     hostname: 'https://zerophim.com',
  //     path: '/sitemap/movies.xml',
  //     exclude: ['/admin/**'],
  //     async routes() {
  //       const { db } = require('./src/plugins/fireInit')
  //       const snapshots = await db.collection('films').get()
  //       return snapshots.docs.map((doc) => `/movies/${doc.data().slug}`)
  //     }, // promise or function
  //     cacheTime: 1000 * 60 * 60 * 12,
  //     gzip: true
  //   }
  // ],

  googleAnalytics: {
    id: ''
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyCvcYGn7P263ED-AP7dp8fZKKfwsujFZKQ',
      authDomain: 'zerophim-ae20a.firebaseapp.com',
      databaseURL: 'https://zerophim-ae20a.firebaseio.com',
      projectId: 'zerophim-ae20a',
      storageBucket: 'zerophim-ae20a.appspot.com',
      messagingSenderId: '112044619204',
      appId: '1:112044619204:web:ee90ebdb0ef931b266e091',
      measurementId: 'G-73W87Q9S3S'
    },
    services: {
      auth: {
        persistence: 'local', // default

        // it is recommended to configure either a mutation or action but you can set both
        initialize: {
          onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION'
          // onAuthStateChangedAction: 'onAuthStateChangedAction'
        },

        ssr: false // default
      },
      firestore: true,
      functions: true,
      storage: true,
      messaging: true,
      performance: true,
      analytics: true,
      remoteConfig: true
    }
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: {
      ignoreOrder: true
    },
    transpile: [/^element-ui/]
  },

  server: {
    port: 3555 // default: 3000
    // host: '127.0.0.1' // default: localhost,
  }
}
