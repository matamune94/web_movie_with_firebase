<template>
  <div :class="!isDark ? 'light' : 'dark'">
    <el-container>
      <el-header class="client-header" style="padding: 0">
        <ClientHeader />
      </el-header>
      <div class="container">
        <el-main class="client-body">
          <Nuxt />
        </el-main>
      </div>
      <div
        class="fb-customerchat"
        attribution="setup_tool"
        page_id="690217317843993"
        theme_color="#0084ff"
        logged_in_greeting="Bạn cần trợ giúp / yêu cầu link ?"
        logged_out_greeting="Bạn cần trợ giúp / yêu cầu link ?"
      ></div>
      <el-footer class="client-footer">
        <div class="container">
          <el-switch
            v-model="isDark"
            active-icon-class="el-icon-moon"
            inactive-icon-class="el-icon-sunny"
          >
          </el-switch>
        </div>
        <ClientFooter />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: false
    }
  },
  mounted() {
    this.$initFbSDK()
  }
}
</script>

<style lang="scss" scoped>
.client-header {
  margin-bottom: 0.5em;
}
.client-footer {
  margin-top: 0.5em;
  height: 100% !important;
}
</style>
