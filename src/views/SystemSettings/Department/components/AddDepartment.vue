<template>
  <el-dialog
    top="15vh"
    title="新建机构"
    :visible.sync="dialogFormVisible"
    width="50%"
    style="text-align: center"
    @close="dialogclose"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :label-position="labelPosition"
      :rules="rules"
    >
      <el-form-item label="编号" :label-width="formLabelWidth" prop="number">
        <el-input
          v-model="form.number"
          autocomplete="off"
          clearable
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        v-if="levels == '一级'"
        label="地区"
        :label-width="formLabelWidth"
        prop="公司地区"
      >
        <el-cascader
          ref="cascadercity"
          v-model="form.cityvalue"
          style="width: 100%"
          filterable
          clearable
          :options="cityoptions"
          :props="defaultProps"
          @change="citychange"
        />
      </el-form-item>
      <el-form-item
        v-if="levels == '一级'"
        label="地址"
        :label-width="formLabelWidth"
        prop="location"
      >
        <el-input
          v-model="form.location"
          autocomplete="off"
          clearable
          placeholder="请输入"
        />
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input
          v-model="form.remark"
          autocomplete="off"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        class="el-icon-check"
        size="small"
        @click="submitone('ruleForm')"
      >
        保 存</el-button>
      <!-- <el-button @click="dialogFormVisible = false" class="el-icon-close">
        取 消</el-button
      > -->
    </div>
  </el-dialog>
</template>

<script>
import { insert_departmenttwo, insert_departmentthree } from '@/api/syshandle'
export default {
  data() {
    return {
      cityoptions: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      dialogFormVisible: false, // 显示隐藏
      form: {
        fk_id: 0
      }, // 数据载体
      labelPosition: 'right', // 对齐方向
      formLabelWidth: '70px', // label宽度
      rules: {
        // number: [
        //   { required: true, message: "请输入部门编号", trigger: "blur" },
        // ],
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      levels: '', // 级别
      cityvalue: '', // ["210000", "210200"]\
      cascaderLoading: false // 城市联动加载动画
    }
  },
  beforeMount: function() {
    // this.get_syscity();
  },
  methods: {
    // citychange(val) {
    //   this.form.region_code = val[0] + ',' + val[1]
    // },
    // 创建提交
    submitone(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.levels === '一级') {
            // this.departmentone_insert()
          } else if (this.levels === '二级') {
            this.departmenttwo_insert()
          } else if (this.levels === '三级') {
            this.insert_departmentthree()
          }
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // // 创建一级部门方法
    // departmentone_insert() {
    //   // console.log(this.form.region);
    //   this.form.levels = '一级'
    //   departmentone_insert(this.form).then(res => {
    //     if (res.code > 0) {
    //       this.msg('成功', '创建成功!')
    //       this.$emit('Select')
    //     } else {
    //       this.msg('警告', res.msg)
    //     }
    //   })
    // },
    // 创建二级部门方法
    departmenttwo_insert() {
      this.form.levels = '二级'
      insert_departmenttwo(this.form).then(res => {
        if (res.code === 100) {
          this.insert_box(res.code, '创建成功')
          this.$emit('rightFormClear')
          this.$emit('Select')
        } else if (res.code === 101) {
          this.insert_box(res.code, '')
          return
        } else if (res.code === 102) {
          this.insert_box(res.code, '')
          return
        } else if (res.code === -1) {
          this.insert_box(res.code, '')
          return
        }
      })
    },
    // 创建三级部门方法
    insert_departmentthree() {
      this.form.levels = '三级'
      insert_departmentthree(this.form).then(res => {
        if (res.code === 100) {
          this.insert_box(res.code, '创建成功')
          this.$emit('rightFormClear')
          this.$emit('Select')
        } else if (res.code === 101) {
          this.insert_box(res.code, '')
          return
        } else if (res.code === 102) {
          this.insert_box(res.code, '')
          return
        } else if (res.code === -1) {
          this.insert_box(res.code, '')
          return
        }
      })
    },
    dialogclose() {
      this.form = {}
    }
    // 查询所有关联城市
    // get_syscity() {
    //   this.cascaderLoading = true
    //   get_syscity().then(res => {
    //     if (res.code == 0) {
    //       this.cityoptions = res.data
    //       // console.log(this.cityoptions);
    //       this.cascaderLoading = false
    //     }
    //   })
    // },
    // 初始化
    // onload() {
    //   if (this.levels === '一级') {
    //     this.form = {}
    //   } else {
    //     // this.form.number = "LB" + Date.parse(new Date());
    //   }
    // }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.box-card {
  width: 480px;
}
</style>
