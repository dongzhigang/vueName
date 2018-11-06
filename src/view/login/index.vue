<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">管理员登录</h3>
      </div>
      <el-form-item prop="adminName">
        <span class="svg-container svg-container_login">
          账号：
        </span>
        <el-input name="adminName" type="text" v-model="loginForm.adminName" autoComplete="on" placeholder="adminName" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          密码：
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <i class="el-icon-view" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (validateUsername == null) {
        callback(new Error('请输入正确的管理员用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('管理员密码长度应大于6'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        adminName: '',
        password: ''
      },
      loginRules: {
        adminName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.loading) {
          this.loading = true
          this.$store.dispatch('LoginByAdminname', this.loginForm).then((res) => {
            console.log(res)
            if(res.data.code==0){
              this.loading = false
              this.$router.push({ path: '/' })
            }else{
              this.loading = false
            }
          }).catch(() => {
             console.log('11')
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.login-container{
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #2d3a4b;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}
.tips span:first-of-type{
   margin-right: 16px;
}
.svg-container {
  padding: 6px 5px 6px 15px;
  color:#889aa4;
  vertical-align: middle;
  width: 50px;
  display: inline-block;
}
.svg-container:_login{
  font-size: 20px;
}
.title-container {
  position: relative;
}
.title-container  .title {
  font-size: 26px;
  font-weight: 400;
  color: #eee;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

.login-form {
  position: absolute;
  left: 0;
  right: 0;
  width: 520px;
  padding: 35px 35px 15px 35px;
  margin: 120px auto;
}
.login-container .el-input{
  display: inline-block;
  height: 47px;
  width: 85%;
}
.login-container .el-input input{
  background: #2d3a4b;
  border: 0px;
  -webkit-appearance: none;
  border-radius: 0px;
  padding: 12px 5px 12px 15px;
  color: #eee;
  height: 47px;
}
.login-container .el-input input:-webkit-autofill{
  box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
  -webkit-box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
  -webkit-text-fill-color: #fff !important;
}
.login-container .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
</style>
