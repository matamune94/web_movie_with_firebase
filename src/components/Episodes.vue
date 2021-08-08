<template>
  <div v-if="isRule">
    <div style="font-weight: 600; font-size: 1.4em; margin-bottom: 0.5em">
      <span>Thêm link mới:</span>
    </div>
    <div class="main-items">
      <el-row v-for="(ep, idx) in items" :key="idx" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="ep.link" placeholder="Link"></el-input>
        </el-col>
        <el-col :span="7">
          <el-input v-model="ep.name" placeholder="Tên"></el-input>
        </el-col>
        <el-col :span="2">
          <el-input v-model="ep.num" placeholder="Số tập"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="ep.sub_type"
            filterable
            allow-create
            default-first-option
            placeholder="Loại Sub"
            style="display: block"
          >
            <el-option
              v-for="s in sub_types"
              :key="s"
              :label="s"
              :value="s"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="ep.quality"
            filterable
            allow-create
            default-first-option
            placeholder="Chất lượng"
            style="display: block"
          >
            <el-option
              v-for="q in quality"
              :key="q"
              :label="q"
              :value="q"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-input v-model="ep.size" placeholder="Kích thước"></el-input>
        </el-col>
        <el-col :span="1">
          <div>
            <el-popconfirm
              class="adwadwadwad"
              title="Are you sure to delete this?"
              confirm-button-text="Yes"
              cancel-button-text="No"
              @onConfirm="handleDelete(idx)"
            >
              <el-button
                slot="reference"
                type="danger"
                style="width: 100%; padding: 12px 16px"
              >
                Xóa
              </el-button>
            </el-popconfirm>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" class="controls">
        <div>
          <el-button type="info" size="small" @click="create">
            Thêm link
          </el-button>
          <el-input-number v-model="numLink" :min="1" :max="100" size="small"></el-input-number>
        </div>
        <el-button type="primary" size="small" @click="$emit('on-update', items)">
          Đăng
        </el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import qualityData from '@/assets/quality.json'

export default {
  props: {
    moreData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      numLink: 1,
      items: [],
      quality: qualityData,
      sub_types: ['Thuyết Minh', 'Phụ đề']
    }
  },
  computed: {
    isRule() {
      return (
        this.$store.state.user && /films\/edit|movies/.test(this.$route.path)
      )
    }
  },
  watch: {
    'moreData.episodes' (v) {
      this.items = v
    }
  },
  mounted() {
    this.items = this.moreData.episodes
  },
  methods: {
    create() {
      const items = []
      for (let i = 0; i < this.numLink; i++) {
        items.push({
        num: null,
        quality: null,
        link: null
      })
      }
      this.items = [...this.items, ...items]
    },
    handleDelete(idx) {
      this.items.splice(idx, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-items ::v-deep {
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
</style>
