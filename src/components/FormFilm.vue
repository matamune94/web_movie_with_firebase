<template>
  <div>
    <el-form ref="form" class="form-main" :model="formdata" label-width="120px">
      <el-form-item label="Name" class="f-name">
        <el-input v-model="formdata.name"></el-input>
        <SearchImdb :more-data="formdata" />
      </el-form-item>
      <el-form-item label="Tên Gốc">
        <el-input v-model="formdata.rawName"></el-input>
      </el-form-item>
      <el-form-item label="Rate IMDB">
        <div style="margin-top: 10px">
          <el-rate v-model="formdata.imdb"></el-rate>
        </div>
      </el-form-item>
      <el-form-item label="Mã phim">
        <el-input v-model="formdata.code"></el-input>
      </el-form-item>
      <el-form-item label="Video demo">
        <el-input v-model="formdata.video_demo"></el-input>
      </el-form-item>
      <el-form-item label="Publish">
        <el-button
          :type="formdata.published ? 'primary' : ''"
          @click="formdata.published = true"
        >
          Published
        </el-button>
        <el-button
          :type="!formdata.published ? 'primary' : ''"
          @click="formdata.published = false"
        >
          Unpublished
        </el-button>
      </el-form-item>
      <el-form-item label="Poster">
        <el-upload
          :action="$_imgUploader()"
          class="f-poster"
          :drag="true"
          :show-file-list="false"
          :on-success="onPosterSuccess"
          :on-progress="onPosterProcess"
          :before-upload="onPosterBeforeUpload"
        >
          <el-tooltip content="Ảnh nên là hình chữ nhật dọc" placement="top">
            <el-progress
              v-if="poster.status === 'uploading'"
              type="circle"
              :percentage="poster.percentage"
            ></el-progress>
            <img
              v-if="poster.status === 'success'"
              :src="formdata.poster"
              class="avatar"
            />
            <i
              v-if="!poster.status"
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item label="Thumbnails">
        <el-upload
          :action="$_imgUploader()"
          list-type="picture-card"
          class="picture-card-customs"
          :multiple="true"
          :drag="true"
          :on-success="onThumbSuccess"
          :file-list="formdata.thumbnails"
          :before-upload="onImageBeforeUpload"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div
            slot="file"
            slot-scope="{ file }"
            :v-bind="onThumb(file)"
            :style="{ height: file.height || 0, width: file.width || 0 }"
          >
            <el-progress
              v-if="file.status === 'uploading'"
              type="circle"
              :percentage="Number(file.percentage.toFixed(1))"
            ></el-progress>
            <img
              v-if="file.status === 'success'"
              class="el-upload-list__item-thumbnail"
              :src="file.url"
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-delete"
                @click="removeThumbnail(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Ngày ra mắt">
        <el-date-picker
          v-model="formdata.release_date"
          type="date"
          placeholder="Pick a day"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Thời lượng phim">
        <el-input v-model="formdata.duration"></el-input>
      </el-form-item>
      <el-form-item label="Loại Sub">
        <el-select
          v-model="formdata.sub_types"
          multiple
          filterable
          placeholder="Select"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in sub_types"
            :key="idx"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Danh mục">
        <el-select
          v-model="formdata.categories"
          multiple
          filterable
          default-first-option
          placeholder="Select"
          value-key="_id"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in categories"
            :key="idx"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Chất lượng">
        <el-select
          v-model="formdata.quality"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Select"
          value-key="id"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in quality"
            :key="idx"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Quốc gia">
        <el-select
          v-model="formdata.countries"
          multiple
          filterable
          default-first-option
          placeholder="Select"
          value-key="slug"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in countriesList"
            :key="idx"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Thể loại">
        <el-select
          v-model="formdata.genres"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Select"
          value-key="slug"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in formdata.genres"
            :key="idx"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Diễn viên">
        <el-select
          v-model="formdata.casts"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="Select"
          value-key="slug"
          style="display: block"
        >
          <el-option
            v-for="(item, idx) in formdata.casts"
            :key="idx"
            :label="item.name"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Nội dung phim">
        <el-input v-model="formdata.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div class="box-links">
      <client-only>
        <Episodes :more-data="formdata" @on-update="updateEpisodes" />
      </client-only>
    </div>
  </div>
