<template>
  <div class="player-main">
    <div v-if="linkPlay" class="player">
      <iframe :src="linkPlay" allowfullscreen frameborder="0" />
    </div>
    <el-row class="ep-play">
      <el-col v-for="(sv, idx) in servers" :key="idx" :span="24">
        <div v-if="onServer(sv).length">
          <div style="font-weight: 600;">{{ sv.domain }}</div>
          <el-row :gutter="4">
            <el-col
              v-for="(ep, lidx) in onServer(sv)"
              :key="lidx"
              :md="2"
              :sm="4"
              :xs="6"
            >
              <el-button
                style="width: 100%;margin-bottom: 5px; padding: 7px 6px;"
                :type="linkPlay !== ep.link ? 'info' : ''"
                size="mini"
                @click="linkPlay = ep.link"
              >
                {{ ep.name }}
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    episodes: {
      type: Array,
      default() {
        return []
      }
    },
    servers: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      linkPlay: null
    }
  },
  mounted() {
    if (this.servers.length) {
      const eps = this.onServer(this.servers[0])
      // console.log(eps)
      this.linkPlay = eps.length ? eps[0].link : null
    }
  },
  methods: {
    onServer(sv) {
      return this.episodes.filter(o => new RegExp(sv.domain, 'g').test(o.link))
    },
    onPlay(link) {
      this.iframe = `<iframe
        src="${link}"
        frameborder="0"
        scrolling="0"
        allowfullscreen
        style="width:100%;height:100%;"
      ></iframe>`
    }
  }
}
</script>

<style lang="scss" scoped>
.player-main {
  padding: 10px 0;
  .player {
    position: relative;
    padding-bottom: 45.25%;
    height: 0;
    overflow: hidden;
    iframe {
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .ep-play {
    padding-top: 10px;
  }
}
</style>
