<template>
  <el-aside width="200px" class="main_aside">
    <div class="logo">
      <el-image
        style="height: 100%"
        src="https://www.iconfinder.com/data/icons/photo-video-outline/100/objects-17-512.png"
        fit="contain"
      ></el-image>
    </div>
    <el-menu router :default-active="$route.path">
      <el-menu-item v-for="(item, idx) in nav" :key="idx" :index="item.route">{{
        item.title
      }}</el-menu-item>
      <el-menu-item>
        <el-button @click="signOut">Signout</el-button>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data() {
    return {
      activeLink: null,
      nav: [
        {
          title: 'Phim',
          route: '/admin/films'
        },
        {
          title: 'Danh mục',
          route: '/admin/categories'
        },
        {
          title: 'Quốc gia',
          route: '/admin/countries'
        },
        {
          title: 'Thể loại',
          route: '/admin/genres'
        },
        {
          title: 'Diễn viên',
          route: '/admin/casts'
        },
        {
          title: 'Reports',
          route: '/admin/reports'
        },
        {
          title: 'Sv Icons',
          route: '/admin/sv_icons'
        }
      ]
    }
  },
  methods: {
    signOut() {
      this.$fireAuth.signOut().then(res => {
        this.$router.push('/admin/login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main_aside {
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid;
  border-color: #e6e6e6;
  .logo {
    margin-top: 0.8em;
    height: 100px;
  }
}
</style>
