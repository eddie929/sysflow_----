<template>
  <div class="login" style="width: 100%; height: 100%">
    <div
      style="
        width: 70%;
        height: 70%;
        min-height: 450px;
        min-width: 700px;
        background-color: #fff;
        position: absolute;
        left: 15%;
        top: 15%;
        z-index: 9;
      "
    >
      <div
        class="left"
        style="display: inline-block; width: 70%; height: 101%"
      />
      <div
        style="
          display: inline-block;
          width: 29.5%;
          height: 100%;
          background-color: #fff;
        "
      >
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
          style="position: absolute; z-index: 9999; top: 0px"
        >
          <div class="title-container">
            <h3 class="title">固定资产物联管理系统</h3>
          </div>

          <el-form-item prop="login_name" style="z-index: 999;">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="login_name"
              v-model="loginForm.login_name"
              placeholder="login_name"
              name="login_name"
              type="text"
              tabindex="1"
              autocomplete="on"
              style=" border: 0px;"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Password"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 30px"
            @click.native.prevent="handleLogin"
          >登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能少于5位'))
      } else {
        callback()
      }
    }

    return {
      loginForm: {
        login_name: 'bitsoft',
        passWord: '84502151'
      },
      loginRules: {
        login_name: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.login_name === '') {
      this.$refs.login_name.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true

          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect,
                query: this.otherQuery
              })
              // this.$router.push({ path:  '/checkhome', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style  lang="scss" scoped>
$bg: transparent;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login .el-input input {
    color: $cursor;
  }
}
.el-input__inner{
   border: 0px;

}

/* reset element-ui css */
.login {
.inputDemo el-input{
    border: none;
}
  // filter: blur(20px);
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(2, 2, 2, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
    input:-webkit-autofill {
      box-shadow: 0 0 0px 1000px rgb(0, 0, 0) inset !important;
    }
  }
}
.login>>>.el-input__inner {
    border: 0;
  }
.login {
  min-height: 100%;
  width: 100%;
  background-color: transparent;
  overflow: hidden;
  .left {
    background-image: url("../../icons/bg_1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .login-form {
    position: relative;
    width: 380px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  // 输入框图标
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: rgb(73, 71, 71);
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.login::before {
  content: "";
  height: 100%;
  display: block;
  width: 100%;
  background-image: url("../../icons/bg_1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  filter: blur(20px);
  position: absolute;
  z-index: 1;
}
</style>

