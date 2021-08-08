<template>
  <el-row class="items">
    <el-col v-for="(item, idx) in items" :key="idx" class="item custom-col-5">
      <el-card>
        <div class="poster">
          <n-link :to="`/movies/${item.slug}`">
            <img :src="item.poster" style="height: 286px" class="skeleton">
          </n-link>
          <div v-if="item.quality && item.quality.length" class="quality">
            <span v-for="(q, qIdx) in item.quality" :key="qIdx">{{ q }}</span>
          </div>
          <div v-if="item.sub_types && item.sub_types.length" class="sub-types">
            <span v-for="(s, sIdx) in item.sub_types" :key="sIdx">{{ s }}</span>
          </div>
        </div>
        <div class="title">{{ item.name }}</div>
        <div class="time">{{ releaseDate(item.release_date) }}</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    releaseDate(time) {
      return new Date(time).getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.items ::v-deep {
  width: 100%;
  // float: left;
  // margin-bottom: 25px;
  // border-bottom: solid 1px;
  // .item:last-child {
  //   .el-card {
  //     // padding-right: 0;
  //   }
  // }
  // display: table;
  .item {
    // width: calc(100% / 5);
    // float: left;
    // margin: 0;
    position: relative;
    .el-card {
      border: unset;
      background: none;
      position: relative;
      display: inline-block;
      // padding: 8px;
      padding-right: 16px;
      // padding-left: 0;
      box-shadow: unset;
      width: 100%;
      border-radius: 0px!important;
      .poster {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        // height: 286px;
        img {
          width: 100%;
          // height: 286px;
        }
        .quality {
          position: absolute;
          top: 8px;
          background: #ff4141;
          left: 4px;
          padding: 2px 5px;
          font-weight: 500;
          color: white;
          font-size: 12.5px;
          span::after {
            content: ' - ';
          }
          span:last-child::after {
            content: unset;
          }
        }
        .sub-types {
          position: absolute;
          bottom: 0px;
          background: #41c2ff;
          padding: 2px 5px;
          font-weight: 500;
          color: white;
          font-size: 12.5px;
          left: 0;
          right: 0;
          text-align: center;
          span::after {
            content: ' - ';
          }
          span:last-child::after {
            content: unset;
          }
        }
      }
      .el-card__body {
        padding: 0;
        margin-bottom: 20px;
        padding-right: 16px;
      }
      .title {
        font-weight: 500;
        // color: white;
        font-size: 14px;
        padding: 5px 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .time {
        // color: rgba(255, 255, 255, 0.5);
        opacity: .6;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
  @media screen and (max-width: 425px) {
    .item .el-card .poster img {
      height: 220px !important;
    }
  }
  @media screen and (max-width: 320px) {
    .item .el-card .poster img {
      height: 180px !important;
    }
  }
}
</style>
