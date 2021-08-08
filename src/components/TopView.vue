<template>
  <div class="top-view">
    <h3 style="margin-bottom: 5px">Bảng xếp hạng</h3>
    <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-click="handleTab(activeTab)"
    >
      <el-tab-pane
        v-for="(tab, idx) in tabs"
        :key="idx"
        :label="tab.label"
        lazy
      >
        <n-link
          v-for="(item, iIdx) in tab.items"
          :key="iIdx"
          :to="`/movies/${item.slug}`"
        >
          <el-row type="flex" class="item-card">
            <el-col :span="6">
              <el-image
                style="width: 50px; height: 75px; display: block"
                :src="item.poster"
                fit="cover"
              ></el-image>
            </el-col>
            <el-col class="infomation">
              <div>
                <h3 class="title">{{ item.name }}</h3>

                <div class="release-date">
                  {{ releaseDate(item.release_date) }}
                </div>
              </div>
              <div class="sub-info">
                <span>
                  <i class="el-icon-star-off"></i>
                  {{ item.imdb }}
                </span>
                <span>
                  <i class="far fa-eye"></i>
                  {{ item.views[tabs[activeTab].value] }}
                </span>
              </div>
            </el-col>
          </el-row>
        </n-link>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { label: 'Ngày', items: [], value: 'day' },
        { label: 'Tuần', items: [], value: 'week' },
        { label: 'Tháng', items: [], value: 'month' },
        { label: 'Năm', items: [], value: 'year' }
      ],
      activeTab: '0'
    }
  },
  created() {
    this.handleTab(this.activeTab)
  },
  methods: {
    async handleTab(tab) {
      const t = this.tabs[tab]
      if (t.items.length) {
        return
      }
      try {
        const snap = await this.$fireStore
          .collection('films')
          .orderBy(`views.${t.value}`, 'desc')
          .limit(10)
          .get()
        t.items = snap.docs.map(doc => doc.data())
      } catch (err) {
        console.log(err)
      }
    },
    releaseDate(time) {
      return new Date(time).getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.top-view ::v-deep {
  a {
    // color: #fff;
  }
  .title {
    font-size: 12px;
    // color: gainsboro;
  }
  .item-card {
    // background: rgba(0, 0, 0, 0.3);
    // opacity: 0.3;
    margin-bottom: 1em;
    .infomation {
      display: flex;
      flex-flow: column wrap;
      justify-content: space-between;
      padding: 2px 0px 6px 0px;
      div {
        flex-direction: column;
      }
      .release-date {
        font-size: 11px;
        // color: rgba(255, 255, 255, 0.5);
      }
      .sub-info {
        font-size: 12px;
        span {
          margin-right: 1em;
          i {
            margin-right: 1px;
          }
        }
      }
    }
  }

  .item-card:hover {
    cursor: pointer;
  }
  .el-tabs__header {
    // background-color: #515151;
  }
  .el-tabs--border-card {
    background: unset;
    border: unset;
    box-shadow: unset;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    // background-color: #262626;
    border-right-color: unset;
    border-left-color: unset;
  }
  .el-tabs--border-card > .el-tabs__header {
    border-bottom: unset;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    border: unset;
    // color: #ffffff;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 15px 0;
  }
}
</style>