</template>

<script>
import utils from '@/plugins/utils'
import qualityData from '@/assets/quality.json'

export default {
  mixins: [utils],
  props: {
    formdata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      poster: {
        status: null,
        percentage: 0
      },
      thumbnailList: [],
      categories: [],
      genres: [],
      casts: [],
      sub_types: ['Thuyết Minh', 'Phụ đề'],
      quality: qualityData
    }
  },
  computed: {
    countriesList() {
      return this.$store.state.countries
    }
  },
  watch: {
    'formdata.poster'(v) {
      if (v) {
        this.poster.status = 'success'
      }
    }
  },
  created() {
    this.getlistCategories()
  },
  mounted() {
    this.poster.status = this.formdata.poster ? 'success' : null
  },
  methods: {
    async getlistCategories() {
      const snapshot = await this.$fireStore.collection('categories').get()
      const data = snapshot.docs.map(doc => doc.data())
      this.categories = data
    },
    // async getlistGenres() {
    //   const snapshot = await this.$fireStore.collection('genres').get()
    //   const data = snapshot.docs.map(doc => doc.data())
    //   this.genres = data
    // },
    // async getlistCasts() {
    //   const snapshot = await this.$fireStore.collection('Casts').get()
    //   const data = snapshot.docs.map(doc => doc.data())
    //   this.casts = data
    // },
    async updateEpisodes(items) {
      const collection = this.$fireStore.collection('films')
      // const item = this.formdata
      // console.log(items)
      // item.updatedAt = this.$fireStoreObj.FieldValue.serverTimestamp()
      try {
        await collection.doc(this.formdata._id).update({
          episodes: items,
          updatedAt: this.$fireStoreObj.FieldValue.serverTimestamp()
        })
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
    onPosterSuccess(res, file, fileList) {
      this.poster.status = file.status
      this.formdata.poster = res.proxy_url
    },
    onPosterBeforeUpload(file) {
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
    onPosterProcess(e, file) {
      this.poster.status = file.status
      this.poster.percentage = Number(file.percentage.toFixed(1))
    },
    async onThumb(file) {
      const { height, width } = await this.imageInfo(file.url)
      this.$set(file, 'height', '148px')
      this.$set(file, 'width', `${148 / (height / width)}px`)
    },
    onThumbSuccess(res, file, fileList) {
      this.formdata.thumbnails.push({ url: res.proxy_url })
    },
    onImageBeforeUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('Image must be JPG or PNG format!')
      }
      if (!isLt2M) {
        this.$message.error('Image size can not exceed 2MB!')
      }
      return isImg && isLt2M
    },
    removeThumbnail(file) {
      const idx = this.formdata.thumbnails.findIndex(o => o.url === file.url)
      this.formdata.thumbnails.splice(idx, 1)
    },
    imageInfo(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function () {
          const { naturalWidth: width, naturalHeight: height } = img
          resolve({ width, height })
        }
        img.onerror = function () {
          reject(new Error('There was some problem with the image.'))
        }
        img.src = url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-main ::v-deep {
  .f-name {
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
      width: 182px;
      height: 268px;
      line-height: 268px;
      text-align: center;
    }
    .avatar {
      width: 182px;
      height: 268px;
      display: block;
    }
    .el-upload-dragger {
      width: unset;
      height: unset;
    }
  }
  .box-links {
    .el-col {
      padding-right: 1em;
    }
    .el-col:last-child {
      padding-right: 0;
    }
    .controls {
      margin: 1em 0;
    }
  }
}
</style>
