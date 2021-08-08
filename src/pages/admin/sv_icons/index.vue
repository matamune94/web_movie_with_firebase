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
          ? `Sửa ${mainPageName} ${profile.raw.domain}`
          : `Tạo mới ${mainPageName}`
      "
      :visible.sync="profile.dialog"
      width="30%"
    >
      <el-form
        ref="form"
        :model="profile.form"
        class="form-main"
        label-width="70px"
      >
        <el-form-item label="Domain">
          <el-input
            v-model="profile.form.domain"
            placeholder="fshare.com, 4share.com....."
          ></el-input>
        </el-form-item>
        <el-form-item label="Embed">
          <div>
            <el-checkbox v-model="profile.form.embed"></el-checkbox>
          </div>
          <span style="font-size: 12px; color: #ff3200">
            * Nếu tích server này sẽ được gán iframe để play online
          </span>
        </el-form-item>
        <el-form-item label="Icon">
          <el-upload
            :action="$_imgUploader()"
            class="f-poster"
            :drag="true"
            :show-file-list="false"
            :on-success="onImgSuccess"
            :on-progress="onImgProcess"
            :before-upload="onImgBeforeUpload"
          >
            <el-tooltip content="Ảnh nên là hình vuông 100x100" placement="top">
              <el-progress
                v-if="icon.status === 'uploading'"
                type="circle"
                :percentage="icon.percentage"
              ></el-progress>
              <img
                v-if="icon.status === 'success'"
                :src="profile.form.icon"
                class="avatar"
              />
              <i
                v-if="!icon.status"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-tooltip>
          </el-upload>
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
      <el-table-column label="Domain" prop="domain"></el-table-column>
      <el-table-column label="Icon">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.icon"
            style="width: 80px; height: 80px"
          ></el-image>
        </template>
      </el-table-column>
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
      mainPageName: 'sv icon',
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
      },
      icon: {
        status: null,
        percentage: 0
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
          .collection('sv_icons')
          .orderBy('numDoc', 'desc')
          .startAt(p.total - (p.page - 1) * p.perPage)
          .limit(p.perPage)
      )
    },
    reloadList() {
      this.list(
        this.$fireStore
          .collection('sv_icons')
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
      if (row.icon) {
        this.icon.status = 'success'
      }
    },
    async handleDelete(index, row) {
      const collection = this.$fireStore.collection('sv_icons')
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
      const collection = this.$fireStore.collection('sv_icons')
      const item = this.profile.form
      if (!item.domain || !item.domain.trim()) {
        this.$notify({
          title: 'Error',
          message: 'Yêu cầu nhập name domain',
          type: 'error'
        })
        return
      }
      if (!this.profile.edit) {
        // add
        const snapshot = await collection
          .where('domain', '==', item.domain)
          .get()
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
        // edit
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
    },
    onImgSuccess(res, file, fileList) {
      this.icon.status = file.status
      this.profile.form.icon = res.proxy_url
    },
    onImgBeforeUpload(file) {
      // const { height, width } = await this.imageInfo(URL.createObjectURL(file))
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      // const ishcn = width < height + 200
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('Image must be JPG or PNG format!')
      }
      if (!isLt2M) {
        this.$message.error('Image size can not exceed 2MB!')
      }
      // if (!ishcn) {
      //   this.$message.error('Ảnh phải là hình chữ nhật')
      // }
      // if (isImg && isLt2M && ishcn) {
      //   this.thumb.status = 'uploading'
      // }
      return isImg && isLt2M
    },
    onImgProcess(e, file) {
      this.icon.status = file.status
      this.icon.percentage = Number(file.percentage.toFixed(1))
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page ::v-deep {
  .el-dialog__body {
    padding: 0px 20px;
  }
  .form-main {
    .f-domain {
      .el-form-item__content {
        display: flex;
      }
    }
    .f-poster {
      .el-upload {
        // border: 1px dashed #d9d9d9;
        border-radius: 6px;
      }
      .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .avatar {
        width: 100px;
        height: 100px;
        display: block;
      }
      .el-upload-dragger {
        width: unset;
        height: unset;
      }
    }
  }
}
</style>
