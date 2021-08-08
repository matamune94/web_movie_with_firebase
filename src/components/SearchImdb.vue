<template>
  <div style="padding-left: 1em; position: relative">
    <el-button
      :icon="loading ? 'el-icon-loading' : 'el-icon-search'"
      type="primary"
      :disabled="loading"
      @click="grap"
    ></el-button>
    <div v-if="show" class="main-result">
      <div class="menu-type">
        <el-button
          size="small"
          type="danger"
          @click="show = false"
        >Đóng</el-button>
      </div>
      <div class="menu-type">
        <el-button
          size="small"
          :type="type === 'movie' ? 'primary' : ''"
          :disabled="loading"
          @click="changeType('movie')"
        >Movies</el-button>
        <el-button
          size="small"
          :type="type === 'tv' ? 'primary' : ''"
          :disabled="loading"
          @click="changeType('tv')"
        >TV Shows</el-button>
      </div>
      <el-row
        v-for="(item, idx) in movies"
        :key="idx"
        type="flex"
        class="item-row"
        @click.native="seleteItem(item)"
      >
        <el-col :span="4">
          <el-image
            style="width: 60px;margin-top: 10px"
            :src="item.poster"
            fit="contain"
          ></el-image>
        </el-col>
        <el-col :span="20">
          {{ item.name }}
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import utils from '@/plugins/utils'

export default {
  mixins: [utils],
  props: {
    moreData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      movies: [],
      loading: false,
      show: false,
      type: 'movie'
    }
  },
  methods: {
    async grap() {
      if (!this.moreData.name || !this.moreData.name.trim()) {
        this.$message.error('Nhập tên phim trước khi search.')
        return
      }
      this.loading = true
      const qs = this.qs({
        type: this.type,
        keyword: this.moreData.name
      })
      try {
        const { data } = await this.$axios.get(
          `https://api-zero-phim.herokuapp.com/api/imdb/search?${qs}`
        )
        // console.log(data)
        this.movies = data
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      this.show = true
      // this.search(this.moreData.name)
    },
    changeType(type) {
      this.type = type
      this.grap()
    },
    async seleteItem(item) {
      const qs = this.qs({
        url: item.url
      })

      let film = {}
      try {
        const { data } = await this.$axios.get(
          `https://api-zero-phim.herokuapp.com/api/imdb/grap?${qs}`
        )
        film = data
        console.log(film)
      } catch (err) {
        this.$message.error(
          'Lổi không lấy được phim liên hệ thằng develoment để nó giải quyết.'
        )
        console.log(err)
      }

      const raw = this.moreData
      raw.name = film.name || null
      raw.rawName = film.rawName || film.name
      raw.imdb = film.imdb || 0
      raw.poster = film.poster || null
      raw.release_date = film.release_date || null
      raw.duration = film.duration || null
      raw.countries = film.countries.map(o => {
        return { name: o, slug: this.$_slugify(o) }
      })
      raw.genres = film.genres.map(o => {
        return { name: o, slug: this.$_slugify(o) }
      })
      raw.casts = film.casts.filter(o => o.name && o.character).map(o => {
        o.slug = this.$_slugify(o.name)
        return o
      })
      this.options = []
      this.hover = false
    },
    qs(params) {
      return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
    }
  }
}
</script>

<style lang="scss" scoped>
.youtube-select {
  .el-select-dropdown__item {
    height: 120px;
  }
}
.main-result {
  position: absolute;
  right: 0;
  z-index: 1;
  background: white;
  width: 400px;
  border: 1px solid;
  padding: 1em;
  border-radius: 4px;
  border-color: #d2d2d2;
  overflow: scroll;
  height: 500px;
  .item-row:hover {
    background: gainsboro;
    cursor: pointer;
  }
  .menu-type {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>
