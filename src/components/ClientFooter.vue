<template>
  <div class="container">
    <el-row>
      <el-col :md="12" :sm="24" class="box-left">
        <h1>ZeroPhim</h1>
        <div>
          Trang chia sẽ link phim chất lượng cao, với khẩu hiệu "Chia Sẻ Đam Mê,
          Thành Công Sẽ Đến" ZP sẽ cố gắng chia sẽ nhiều link phim hay để mọi
          người có thể tận hưởng những phút giây giải trí cho gia đình và chính
          mình.
        </div>
      </el-col>
      <el-col :md="12" :sm="24" class="box-right">
        <div>
          <iframe
            src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2FZeroPhim&width=140&layout=button_count&action=like&size=small&share=true&height=46&appId"
            width="140"
            height="46"
            style="border: none; overflow: hidden"
            scrolling="no"
            frameborder="0"
            allowTransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
        <client-only>
          <div
            class="fb-save"
            data-uri="https://www.facebook.com/ZeroPhim"
            data-size="large"
          ></div>
        </client-only>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.container ::v-deep {
  height: 100%;
  padding: 1em 0;
  .box-left {
    padding-right: 1em;
    h1 {
      margin-bottom: 0.5em;
    }
  }
}
</style>
