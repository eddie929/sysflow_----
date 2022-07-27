<template>
  <el-cascader
    ref="Departmentall"
    v-model="value"
    :style="style"
    :options="options"
    :props="defaultProps"
    clearable
    @change="change"
  />
</template>

<script>
// 次组件为单选 部门
import { get_departmentall } from '@/api/syshandle' // 查询全部部门API
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      value: [],
      options: [],
      style: 'width:350px;'
    }
  },
  beforeMount: function() {
    this.getAllDepartment()
  },
  methods: {
    // 查询全部部门方法
    getAllDepartment() {
      // 调用查询全部部门api
      get_departmentall().then(res => {
        if (res.code === 100) {
          this.options = res.data
        } else if (res.code === 101) {
          this.get_box(res.code, res.msg)
          return
        } else if (res.code === 102) {
          this.get_box(res.code, res.msg)
          return
        } else if (res.code === -1) {
          this.get_box(res.code, res.msg)
          return
        }
      })
    },
    // 改变选择事件 获取选择内容
    change(val) {
      var deoartmentall = {}
      // 三元运算判断用户选择  没选则为0
      deoartmentall.onebm = val[0] !== undefined ? val[0] : 0
      deoartmentall.twobm = val[1] !== undefined ? val[1] : 0
      deoartmentall.thrbm = val[2] !== undefined ? val[2] : 0
      this.$emit('getDepartmentall', deoartmentall)
    },
    clearSelect() {
      this.value = []
    }
  }
}
</script>

<style></style>
