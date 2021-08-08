<template>
  <div class="client-home">
    <el-row>
      <el-col :md="18" :sm="24">
        <div>
          <el-row class="title-list" type="flex" justify="space-between">
            <h2>Phim mới cập nhật</h2>
            <div class="show-all">
              <n-link to="/movies"> Xem tất cả </n-link>
            </div>
          </el-row>
          <ListCardCustom :items="listNewUpdate" />
        </div>
        <div>
          <el-row class="title-list" type="flex" justify="space-between">
            <h2>Phim mới</h2>
            <div class="show-all">
              <n-link to="/movies"> Xem tất cả </n-link>
            </div>
          </el-row>
          <ListCardCustom :items="listNew" />
        </div>
        <div>
          <el-row class="title-list" type="flex" justify="space-between">
            <h2>Phim hot</h2>
            <div class="show-all">
              <n-link to="/movies"> Xem tất cả </n-link>
            </div>
          </el-row>
          <ListCardCustom :items="listHot" />
        </div>
      </el-col>
      <el-col :md="6" :sm="24">
        <TopView />
        <div>
          <h3>FanPage:</h3>
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FZeroPhim&tabs=timeline&width=280&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=421460868535707"
            width="280"
            height="500"
            style="border: none; overflow: hidden"
            scrolling="no"
            frameborder="0"
            allowTransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  async asyncData({ $fireStore }) {
    const collection = $fireStore.collection('films')
    const queryList = [
      collection.orderBy('updatedAt', 'desc').limit(20).get(),
      collection.orderBy('numDoc', 'desc').limit(20).get(),
      collection.orderBy('views.view', 'desc').limit(20).get()
    ]
    const data = await Promise.all(queryList)
    return {
      listNewUpdate: data[0].docs.map(doc => doc.data()),
      listNew: data[1].docs.map(doc => doc.data()),
      listHot: data[2].docs.map(doc => doc.data())
    }
  },
  data() {
    return {
      // listNewUpdate: [],
      // listNew: [],
      // listHot: []
    }
  }
  // created() {
  //   const collection = this.$fireStore.collection('films')
  //   this.list(
  //     collection.orderBy('updatedAt', 'desc').limit(20),
  //     'listNewUpdate'
  //   )
  //   this.list(collection.orderBy('numDoc', 'desc').limit(20), 'listNew')
  //   this.list(collection.orderBy('views.view', 'desc').limit(20), 'listHot')
  // },
  // methods: {
  //   async list(query, data) {
  //     try {
  //       const snapshot = await query.get()
  //       this.$set(
  //         this,
  //         data,
  //         snapshot.docs.map(doc => doc.data())
  //       )
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.client-home ::v-deep {
  .title-list {
    margin-bottom: 1em;
    h2 {
      font-size: 20px;
      font-weight: 500;
      padding-left: 10px;
      border-left: solid 3px #408bea;
    }
    .show-all {
      float: right;
      font-weight: 500;
      background: #408bea;
      margin-right: 18px;
      a {
        font-size: 12px;
        font-weight: 500;
        padding: 0 1em;
        border-radius: 3px;
        color: #fff !important;
      }
    }
  }
  @media screen and (max-width: 425px) {
    .title-list .show-all a {
      padding: 0 0.5em;
    }
  }
}
</style>
