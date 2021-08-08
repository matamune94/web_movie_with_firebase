<template>
  <div>
    <el-row type="flex" style="margin-bottom: 1em">
      <el-col style="text-align: end">
        <el-button
          size="medium"
          type="primary"
          @click="$router.push('/admin/films/add')"
        >
          Tạo phim
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableList"
      style="width: 100%"
    >
      <el-table-column label="Poster">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.poster"
            style="width: 80px; height: 120px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Code" prop="code"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Slug" prop="slug"></el-table-column>
      <el-table-column label="Tổng số tập">
        <template slot-scope="scope">{{
          scope.row.episodes && scope.row.episodes.length
        }}</template>
      </el-table-column>
      <el-table-column label="published" prop="published">
        <template slot-scope="scope">
          <el-row type="flex">
            <el-button
              size="mini"
              :type="scope.row.published ? 'primary' : null"
            >
              Published
            </el-button>
            <el-button
              size="mini"
              :type="!scope.row.published ? 'primary' : null"
            >
              Unpublished
            </el-button>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <div>
            {{ scope.row ? '' : '' }}
            <el-input
              v-model="search"
              size="mini"
              placeholder="Type to search"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <n-link
            :to="`/admin/films/edit/${scope.row._id}`"
            class="el-button el-button--mini"
          >
            Edit
          </n-link>
          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button> -->
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
import _debounce from 'lodash/debounce'
export default {
  data() {
    return {
      tableList: [],
      search: '',
      pagination: {
        perPage: 10,
        page: 1,
        total: 0
      }
    }
  },
  watch: {
    search: _debounce(function (keyword) {
      if (keyword) {
        this.list(
        this.$fireStore
          .collection('films')
          .where('match', 'array-contains', keyword.toLowerCase())
          .limit(10)
      )
      } else {
        this.nextPage()
      }
    }, 400)
  },
  created() {
    this.list(
      this.$fireStore
        .collection('films')
        .orderBy('numDoc', 'desc')
        .endAt(0)
        .limit(this.pagination.perPage),
      true
    )
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
          .collection('films')
          .orderBy('numDoc', 'desc')
          .startAt(p.total - (p.page - 1) * p.perPage)
          .limit(p.perPage)
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
    async handleDelete(index, row) {
      try {
        const { data } = await this.$axios.delete(`/book?id=${row._id}`)
        this.$notify({
          title: 'Success',
          message: data,
          type: 'success'
        })
        this.list()
      } catch (err) {
        this.$notify({
          title: 'Error',
          message: err.response.data,
          type: 'error'
        })
      }
    }
  }
}
</script>
