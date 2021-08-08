<template>
  <div>
    <el-row ref="sidebarBook" type="flex" style="margin-bottom: 1em">
      <el-col>
        <el-button size="medium" type="info" @click="$router.back()">
          Quay lại
        </el-button>
      </el-col>
      <el-col>
        <el-button
          size="medium"
          type="primary"
          style="float: right"
          :loading="uploading"
          @click="create"
        >
          Tạo phim
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
  data() {
    return {
      form: {
        _id: this.$_ObjectId(),
        name: null,
        rawName: null,
        description: null,
        imdb: 0,
        code: Math.round(new Date() / 1000),
        video_demo: null,
        poster: null,
        thumbnails: [],
        release_date: null,
        duration: null,
        sub_types: [],
        countries: [],
        genres: [],
        casts: [],
        quality: [],
        categories: [],
        published: true,
        episodes: [{ name: null, url: null, link: null, quality: null }]
      },
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
    async create() {
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
      const snapshot = await collection.where('slug', '==', item.slug).get()
      if (snapshot.docs.map(doc => doc.data()).length) {
        this.$notify({
          title: 'Error',
          message: 'Book is exists',
          type: 'error'
        })
        return
      }
      this.uploading = true
      item.createdAt = this.$fireStoreObj.FieldValue.serverTimestamp()
      item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
      item.numDoc = (await this.$_lastNumDoc(collection)) + 1
      // console.log(item)
      try {
        await collection.doc(item._id).set(item)
        await this.createItems('countries', item.countries)
        await this.createItems('genres', item.genres)
        await this.createItems('casts', item.casts)
        this.$notify({
          title: 'Success',
          message: 'Phim đã được tạo.',
          type: 'success'
        })
        this.$router.push(`/admin/films/edit/${item._id}`)
      } catch (err) {
        console.log(err)
        this.$notify({
          title: 'Error',
          message: 'Có lỗi gì rồi liên hệ thằng develoment',
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
      if (window.scrollY > 200) {
        this.$refs.sidebarBook.$el.classList.add('sidebar-book-active')
      } else {
        this.$refs.sidebarBook.$el.classList.remove('sidebar-book-active')
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
