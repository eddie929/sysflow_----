<template>
  <el-main>
    <el-row style="margin: 0px 0px 0px 20px; ">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            ref="refupform"
            :model="form"
            :label-position="labelPosition"
            :rules="rules"
          >
            <el-form-item
              label="编号"
              :label-width="formLabelWidth"
              prop="number"
            >
              <el-input v-model="form.number" autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="名称"
              :label-width="formLabelWidth"
              prop="name"
            >
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item
              label="备注"
              :label-width="formLabelWidth"
              prop="公司地址"
            >
              <el-input
                v-model="form.remark"
                autocomplete="off"
                clearable
              />
            </el-form-item>
            <el-form-item style="float: right">
              <el-button
                type="primary"
                icon="el-icon-check"
                size="small"
                @click="editsubmit('refupform')"
              >保存</el-button>
              <el-button
                type="danger"

                icon="el-icon-delete"
                size="small"
                @click="deletesubmit()"
              >删除</el-button>

            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-main>
</template>

<script>
import { up_department, del_department } from '@/api/syshandle'
export default {
  data() {
    return {
      form: {
        id: 0,
        number: '',
        name: '',
        remark: '',
        levels: '',
        fk_id: 0
      },
      // 右侧数据载体
      upform: {
        name: ''
      },
      cityoptions: [], // 所有城市关联数据
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      labelPosition: 'left', // 对齐方向
      formLabelWidth: '100px', // label宽度
      activeName: 'first',
      dialogVisible: false,
      dialogImageUrl: '',
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  watch: {
    upform: {
      handler(newValue, oldValue) {
        this.form.name = newValue.name
        this.form.id = newValue.id
        this.form.number = newValue.number
        this.form.remark = newValue.remark
        this.form.levels = newValue.levels
        this.form.fk_id = newValue.fk_id
      }
    }
  },
  beforeMount: function() {
    // this.get_syscity();
  },
  methods: {
    changescity() {},
    // 删除
    deletesubmit() {
      if (this.form.id <= 0) {
        this.del_box(110, '请选择')
        return
      }
      this.$confirm('确定删除' + this.form.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: this.form.id,
            level: this.form.levels
          }
          del_department(data).then(res => {
            if (res.code === 100) {
              this.del_box(res.code, '删除成功')
              this.form.name = ''
              this.form.id = 0
              this.form.number = ''
              this.form.remark = ''
              this.form.levels = ''
              this.form.fk_id = 0
              this.$emit('Select')
            } else if (res.code === 101) {
              this.del_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.del_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.del_box(res.code, res.msg)
              return
            }
          })
        })
        .catch(() => {})
    },
    // 保存
    editsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          up_department(this.form).then(res => {
            if (res.code === 100) {
              this.alter_box(res.code, '修改成功')
              this.$emit('Select')
              this.form.name = ''
              this.form.id = 0
              this.form.number = ''
              this.form.remark = ''
              this.form.levels = ''
              this.form.fk_id = 0
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
    }
  }
}
</script>

<style></style>
