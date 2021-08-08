<template>
  <div class="list-related-main">
    <el-row class="title-list" type="flex" justify="space-between">
      <h2>Phim liên quan</h2>
      <!-- <div class="show-all">
              <n-link to="/movies"> Xem tất cả </n-link>
            </div> -->
    </el-row>
    <ListCard :items="items" />
  </div>
</template>

<script>
import _sampleSize from 'lodash/sampleSize'

export default {
  props: {
    genres: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      items: []
    }
  },
  async created() {
    if (this.genres.length) {
    const snap = await this.$fireStore.collection('films').where('genres', 'array-contains-any', this.genres).limit(30).get()
    this.items = _sampleSize(snap.docs.map(doc => doc.data()), 12)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-related-main ::v-deep {
  margin-top: 1em;
  .title-list {
    margin-bottom: 1em;
    h2 {
      font-size: 20px;
      font-weight: 500;
      padding-left: 10px;
      border-left: solid 3px #408bea;
    }
    // .show-all {
    //   float: right;
    //   font-weight: 500;
    //   background: #408bea;
    //   margin-right: 18px;
    //   a {
    //     font-size: 12px;
    //     font-weight: 500;
    //     padding: 0 1em;
    //     border-radius: 3px;
    //     color: #fff !important;
    //   }
    // }
  }
  // @media screen and (max-width: 425px) {
  //   .title-list .show-all a {
  //     padding: 0 0.5em;
  //   }
  // }
}
</style>
