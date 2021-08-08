<template>
  <nuxt-child />
</template>

<script>
export default {
  // This page just only set layout for admin folder
  layout: 'admin',
  middleware: 'auth',
  async asyncData({ store, $fireStore }) {
    const collection = $fireStore.collection('countries')
    try {
      const countries = await collection.get()
      const dataCountries = countries.docs.map(doc => {
        return {
          name: doc.data().name,
          slug: doc.data().slug
        }
      })
      store.commit('SET_COUNTRIES', dataCountries)
    } catch (err) {
      console.log(err)
    }
  }
}
</script>
