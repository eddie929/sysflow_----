<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-card style="margin: 0px 0px 0px 0px; height: 90vh; ">
        <div slot="header" class="clearfix" />
        <el-row style="margin: 0px 10px 0px 0px; height: 100%; width: 300px">
          <el-col :span="24">
            <el-tree
              ref="tree"
              v-loading="treeloading"
              class="filter-tree"
              :data="treedata"
              :props="defaultProps"
              accordion
              node-key="id"
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node, data }"
                class="custom-tree-node"
                style="width: 100%; overflow: hidden"
              >
                <span>{{ node.label }}</span>
                <span style="display: inline-block; float: right">
                  <el-button
                    v-if="data.levels != '三级'"
                    type="text"
                    size="mini"
                    icon="el-icon-bottom"
                    @click="appendtwo(data)"
                  >新建下级</el-button>
                  <!-- <el-button
                    v-if="false"
                    type="text"
                    size="mini"
                    icon="el-icon-plus"
                    @click="appendone(data)"
                  >新建同级</el-button> -->
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-card>
      <el-container>
        <RightForm v-show="display" ref="RightForm" @Select="onload" />
      </el-container>
    </el-container>
    <AddDepartment
      ref="AddDepartment"
      @Select="onload"
      @rightFormClear="rightFormClear"
    />
  </div>
</template>

<script>
import RightForm from './components/RightForm'

import AddDepartment from './components/AddDepartment'
import { get_departmentall } from '@/api/syshandle'
export default {
  components: { RightForm, AddDepartment },
  data() {
    return {
      treeloading: false, // 加载动画
      treedata: [], // 左侧树形数据
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },

      display: true // 部门信息显示隐藏
    }
  },
  beforeMount() {
    this.onload()
  },
  methods: {
    //   新建下级
    appendtwo(val) {
      if (val.levels === '一级') {
        this.$refs.AddDepartment.levels = '二级'
      } else if (val.levels === '二级') {
        this.$refs.AddDepartment.levels = '三级'
      }
      this.$refs.AddDepartment.form.fk_id = val.id
      this.$refs.AddDepartment.dialogFormVisible = true
    },
    //   初始化
    onload() {
      this.treeloading = true
      get_departmentall().then(res => {
        if (res.code === 100) {
          this.treedata = res.data
          this.treeloading = false
        }
      })
    },
    // 点击左侧树形结构任意事件
    handleNodeClick(val) {
      if (val.levels === '一级') {
        this.$refs.RightForm.upform = val
        return
      } else if (val.levels === '二级') {
        this.$refs.RightForm.upform = val
      } else if (val.levels === '三级') {
        this.$refs.RightForm.upform = val
      }
    },
    // 打开公司信息
    // openCompany(row) {
    //   this.display = false
    //   this.gsdisplay = true
    //   this.$refs.Company.form = row // 公司信息弹窗显示
    // },
    // 清除右侧编辑信息
    rightFormClear() {
      this.$refs.RightForm.form.name = ''
      this.$refs.RightForm.form.id = 0
      this.$refs.RightForm.form.number = ''
      this.$refs.RightForm.form.remark = ''
      this.$refs.RightForm.form.levels = ''
      this.$refs.RightForm.form.fk_id = 0
    }
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
