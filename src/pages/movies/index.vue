<template>
  <div>
    <ListCard :items="items" />
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
export default {
  data() {
    return {
      items: [],
      pagination: {
        perPage: 30,
        page: 1,
        total: 0
      }
    }
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
        this.items = data
        if (firstLoad) {
          this.pagination.total = data[0].numDoc
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
