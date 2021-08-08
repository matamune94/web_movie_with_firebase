<template>
  <div class="main-page">
    <el-row type="flex" style="margin-bottom: 1em">
      <el-col style="text-align: end">
        <el-button size="medium" type="primary" @click="handleAdd">
          Tạo {{ mainPageName }}
        </el-button>
      </el-col>
    </el-row>

    <el-dialog
      :title="
        profile.edit
          ? `Sửa ${mainPageName} ${profile.raw.name}`
          : `Tạo mới ${mainPageName}`
      "
      :visible.sync="profile.dialog"
      width="20%"
    >
      <el-form ref="form" :model="profile.form">
        <el-form-item label="Name">
          <el-input v-model="profile.form.name"></el-input>
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
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="slug" prop="slug"></el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            Edit
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
      mainPageName: 'quốc gia',
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
          .collection('countries')
          .orderBy('numDoc', 'desc')
          .startAt(p.total - (p.page - 1) * p.perPage)
          .limit(p.perPage)
      )
    },
    reloadList() {
      this.list(
        this.$fireStore
          .collection('countries')
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
      const collection = this.$fireStore.collection('countries')
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
      const collection = this.$fireStore.collection('countries')
      const item = this.profile.form
      item.slug = this.$_slugify(item.name)
      if (!this.profile.edit) {
        const snapshot = await collection.where('slug', '==', item.slug).get()
        if (snapshot.docs.map(doc => doc.data()).length) {
          this.$notify({
            title: 'Error',
            message: `${this.mainPageName} đã có sẵn`,
            type: 'error'
          })
          return
        }
        item._id = this.$_ObjectId()
        item.createdAt = this.$fireStoreObj.FieldValue.serverTimestamp()
        item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
        item.numDoc = (await this.$_lastNumDoc(collection)) + 1
        try {
          await collection.doc(item._id).set(item)
          this.$notify({
            title: 'Success',
            message: `${this.mainPageName} đã được tạo`,
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
      }

      if (this.profile.edit) {
        item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
        try {
          await collection.doc(item._id).update(item)
          this.$notify({
            title: 'Success',
            message: `${this.mainPageName} đã được cập nhật`,
            type: 'success'
          })
        } catch (err) {
          this.$notify({
            title: 'Error',
            message: 'Something wrong',
            type: 'error'
          })
        }
      }
      this.profile.dialog = false
      this.reloadList()
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
