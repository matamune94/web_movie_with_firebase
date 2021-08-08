/* eslint-disable no-unused-expressions */
export default function ({ store, redirect, route }) {
  store.state.user !== null && route.name === 'admin-login'
    ? redirect('/admin')
    : ''
  store.state.user === null && route.name !== 'admin-login'
    ? redirect('/admin/login')
    : ''
}
