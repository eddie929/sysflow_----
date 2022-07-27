<template>
  <el-dialog
    v-if="dialogline_flag"
    :visible.sync="dialogline_flag"
    center
    width="70%"
    @opened="opened"
    @closed="closed"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-edit-outline" />
      <span class="title-text">编辑分支条件</span>
      <div class="button-right">
        <span class="title-close" @click="dialogcancel" />
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableData"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      :highlight-current-row="true"
      :fit="true"
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      tooltip-effect="dark"
      @selection-change="selectRow"
    >
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column prop="column_name" label="字段名" min-width="60%">
        <template slot-scope="{ row }">
          <el-select
            v-model="row.column_name"
            placeholder="请选择"
            :loading="loading"
            filterable
            @change="selectchange"
          >
            <el-option
              v-for="item in tablecolumn"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="verify" label="条件" min-width="60%">
        <template slot-scope="{ row }">
          <el-select v-model="row.verify" placeholder="请选择">
            <el-option
              v-for="item in verify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="expression" label="表达式" min-width="150%">
        <template slot-scope="{ row }">
          <el-input v-model="row.expression" placeholder="请输入内容" />
        </template>
      </el-table-column>

      <el-table-column width="100">
        <template slot="header">
          <el-button size="small" type="warning" plain @click="addRow()">
            新 增
          </el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            plain
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >
            移 除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  get_tablecolumn,
  insert_linesqlwhere,
  get_linesqlwhere,
  del_linesqlwherebyid
} from '@/api/flowhandle'
export default {
  components: {},
  //   props: {
  //   lineinfo: {
  //     type: Array,
  //     //    default: function () {
  //     //     return []
  //     // }
  //     // default: () => ({}) object
  //     default: () => []
  //   }
  // },
  data() {
    return {
      dialogline_flag: false, // 窗口显示隐藏
      lineinfo: [], // 父组件传值 线数据
      loading: true,
      tablecolumn: [], // 数据库列名
      tableData: [],
      verify: [
        {
          value: '==',
          label: '等于'
        },
        {
          value: '>',
          label: '大于'
        },
        {
          value: '<',
          label: '小于'
        },
        {
          value: '>=',
          label: '大于等于'
        },
        {
          value: '<=',
          label: '小于等于'
        },
        {
          value: '!=',
          label: '不等于'
        },

        {
          value: 'in',
          label: '包含'
        },
        {
          value: 'line',
          label: '模糊'
        }
      ] // 线上的条件
    }
  },
  beforeMount: function() {},
  methods: {
    // 关闭窗口
    dialogcancel() {
      this.dialogline_flag = false
    },
    // 添加行
    addRow() {
      const list = {
        fk_line: parseInt(this.lineinfo.id),
        fk_flow: this.lineinfo.fk_flow,
        column_name: '',
        column_type: '',
        verifyvalue: '',
        verify: '',
        expression: ''
      }
      this.tableData.push(list)
    },
    // 移除行
    deleteRow(index, rows) {
      this.$confirm('确定删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del_linesqlwherebyid({ id: rows[index].id }).then(res => {
            if (res.code === 100) {
              rows.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 提交
    submit() {
      const vm = this
      for (const key in this.tableData) {
        if (
          this.tableData[key].column_name === '' ||
          this.tableData[key].verify === '' ||
          this.tableData[key].verify === ''
        ) {
          vm.warning_box('请将信息填写完整')
          return
        }
        // 循环读取列类型 赋值给tabledata
        const columntype = this.tablecolumn.find(item => {
          return item.name === this.tableData[key].column_name
        })
        this.tableData[key].column_type = columntype.type

        // 循环读取条件 赋值给verifyvalue
        const verifyvalue = this.verify.find(item => {
          return item.value === this.tableData[key].verify
        })
        this.tableData[key].verifyvalue = verifyvalue.label
      }
      if (this.tableData.length === 0) {
        this.warning_box('请添加内容')
        return
      }
      // 插入数据
      insert_linesqlwhere(this.tableData).then(res => {
        if (res.code === 100) {
          this.insert_box(res.code)
          this.dialogline_flag = false
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
    },
    // 加载数据表的列
    get_tablecolumn() {
      this.loading = true
      get_tablecolumn({ fk_flow: this.lineinfo.fk_flow }).then(res => {
        if (res.code === 100) {
          this.tablecolumn = res.data
        }
      })
      this.loading = false
    },

    // 窗口被打开
    opened() {
      get_linesqlwhere({
        fk_flow: this.lineinfo.fk_flow,
        fk_line: this.lineinfo.id
      }).then(res => {
        if (res.code === 100) {
          this.tableData = res.data
        }
      })
      this.get_tablecolumn()
    },
    // 窗口关闭
    closed() {
      this.tableData = []
    },
    // 选中事件
    selectRow() {},
    // 下拉列表选择
    selectchange(val) {
       // 遍历当前列表有没有

    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
}
.dialog-title i {
  color: #45a4f9;
  /* color: #0B2278; */
  font-size: 16px;
  line-height: 38px;
}
.dialog-footer {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
</style>
