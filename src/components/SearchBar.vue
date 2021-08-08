<template>
  <div class="search-bar">
    <el-input
      v-model="search"
      placeholder="Tìm phim"
      suffix-icon="el-icon-search"
      @input="typing = true"
    >
    </el-input>
    <div class="list-search">
      <div v-for="(item, idx) in items" :key="idx" class="item">
        <n-link :to="`/movies/${item.slug}`" @click.native="items = []">
          <el-row type="flex">
            <div>
              <el-image
                style="width: 50px; height: 75px; display: block"
                fit="cover"
                :src="item.poster"
              ></el-image>
            </div>
            <div class="info">
              <h3 class="title">{{ item.name }}</h3>

              <div class="release-date">2020</div>
            </div>
          </el-row>
        </n-link>
      </div>
    </div>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce'
export default {
  data() {
    return {
      search: '',
      items: [],
      typing: false
    }
  },
  watch: {
    search: _debounce(function (v) {
      this.typing = false
      if (!this.typing) {
        // this.$store.commit('SEARCH', this.search)
        this.list(v)
      }
    }, 500)
  },
  mounted() {},
  methods: {
    async list(keyword) {
      if (!keyword.trim()) {
        this.items = []
        return
      }
      try {
        const snap = await this.$fireStore
          .collection('films')
          .where('match', 'array-contains', keyword.toLowerCase())
          .limit(10)
          .get()
        // console.log(snap.docs.map(doc => doc.data()))
        this.items = snap.docs.map(doc => doc.data())
      } catch (err) {
        console.log(err)
      }
    }
    // handleSelect(item) {
    //   console.log(item)
    // }
  }
}
</script>

<style lang="scss" scoped>
.search-bar ::v-deep {
  width: 100%;
  max-width: 365px;
  position: relative;
  .list-search {
    position: absolute;
    z-index: 999;
    width: 100%;
    .item {
      margin: 0.5em 0;
      padding: 0 0.5em;
      .info {
        padding-left: 1em;
        font-size: 12px;
      }
      // a {
      //   color: #fff !important;
      // }
    }
  }
}
</style>
