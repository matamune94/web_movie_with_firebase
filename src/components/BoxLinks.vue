<template>
  <div class="table-links">
    <el-dialog
      title="Report link phim"
      :visible.sync="report.dialog"
      width="30%"
      class="report-main"
    >
      <div v-if="report.item">
        <p><span>Tập:</span> {{ report.item.num }}</p>
        <p><span>Tên:</span> {{ report.item.name }}</p>
        <p><span>Loại sub:</span> {{ report.item.sub_type }}</p>
        <p><span>Chất lượng:</span> {{ report.item.quality }}</p>
        <p><span>Size:</span> {{ report.item.size }}</p>
        <div class="report-content">
          <span>Thông tin thêm:</span>
          <el-input
            v-model="report.item.report_content"
            type="textarea"
            :rows="3"
            placeholder="Please input"
          >
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="report.dialog = false">Bỏ qua</el-button>
        <el-button type="primary" @click="submitReport">Gửi</el-button>
      </span>
    </el-dialog>
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="num" label="Tập" width="100"></el-table-column>
      <el-table-column prop="name" label="Tên">
        <template slot-scope="scope">
          <a
            style="
              color: #8e96a5;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
            @click="onDownload(scope.row.link)"
          >
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="sub_type" label="Loại" width="100">
      </el-table-column>
      <el-table-column prop="link" label="Link" width="140">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="download-button"
            @click="onDownload(scope.row.link)"
          >
            <div style="display: flex; align-items: center">
              <img
                :src="svIcon(scope.row.link)"
                width="12"
                height="12"
                style="padding-right: 5px"
              />
              Download
            </div>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="quality" label="Chất lượng" width="120">
      </el-table-column>
      <el-table-column prop="size" label="Size" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.size }} GB</span>
        </template>
      </el-table-column>
      <el-table-column width="50">
        <template slot-scope="scope">
          <!-- <i @click="report(scope.row)" class="el-icon-edit"></i> -->
          <el-button type="text" size="medium" @click="handleReport(scope.row)">
            <i
              class="el-icon-warning"
              style="color: #ff3e3e; font-size: 1.2em"
            ></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    },
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      report: {
        dialog: false,
        item: null
      },
      sv_icons: []
    }
  },
  async created() {
    const snap = await this.$fireStore.collection('sv_icons').get()
    this.sv_icons = snap.docs.map(doc => doc.data())
  },
  methods: {
    onDownload(link) {
      if (!link) {
        return
      }
      window.open(`https://link1s.com/st?api=753d999529015c902dc49b714a95e13f2cf7a38d&url=${link}`, '_blank')
      // try {
      //   const { data } = await this.$axios.get(
      //     `https://nerdy.vn/api?api=5981adca2289bf4fca1a281d404e65e317b96f83&url=${link}`
      //   )
      //   window.open(data.shortenedUrl, '_blank')
      // } catch (err) {
      //   console.log(err)
      // }
    },
    handleReport(item) {
      this.report.dialog = true
      this.report.item = item
    },
    async submitReport() {
      const collection = this.$fireStore.collection('reports')
      const item = JSON.parse(JSON.stringify(this.report.item))
      const snapshot = await collection.where('link', '==', item.link).get()
      if (snapshot.docs.map(doc => doc.data()).length) {
        this.$notify({
          title: 'Error',
          message: 'Bạn đã report link này.',
          type: 'error'
        })
        return
      }
      item._id = this.$_ObjectId()
      item.movie_name = this.moreData.movie_name
      item.movie_id = this.moreData.movie_id
      item.numDoc = (await this.$_lastNumDoc(collection)) + 1
      try {
        await collection.doc(item._id).set(item)
        this.$notify({
          title: 'Success',
          message:
            'Cảm ơn bạn đã report cho chúng tôi, link sẽ được fix sớm nhất có thể.',
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
      this.report.dialog = false
    },
    svIcon(link) {
      const item = this.sv_icons.find(o => new RegExp(o.domain, 'g').test(link))
      // console.log(item)
      return item ? item.icon : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.table-links ::v-deep {
  .report-main {
    .el-dialog__body {
      padding: 0 1.5em;
    }
    p {
      span {
        font-weight: 600;
      }
    }
    .report-content {
      span {
        font-weight: 600;
      }
    }
  }
  .el-table {
    border: unset;
    .download-button {
      background: #525252;
      border: 1px solid #797979;
      color: #e6e6e6;
    }
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: unset;
  }
  .el-table th,
  .el-table tr {
    background-color: unset;
  }
}
</style>
