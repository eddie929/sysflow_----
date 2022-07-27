<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="16" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="activity">
                <el-form
                  ref="formuser"
                  :model="user"
                  :label-position="labelPosition"
                  :rules="rules"
                  style="margin: 0px 0px 0px 20px; width: 480px"
                >
                  <el-form-item
                    label="姓名"
                    :label-width="formLabelWidth"
                    prop="姓名"
                  >
                    <el-input v-model="user.姓名" autocomplete="off" />
                  </el-form-item>

                  <el-form-item
                    label="登录名"
                    :label-width="formLabelWidth"
                    prop="登录名"
                  >
                    <el-input v-model="user.登录名" autocomplete="off" />
                  </el-form-item>

                  <el-form-item
                    label="邮箱"
                    :label-width="formLabelWidth"
                    prop="邮箱"
                  >
                    <el-input
                      v-model="user.邮箱"
                      autocomplete="off"
                      clearable
                      placeholder="请输入邮箱"
                    />
                  </el-form-item>
                  <el-form-item
                    label="手机"
                    :label-width="formLabelWidth"
                    prop="手机"
                  >
                    <el-input
                      v-model="user.手机"
                      autocomplete="off"
                      clearable
                      placeholder="请输入手机"
                    />
                  </el-form-item>

                  <el-form-item
                    label="办公电话"
                    :label-width="formLabelWidth"
                    prop="办公电话"
                  >
                    <el-input
                      v-model="user.办公电话"
                      autocomplete="off"
                      clearable
                      placeholder="请输入办公电话"
                    />
                  </el-form-item>

                  <el-form-item style="float: left">
                    <el-button
                      type="primary"
                      icon="el-icon-check"
                      size="small"
                      style="margin: 10px 0px 0px 70px;"
                      @click="altersubmit('formuser')"
                    >保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="账号绑定" name="timeline">
                <!-- <timeline /> -->
              </el-tab-pane>
              <!-- <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane> -->
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { up_activeuser, get_userinfobyid } from '@/api/userhandle'
import UserCard from './components/UserCard'
import userlogo from '@/assets/sysimages/userlogo.png'

export default {
  name: 'Profile',
  components: { UserCard },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      labelPosition: 'left', // 对齐方向
      formLabelWidth: '70px', // label宽度
      rules: {
        姓名: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        登录名: [{ required: true, message: '请输入登录名', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      '姓名',
      'roles',
      '登录名',
      '邮箱',
      '手机',
      '办公电话',
      'id_用户'
    ])
  },
  beforeMount() {
    // this.getUser()
     this.get_userinfobyid()
  },
  methods: {
    // getUser() {
    //   this.user = {
    //     姓名: this.姓名,
    //     role: this.roles.join(' | '),
    //     邮箱: this.邮箱,
    //     手机: this.手机,
    //     登录名: this.登录名,
    //     办公电话: this.办公电话,
    //     id_用户: this.id_用户,
    //     avatar: userlogo
    //   }
    // },
    // 保存用户
    altersubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userdata = {
            id_用户: this.id_用户,
            登录名: this.user.登录名,
            姓名: this.user.姓名,
            邮箱: this.user.邮箱,
            手机: this.user.手机,
            办公电话: this.user.办公电话
          }
          up_activeuser(userdata).then(res => {
            if (res.code === 100) {
              this.get_userinfobyid()
              this.alter_box(res.code, '修改成功')
            } else if (res.code === 101) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.alter_box(res.code, res.msg)
              return
            }
          })
        } else {
          return false
        }
      })
    },
    // 查询用户信息
    get_userinfobyid() {
      get_userinfobyid({ id: this.id_用户 }).then(res => {
        if (res.code === 100) {
          let userbm = res.data.一级部门名称
          if (res.data.二级部门名称.length > 0) {
            userbm += '/' + res.data.二级部门名称
          }
          if (res.data.三级部门名称.length > 0) {
            userbm += '/' + res.data.三级部门名称
          }
          this.user = {
            姓名: res.data.姓名,
            role: this.roles.join(' | '),
            邮箱: res.data.邮箱,
            手机: res.data.手机,
            登录名: res.data.登录名,
            办公电话: res.data.办公电话,
            id_用户: this.id_用户,
            avatar: userlogo,
            userbm: userbm,
            职务: res.data.职务
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  height: 600px; // 这里是固定高度
}
.box {
  height: 100%;
  overflow: auto;
}
</style>
