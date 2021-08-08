<template>
  <div class="container">
    <el-row type="flex" justify="space-between" align="middle">
      <div id="logo">
        <n-link to="/">
          <img
            src="https://media.discordapp.net/attachments/490270580151418887/763965101425950750/logo.png?width=100&height=100"
            alt=""
            width="50"
            height="50"
          />
        </n-link>
        <div class="sub">
          <div class="s_1">Chia Sẻ Đam Mê</div>
          <div class="s_2">Thành Công Sẽ Đến</div>
        </div>
      </div>
      <SearchBar />
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.container ::v-deep {
  height: 100%;
  margin-bottom: 0.5em;
  .el-row {
    height: 100%;
  }
  #logo {
    display: flex;
    a {
      margin-right: 6px;
      color: #fff !important;
    }
    .sub {
      margin-top: 16px;
      font-weight: 500;
    }
  }
  @media screen and (max-width: 600px) {
    .el-row {
      padding: 0 10px;
    }
    .sub {
      display: none;
    }
  }
}
</style>
