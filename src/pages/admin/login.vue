<template>
  <div style="width: 100%; max-width: 600px; margin: 0 auto">
    <el-card>
      <el-form v-if="!checkAuth" ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" :loading="loading" @click="login">
            Login
          </el-button>
        </el-form-item>
      </el-form>
      <div v-else>
        <i class="el-icon-loading"></i> Checking login...
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkAuth: true,
      loading: false,
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please input password',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('Please input the password'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    '$store.state.user'(v) {
      if (v) {
        this.$router.push('/admin')
      }
    }
  },
  mounted() {
    if (this.$store.state.user) {
      this.$router.push('/admin')
    } else {
      this.checkAuth = false
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // console.log(valid)
        } else {
          console.log('error submit!!')
          return false
        }
        this.loading = true
        try {
          await this.$fireAuth.signInWithEmailAndPassword(
            this.form.email,
            this.form.password
          )
        } catch (err) {
          this.$notify({
            title: 'Error',
            message: err.message,
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    cancelForm() {},
    loginWith() {
      this.$fireAuth.signInWithEmailAndPassword(this.email, this.password)
      // console.log(login)
      // console.log(this.$fireAuthObj.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)
    },
    logOut() {
      this.$fireAuth.signOut()
    }
  }
}
</script>
