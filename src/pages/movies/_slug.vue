<template>
  <div class="main-movie">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/movies' }">movies</el-breadcrumb-item>
      <el-breadcrumb-item>{{ film.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="infomation">
      <el-col :span="24">
        <iframe
          width="100%"
          height="429"
          class="rptss"
          :src="videoDemo"
          frameborder="0"
          allowfullscreen=""
          rel="nofollow"
        ></iframe>
        <el-row class="control">
          <el-col> {{ film.views ? film.views.view : 0 }} Lượt Xem </el-col>
        </el-row>
        <el-row style="padding: 2em" class="top-info">
          <el-col :span="4" class="poster">
            <el-image :src="film.poster" fit="cover"> </el-image>
          </el-col>
          <el-col :span="20" style="padding-left: 2em">
            <h2 class="title">{{ film.name }}</h2>
            <h2 class="raw-title">{{ film.rawName }}</h2>
            <div class="sub-info">
              <span class="release-date">{{
                releaseDate(film.release_date)
              }}</span>
              <span class="countries">
                <n-link
                  v-for="(country, cIdx) in film.countries"
                  :key="cIdx"
                  :to="`/country/${country.slug}`"
                >
                  {{ country.name }}
                </n-link>
              </span>
              <span class="duration">{{ film.duration }} Phút</span>
            </div>
            <div class="rates">
              IMDB:
              <el-rate :max="10" :value="film.imdb * 2" disabled></el-rate>
            </div>
            <div class="genres">
              <n-link v-for="(g, gIdx) in film.genres" :key="gIdx" :to="`/genres/${g.slug}`">
                {{ g.name }}
              </n-link>
            </div>
          </el-col>
        </el-row>
        <el-row class="bottom-info">
          <el-tabs type="border-card">
            <el-tab-pane label="Thông tin">
              <div>
                {{ film.description }}
              </div>
              <el-row>
                <el-col
                  v-for="(th, thIdx) in film.thumbnails"
                  :key="thIdx"
                  :span="6"
                >
                  <el-image :src="th.url"></el-image>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Diễn viên">
              <el-row>
                <el-col v-for="(c, cIdx) in film.casts" :key="cIdx" :span="6">
                  <el-row type="flex">
                    <el-col :span="6">
                      <el-avatar
                        shape="square"
                        :size="60"
                        fit="cover"
                        :src="c.image"
                      ></el-avatar>
                    </el-col>
                    <el-col>
                      <div>{{ c.name }}</div>
                      <div style="color: rgba(255, 255, 255, 0.4)">
                        {{ c.character }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
      <!-- <el-col :span="24">
        right box
      </el-col> -->
    </el-row>
    <div class="play-online">
      <PlayOnline :episodes="film.episodes" :servers="servers" />
    </div>
    <div class="box-links">
      <el-tabs type="border-card">
        <el-tab-pane
          v-for="(tab, idx) in tabLinks"
          :key="idx"
          :label="tab.label"
        >
          <client-only>
            <BoxLinks
              :items="tab.items"
              :more-data="{ movie_name: film.name, movie_id: film._id }"
            />
          </client-only>
        </el-tab-pane>
      </el-tabs>
      <div class="new-episodes">
        <client-only>
          <Episodes
            :more-data="{ episodes: newEpisodes }"
            @on-update="updateEpisodes"
          />
        </client-only>
      </div>
    </div>
    <div>
      <ListRelated :genres="film.genres" />
    </div>
    <client-only>
      <div
        class="fb-comments"
        :data-href="`https://zerophim.com/movies/${this.$route.params.slug}`"
        data-width="auto"
        data-order-by="reverse_time"
        data-numposts="5"
      />
    </client-only>
  </div>
</template>

<script>
import moment from 'moment'
import _uniq from 'lodash/uniq'
import qualityData from '@/assets/quality.json'

export default {
  async asyncData({ $fireStore, params, error }) {
    const collection = $fireStore.collection('films')
    const collectionSv = $fireStore.collection('sv_icons')
    try {
      const films = await collection.where('slug', '==', params.slug).get()
      const film = films.docs.map(doc => doc.data())[0]
      // console.log(film)
      if (!film) {
        // console.log('wwwww')
        return error({ statusCode: 404, message: 'Post not found' })
      }
      const servers = await collectionSv.where('embed', '==', true).get()
      // console.log(film)
      return {
        film,
        servers: servers.docs.map(doc => doc.data())
      }
    } catch (err) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  data() {
    return {
      newEpisodes: [
        {
          num: null,
          name: null,
          link: null,
          size: null,
          quality: null,
          typeSub: null
        }
      ],
      quality: qualityData,
      sub_types: ['Thuyết Minh', 'Phụ đề']
    }
  },
  computed: {
    tabLinks() {
      // if (!this.film) {
      //   return []
      // }
      // console.log(this.film)
      const tabs = _uniq([
        ...['Tất cả'],
        ...this.film.episodes.map(o => o.quality)
      ]).filter(o => o)
      return tabs.map(tab => {
        const items = tab === 'Tất cả'
        ? this.film.episodes
        : this.film.episodes.reduce((o, item) => {
            if (item.quality === tab) {
              o.push(item)
            }
            return o
          }, [])

        return {
          label: tab,
          items: items.filter(o => !this.servers.find(sv => new RegExp(sv.domain, 'g').test(o.link)))
        }
      })
    },
    videoDemo() {
      const video = this.film.video_demo
      const id = video
        ? video.replace(/.*watch\?v=(.*).*|.*youtu.be\/(.*)/g, '$1') ||
          video.replace(/.*youtu.be\/(.*)/g, '$1')
        : null
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  },
  mounted() {
    // this.$initFbSDK()
    this.updateView()
  },
  methods: {
    releaseDate(time) {
      return moment(time).format('DD-MM-YYYY')
    },
    async updateEpisodes(items) {
      const collection = this.$fireStore.collection('films')
      const item = this.film
      // item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
      item.episodes = [...item.episodes, ...items]
      // console.log(item.episodes)
      try {
        await collection.doc(item._id).update({
          episodes: item.episodes,
          updatedAt: this.$fireStoreObj.FieldValue.serverTimestamp()
        })
        this.newEpisodes = []
        this.$notify({
          title: 'Success',
          message: 'Links đã được thêm.',
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
    },
    async updateView() {
      const views = this.film.views || {}
      views.view = (views.view || 0) + 1
      views.day =
        views.dayNow === moment().utcOffset(7).date() ? (views.day || 0) + 1 : 0
      views.dayNow = moment().utcOffset(7).date()

      views.week =
        views.weekNow === moment().utcOffset(7).week()
          ? (views.week || 0) + 1
          : 0
      views.weekNow = moment().utcOffset(7).week()

      views.month =
        views.monthNow === moment().utcOffset(7).month()
          ? (views.month || 0) + 1
          : 0
      views.monthNow = moment().utcOffset(7).month()

      views.year =
        views.yearNow === moment().utcOffset(7).year()
          ? (views.year || 0) + 1
          : 0
      views.yearNow = moment().utcOffset(7).year()

      const collection = this.$fireStore.collection('films')
      try {
        await collection.doc(this.film._id).update({ views })
      } catch (err) {
        console.log(err)
      }
    }
  },
  head() {
    return {
      title: `Phim ${this.film.name} Vietsub - Thuyết minh Full HD`,
      meta: [
        {
          hid: 'title',
          name: 'title',
          content: `Phim ${this.film.name} Vietsub - Thuyết minh Full HD`
        },
        {
          hid: 'description',
          name: 'description',
          content: this.film.description
        },
        // {
        //   property: 'fb:app_id',
        //   content: process.env.fb_app_id
        // },
        {
          property: 'og:site_name',
          content: process.env.npm_package_nameWebsite
        },
        {
          property: 'og:url',
          content: this.$route.fullPath
        },
        {
          property: 'og:title',
          content: `Phim ${this.film.name} Vietsub - Thuyết minh Full HD`
        },
        {
          property: 'og:image',
          content: `${this.film.poster}`
        },
        {
          property: 'og:image:width',
          content: '210'
        },
        {
          property: 'og:image:height',
          content: '240'
        },
        {
          property: 'og:description',
          content: this.film.description
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.main-movie ::v-deep {
  font-size: 13px;
  line-height: 20px;
  .infomation {
    margin-top: 10px;
    .control {
      padding: 1.5em 0;
    }
    .top-info {
      .title,
      .raw-title,
      .sub-info,
      .rates,
      .genres {
        margin-bottom: 0.5em;
      }
      .raw-title {
        font-size: 14px;
        color: silver;
      }
      .poster {
        width: 186px;
        height: 286px;
      }
      .rates {
        display: flex;
        .el-rate {
          margin-left: 0.5em;
        }
      }
      .sub-info {
        span {
          padding-right: 15px;
        }
        .countries {
          // a {
          //   color: #fff !important;
          // }
          a:after {
            content: '-';
          }
          a:last-child:after {
            content: '';
          }
        }
        .release-date {
          font-weight: 500;
          // color: rgba(255, 255, 255, 0.28);
          opacity: 0.8;
        }
      }
      .genres {
        a:first-child {
          padding-left: 0;
          border-left: 0;
        }
        a {
          // color: #fff !important;
          border-left: solid 1px rgba(255, 255, 255, 0.08);
          font-size: 13px;
          float: left;
          padding: 0 10px;
          font-weight: 500;
        }
      }
    }
    .bottom-info {
      margin-top: 1em;
      .el-tabs--border-card {
        background: none;
        border: none;
        box-shadow: none;
      }
      .el-tabs--border-card > .el-tabs__header {
        background-color: unset;
        border-bottom: unset;
      }
      .el-tabs--border-card > .el-tabs__header .el-tabs__item {
        border-right-color: unset;
        border-left-color: unset;
        border: unset;
        border-radius: 8px;
        height: 30px;
        line-height: 34px;
      }
    }
    border-bottom: solid 3px rgba(255, 255, 255, 0.08);
    margin-bottom: 10px;
  }
  .box-links {
    .el-tabs--border-card {
      background: unset;
    }
    .new-episodes {
      margin: 1em 0;
      .el-input__inner {
        background-color: unset;
      }
    }
  }
}
</style>
