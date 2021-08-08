<template>
  <div>
    <el-row ref="sidebar" type="flex" style="margin-bottom: 1em">
      <el-col>
        <el-button
          size="medium"
          type="info"
          @click="$router.push('/admin/films')"
        >
          Quay lại
        </el-button>
      </el-col>
      <el-col>
        <el-button
          size="medium"
          type="primary"
          style="float: right"
          :loading="uploading"
          @click="update"
        >
          Update
        </el-button>
      </el-col>
    </el-row>
    <FormFilm :formdata="form" />
  </div>
</template>

<script>
import utils from '@/plugins/utils'
import _uniq from 'lodash/uniq'

export default {
  mixins: [utils],
  async asyncData({ app, params, error }) {
    const collection = app.$fireStore.collection('films')
    try {
      const doc = await collection.doc(params.id).get()
      return {
        form: doc.data()
      }
    } catch (err) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  data() {
    return {
      uploading: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async update() {
      this.uploading = true
      const collection = this.$fireStore.collection('films')
      const item = this.form
      item.slug = this.$_slugify(item.name)
      item.match = _uniq(
        [
          ...this.$_cutString(this.$_slugify(this.form.rawName)),
          ...this.$_cutString(this.form.slug)
        ].reduce((o, str) => {
          o = [...o, ...this.$_matchString(str)]
          return o
        }, [])
      )

      item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
      try {
        await collection.doc(item._id).update(item)
        await this.createItems('countries', item.countries)
        await this.createItems('genres', item.genres)
        await this.createItems('casts', item.casts)
        this.$notify({
          title: 'Success',
          message: 'Film updated',
          type: 'success'
        })
      } catch (err) {
        console.log(err)
        this.$notify({
          title: 'Error',
          message: 'Something wrong',
          type: 'error'
        })
      }
      this.uploading = false
    },

    async createItems(NameCollection, items) {
      const collection = this.$fireStore.collection(NameCollection)
      try {
        let lastNumDoc = await this.$_lastNumDoc(collection)
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const snapshot = await collection.where('slug', '==', item.slug).get()
          if (!snapshot.docs.map(doc => doc.data()).length) {
            item._id = this.$_ObjectId()
            lastNumDoc = lastNumDoc + 1
            item.numDoc = lastNumDoc
            await collection.doc(item._id).set(item)
          }
        }
      } catch (err) {
        console.log(err)
      }
    },

    handleScroll(e) {
      if (window.scrollY > 100) {
        this.$refs.sidebar.$el.classList.add('sidebar-book-active')
      } else {
        this.$refs.sidebar.$el.classList.remove('sidebar-book-active')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-book-active {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  left: 0;
  width: calc(100% - 200px);
  margin-left: 200px;
  background: white;
  padding: 1em;
}
</style>
