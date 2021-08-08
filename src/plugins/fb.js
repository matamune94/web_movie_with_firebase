import Vue from 'vue'
Vue.prototype.$initFbSDK = () => {
  // eslint-disable-next-line no-undef
  FB.init({
    appId: '',
    cookie: true,
    xfbml: true,
    version: 'v8.0'
  })
}
