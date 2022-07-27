<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template>
        <!--帮助/使用手册 -->
        <el-tooltip
          class="item"
          effect="dark"
          content="使用说明"
          placement="bottom"
        >
          <el-badge
            style="height: 20px; margin-bottom: 40px;  margin-right: 3px;"
          >
            <el-link
              class="el-icon-question"
              style="font-size: 25px; margin-bottom: 34px; color: #409eff"
            />
          </el-badge>
        </el-tooltip>

        <!-- <el-tooltip
          v-if="true"
          class="item"
          effect="dark"
          content="全屏"
          placement="bottom"
        ><screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <span class="avatar-dropdown">
          <img class="user-avatar" :src="logo" alt="">

          <div class="user-name">
            {{ 姓名 }}
            <i class="el-icon-arrow-down el-icon--right" />
          </div>
        </span>
        <!--用户姓名 -->
        <!-- <div class="avatar-wrapper">
          <el-button
            type="text"
            style="color: black"
          >{{ 姓名 }}<i
            class="el-icon-caret-bottom"
          /></el-button>
        </div> -->

        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首　　页</el-dropdown-item>
          </router-link>
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span
              style="display: block"
              @click="dialogVisible = true"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码窗口 -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        append-to-body
      >
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="原密码" prop="oldword">
            <el-input
              v-model="ruleForm.oldword"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input
              v-model="ruleForm.pass"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              v-model="ruleForm.checkPass"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
            >提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { alter_password } from '@/api/userhandle' // 修改密码
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import Screenfull from '@/components/Screenfull'
// import Search from '@/components/HeaderSearch'
import userlogo from '@/assets/sysimages/userlogo.png'
export default {
  components: {
    Breadcrumb,
    Hamburger
    // Search
  },
  computed: {
    ...mapGetters(['sidebar', 'device', '姓名'])
  },
  mounted() {},
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose(done) {
      this.dialogVisible = false
      this.resetForm('ruleForm')
    },
    // 修改密码提交按钮
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          const reqdata = {
            userid: this.$store.getters.id_用户,
            oldpass: this.ruleForm.oldword,
            newpass: this.ruleForm.checkPass
          }
          alter_password(reqdata)
            .then(response => {
              // 成功
              if (response.code === 100) {
                this.$message({
                  message: '密码修改成功,请重新登录系统!',
                  type: 'success'
                })
                this.logout()
                this.dialogVisible = false
              } else if (response.code === -2) {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
                return
              } else if (response.code === 102) {
                this.$message({
                  message: response.msg,
                  type: 'warning'
                })
                return
              } else {
                this.$message({
                  message: response.msg,
                  type: 'error'
                })
                return
              }
            })
            .catch()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },

  data() {
    // 修改密码窗口的验证
    var validateOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('原密码不能为空'))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      username: '',
      ruleForm: {
        pass: '',
        checkPass: '',
        oldword: ''
      },
      title: '用户logo',
      logo: userlogo,
      dialogVisible: false,
      rules: {
        oldword: [{ validator: validateOldPass, trigger: 'blur' }],
        pass: [
          { validator: validatePass, trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur'
          }
        ],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    // .user-avatar {
    //   width: 40px;
    //   height: 40px;
    //   border-radius: 10px;
    // }
    // .avatar-container {
    //   margin-right: 30px;

    //   .avatar-wrapper {
    //     margin-top: 3px;
    //     position: relative;

    //     .user-avatar {
    //       cursor: pointer;
    //       width: 40px;
    //       height: 40px;
    //       border-radius: 10px;
    //     }

    //     .el-icon-caret-bottom {
    //       cursor: pointer;
    //       position: absolute;
    //       right: -20px;
    //       // top: 25px;
    //       font-size: 15px;
    //     }
    //   }
    // }
    .el-badge {
      margin-right: 15px;
      padding: 0;
    }
  }
}
</style>
