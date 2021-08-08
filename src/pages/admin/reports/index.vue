<template>
  <div class="main-page">
    <!-- <el-row type="flex" style="margin-bottom: 1em">
      <el-col style="text-align: end">
        <el-button size="medium" type="primary" @click="handleAdd">
          Tạo {{ mainPageName }}
        </el-button>
      </el-col>
    </el-row> -->

    <el-dialog
      :title="`Cập nhật link phim ${profile.raw.movie_name}`"
      :visible.sync="profile.dialog"
      width="30%"
    >
      <el-form ref="form" :model="profile.form">
        <el-form-item label="Link">
          <el-input v-model="profile.form.link"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="profile.dialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Confirm</el-button>
      </span>
    </el-dialog>

    <el-table
      :data="
        tableList.filter(
          data =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column prop="num" label="Tập" width="100"></el-table-column>
      <el-table-column prop="name" label="Tên">
        <template slot-scope="scope">
          <a
            :href="scope.row.link"
            target="_blank"
            rel="noopener noreferrer"
            style="
              color: #8e96a5;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
          >
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="sub_type" label="Loại" width="100">
      </el-table-column>
      <el-table-column prop="quality" label="Chất lượng" width="120">
      </el-table-column>
      <el-table-column prop="size" label="Size" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.size }} GB</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="report_content"
        label="Nội dung"
        width="200"
      ></el-table-column>
      <el-table-column align="right" width="250">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row)"
          >
            Cập nhật link mới
          </el-button>
          <el-popconfirm
            title="Are you sure to delete this?"
            confirm-button-text="Yes"
            cancel-button-text="No"
            @onConfirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button slot="reference" type="danger" size="mini">
              Delete
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.perPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep'
import utils from '@/plugins/utils'

export default {
  mixins: [utils],
  data() {
    return {
      mainPageName: 'Report',
      search: '',
      tableList: [],
      profile: {
        edit: false,
        dialog: false,
        raw: {},
        form: {}
      },
      pagination: {
        perPage: 10,
        page: 1,
        total: 0
      }
    }
  },
  created() {
    this.reloadList()
  },
  methods: {
    pageChange(page) {
      this.pagination.page = page
      this.nextPage()
    },
    nextPage() {
      const p = this.pagination
      this.list(
        this.$fireStore
          .collection('reports')
          .orderBy('numDoc', 'desc')
          .startAt(p.total - (p.page - 1) * p.perPage)
          .limit(p.perPage)
      )
    },
    reloadList() {
      this.list(
        this.$fireStore
          .collection('reports')
          .orderBy('numDoc', 'desc')
          .endAt(0)
          .limit(this.pagination.perPage),
        true
      )
    },
    async list(query, firstLoad) {
      try {
        const snapshot = await query.get()
        this.docs = snapshot.docs.map(doc => doc.data())
        const data = this.docs
        this.tableList = data
        if (firstLoad) {
          this.pagination.total = data[0].numDoc
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleAdd() {
      this.profile.edit = false
      this.profile.dialog = true
      this.profile.raw = {}
      this.profile.form = {}
    },
    handleEdit(index, row) {
      this.profile.edit = true
      this.profile.dialog = true
      this.profile.raw = row
      this.profile.form = _cloneDeep(row)
    },
    async handleDelete(index, row) {
      const collection = this.$fireStore.collection('reports')
      try {
        await collection.doc(row._id).delete()
        this.$notify({
          title: 'Success',
          message: `Delete ${this.mainPageName} success`,
          type: 'success'
        })
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: 'Something wrong',
          type: 'error'
        })
      }
      this.reloadList()
    },
    async handleSubmit() {
      const collection = this.$fireStore.collection('reports')
      const item = this.profile.form
      try {
        await this.updateEpisodes(item.movie_id, item.link)
        await collection.doc(item._id).delete()
        this.$notify({
          title: 'Success',
          message: 'Link đã được cập nhật',
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
      this.profile.dialog = false
      this.reloadList()
    },
    async updateEpisodes(id, link) {
      const collection = this.$fireStore.collection('films')
      try {
        const episodes = await this.getEpisodes(id)
        episodes.forEach(ep => {
          if (ep.link === this.profile.raw.link) {
            ep.link = link
          }
        })
        await collection.doc(id).update({ episodes })
      } catch (err) {
        console.log(err)
      }
    },
    async getEpisodes(id) {
      const collection = this.$fireStore.collection('films')
      try {
        const doc = await collection.doc(id).get()
        return doc.data().episodes
      } catch (err) {
        console.log(err)
        // throw err
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page ::v-deep {
  .el-dialog__body {
    padding: 0px 20px;
  }
}
</style>
