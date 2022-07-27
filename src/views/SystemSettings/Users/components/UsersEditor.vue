<template>
  <el-dialog
    v-loading="loading"
    :title="'编辑——' + form.姓名"
    :close-on-click-modal="true"
    :visible.sync="dialogVisible"
    width="50%"
    style="text-align: center"
    top="10vh"
    @opened="opened"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="登录名" prop="登录名">
            <el-input v-model="form.登录名" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="用户密码">
            <el-input
              v-model="form.用户密码"
              type="password"
              placeholder="暂无数据"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 3%" :gutter="24">
        <el-col :span="12">
          <el-form-item label="姓名" prop="姓名">
            <el-input v-model="form.姓名" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="fk_role">
            <Role
              ref="Role"
              style="width: 100%"
              :userinfo="form"
              @optionRole="optionRole"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top: 3%" :gutter="24">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="form.工号" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="手机">
            <el-input v-model="form.手机" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="form.邮箱" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公电话">
            <el-input v-model="form.办公电话" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="职务">
            <el-input
              v-model="form.职务"
              style="width: 100%"
              placeholder="暂无数据"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="部门">
            <Departmentall
              ref="Departmentall"
              style="width: 100%"
              @getDepartmentall="getDepartmentall"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.备注" placeholder="暂无数据" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      style="text-align: center; margin-top: 2%"
    >
      <el-button type="primary" class="el-icon-check" @click="btnok('form')">
        确 定</el-button>
      <!-- <el-button @click="close" class="el-icon-close"> 取 消</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import { get_departmentall } from '@/api/syshandle' // 查询全部部门API
import Departmentall from '@/bitcomponents/Departmentall/index'
import Role from '@/bitcomponents/Role/index'
import {
  up_sysuser,
  del_userbindingrole,
  insert_userbindingrole
} from '@/api/userhandle'
// import { get_userrole } from "@/api/userhandle";

export default {
  components: { Role, Departmentall },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      form: {}, // 数据载体
      labelWidth: '80px', // 表单label宽度
      labelPosition: 'right', // 表单对齐方向
      // 表单验证
      rules: {
        // 登录名
        登录名: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '长度在 2 到 15 个字符',
            trigger: 'blur'
          }
        ],
        // 密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        // 姓名
        姓名: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      displayde: false,
      // 管理部门
      managementOptions: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        multiple: true
      },
      roledata: [] // 选择用户角色数据
    }
  },
  watch: {
    form: {
      // immediate: true, // 初始化监听
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          const strArr = newValue.角色id.split(',')
          var intArr = []
          for (let i = 0; i < strArr.length; i++) {
            intArr.push(parseInt(strArr[i]))
          }
          this.roledata = intArr
        }
      }
    }
  },
  methods: {
    getDepartmentall(val) {
      this.form.id_一级部门 = val.onebm
      this.form.id_二级部门 = val.twobm
      this.form.id_三级部门 = val.thrbm
    },
    // 保存
    btnok(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.roledata.length === 0) {
            this.warning_box('请选择系统角色')
            return
          }

          var upUserInfo = {
            id: this.form.id_用户,
            login_name: this.form.登录名,
            user_name: this.form.姓名,
            password: this.form.用户密码,
            number: this.form.工号,
            post: this.form.职务,
            email: this.form.邮箱,
            work_phone: this.form.办公电话,
            phone: this.form.手机,
            remark: this.form.备注,
            fk_departmentone: this.form.id_一级部门,
            fk_departmenttwo: this.form.id_二级部门,
            fk_departmentthree: this.form.id_三级部门
          }

          up_sysuser(upUserInfo).then(res => {
            if (res.code === 100) {
              if (this.roledata.length > 0) {
                const userroledata = []
                for (let index = 0; index < this.roledata.length; index++) {
                  const newList = {
                    fk_user: parseInt(this.form.id_用户),
                    fk_role: parseInt(this.roledata[index])
                  }
                  userroledata.push(newList)
                }
                del_userbindingrole({
                  fk_user: this.form.id_用户,
                  fk_role: 0
                }).then(delres => {
                  if (delres.code === 100) {
                    insert_userbindingrole(userroledata).then(insres => {
                      if (insres.code === 100) {
                        this.dialogVisible = false
                        this.alter_box(res.code, '修改成功')
                        this.$emit('select') // 刷新页面
                      }
                    })
                  }
                })
              }
            } else if (res.code === 101) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === 105) {
              this.warning_box(res.msg)
              return
            } else if (res.code === 102) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.alter_box(res.code, res.msg)
              return
            }
          })
        }
      })
    },

    // 打开回调
    opened() {
      if (this.form.id_三级部门 !== 0) {
        this.$refs.Departmentall.value = [
          this.form.id_一级部门,
          this.form.id_二级部门,
          this.form.id_三级部门
        ] // 部门
      } else if (this.form.id_三级部门 === 0 && this.form.id_二级部门 !== 0) {
        this.$refs.Departmentall.value = []
        this.$refs.Departmentall.value = [
          this.form.id_一级部门,
          this.form.id_二级部门
        ]
      } else if (this.form.id_二级部门 === 0) {
        this.$refs.Departmentall.value = []
        this.$refs.Departmentall.value = [this.form.id_一级部门]
      }
    },
    // 管理部门查询
    get_departmentall() {
      get_departmentall().then(res => {
        this.managementOptions = res.data
      })
    },
    updateView(e) {
      this.$forceUpdate()
    },
    // 选择用户角色赋值给form
    optionRole(val) {
      this.roledata = val
    }
  }
}
</script>

<style></style>
