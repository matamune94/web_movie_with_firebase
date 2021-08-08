<template>
  <div>
    <el-container>
      <client-only>
        <AsideAdmin v-if="$store.state.user" />
      </client-only>
      <el-container>
        <el-header style="padding: 20px"></el-header>
        <el-main>
          <Nuxt />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.el-main {
  padding: 0 20px;
}
</style>
