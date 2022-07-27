<template>
  <div style="margin: 1.5%">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题" prop="标题">
            <el-input v-model="form.标题" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 2%" :gutter="12">
        <el-col :span="12">
          <el-form-item label="名称" prop="名称">
            <el-input v-model="form.名称" placeholder="请输入供应商名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人" prop="法人">
            <el-input v-model="form.法人" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 2%" :gutter="12">
        <el-col :span="12">
          <el-form-item label="联系人" prop="联系人">
            <el-input v-model="form.联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="联系电话">
            <el-input v-model="form.联系电话" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item label="备注" prop="备注">
            <el-input v-model="form.备注" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item
            label="首次承建项目名称"
            label-width="160px"
            prop="首次承建项目名称"
          >
            <el-input v-model="form.首次承建项目名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item label="是否合格" label-width="160px" prop="是否合格">
            <el-radio v-model="form.是否合格" label="是" border>是</el-radio>
            <el-radio v-model="form.是否合格" label="否" border>否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item
            label="资质相关证明文件审查"
            label-width="160px"
            prop="资质相关证明文件审查"
          >
            <el-radio
              v-model="form.资质相关证明文件审查"
              label="是"
              border
            >是</el-radio>
            <el-radio
              v-model="form.资质相关证明文件审查"
              label="否"
              border
            >否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item
            label="是否两年未合作"
            label-width="160px"
            prop="是否两年未合作"
          >
            <el-radio
              v-model="form.是否两年未合作"
              label="是"
              border
            >是</el-radio>
            <el-radio
              v-model="form.是否两年未合作"
              label="否"
              border
            >否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="12" style="margin-top: 2%">
        <el-col :span="24">
          <el-form-item
            label="参与招投标"
            label-width="160px"
            prop="参与招投标"
          >
            <el-radio v-model="form.参与招投标" label="是" border>是</el-radio>
            <el-radio v-model="form.参与招投标" label="否" border>否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row
        v-show="flowarr.是否允许选择下一处理人 === 1"
        :gutter="12"
        style="margin-top: 2%"
      >
        <el-col :span="24">
          <el-form-item label="指定用户" label-width="160px">
            <ifforNext ref="ifforNext" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      style="text-align: left; margin-top: 2%"
    >
      <el-button
        type="success"
        class="el-icon-check"
        size="small"
        @click="submit('form')"
      >
        提 交</el-button>
      <!-- <el-button class="el-icon-close" size="small" @click="closedialog()">
        取 消</el-button> -->
      <el-button
        class="el-icon-refresh"
        size="small"
        @click="resetForm('form')"
      >
        重 置</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { insert_supplier } from '@/api/supplierhandle'
import ifforNext from '@/bitcomponents/iffor_next/index'
export default {
  components: { ifforNext },

  data() {
    return {
      flowarr: [], // 流程信息
      form: {
        是否合格: '是',
        资质相关证明文件审查: '是',
        是否两年未合作: '是',
        参与招投标: '是',
        首次承建项目名称: '',
        标题: '',
        名称: '',
        法人: '',
        联系人: '',
        联系电话: '',
        备注: ''
      },
      labelWidth: '80px', // 表单label宽度
      labelPosition: 'left', // 表单对齐方向
      rules: {
        名称: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        标题: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['二级部门名称', '一级部门名称', '姓名', 'id_用户'])
  },

  beforeMount() {
    if (
      this.$route.params.rows === undefined ||
      this.$route.params.rows.length <= 0
    ) {
      this.warning_box('未获取流程信息')
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    } else {
      this.flowarr = this.$route.params.rows
      this.showtitle()
    }
  },

  methods: {
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      if (this.flowarr.是否允许选择下一处理人 === 1) {
        this.$refs.ifforNext.Userdialogclose()
      }
    },
    showtitle() {
      if (this.二级部门名称 === '') {
        this.form.标题 = this.get_title('新供应商准入流程', this.一级部门名称)
      } else {
        this.form.标题 = this.get_title('新供应商准入流程', this.二级部门名称)
      }
    },

    // 提交
    submit(formName) {
      let nexthandler = 0
      if (this.flowarr.是否允许选择下一处理人 === 1) {
        nexthandler = this.$refs.ifforNext.fk_user
      } else {
        nexthandler = 0
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const arr = this.flowarr
          const servedata = {
            fk_flow: arr.fk_flow,
            fk_departmenttwo: this.$store.getters.id_二级部门,
            fk_user: this.id_用户,
            fk_node: arr.fk_node,
            部门名称: this.二级部门名称,
            申请日期: this.getNowFormatDate(),
            创建者: this.姓名,
            标题: this.form.标题,
            备注: this.form.备注,
            // 以上通用字段 可以考虑统一方法处理
            名称: this.form.名称,
            法人: this.form.法人,
            联系人: this.form.联系人,
            联系电话: this.form.联系电话,
            是否合格: this.form.是否合格,
            资质相关证明文件审查: this.form.资质相关证明文件审查,
            参与招投标: this.form.参与招投标,
            是否两年未合作: this.form.是否两年未合作,
            首次承建项目名称: this.form.首次承建项目名称
          }
          insert_supplier(servedata, nexthandler).then(res => {
            if (res.code === 100) {
              this.insert_box(res.code)

              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.go(-1)
              // 刷新表格
            } else if (res.code === 101) {
              this.insert_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.insert_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.insert_box(res.code, res.msg)
              return
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
  font-size: 16px;
  font-weight: 700;
}
</style>
