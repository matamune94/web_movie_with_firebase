export const state = () => ({
  user: null,
  countries: []
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (authUser) {
      const { uid, email, emailVerified } = authUser
      state.user = { uid, email, emailVerified }
    } else {
      state.user = null
    }
  },

  SET_COUNTRIES: (state, data) => {
    state.countries = data
  }
}
