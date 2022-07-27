<template>
  <div>
    <el-form label-width="80px" label-position="left">
      <el-row style="margin-top: 0px" :gutter="10">
        <el-col :span="10">
          <el-form-item label="模糊查询" label-width="80px">
            <el-input
              v-model="pageinfo.searchtext"
              placeholder="请输入内容"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司/部门" label-width="80px">
            <el-cascader
              v-model="selectDepartmentData"
              :props="defaultProps"
              placeholder="请输入搜索内容"
              :options="departmentData"
              filterable
              :show-all-levels="false"
              clearable
              @change="departmentChange"
            />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label-width="10px">
            <el-button
              size="medium"
              style="float: left; margin-left: 0px"
              @click="searchEvent"
            >
              搜索
              <i class="el-icon-search el-icon--right" />
            </el-button>
          </el-form-item> </el-col>·
      </el-row>
    </el-form>

    <el-table
      ref="userTable"
      v-loading="loading"
      :data="userTableData"
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 20px"
      max-height="300"
      :row-key="row => row.id_用户"
      :fit="true"
      height="300px"
      @selection-change="userSelection"
    >
      <el-table-column v-if="false" prop="id_用户" label="id" />
      <el-table-column prop="姓名" label="姓名" :show-overflow-tooltip="true" />
      <el-table-column prop="职务" label="职务" :show-overflow-tooltip="true" />

      <el-table-column
        prop="一级部门名称"
        label="公司名称"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="二级部门名称"
        label="部门名称"
        :show-overflow-tooltip="true"
      />
      <el-table-column fixed="right" label="操作" width="75">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="margin-top: 15px">
      <pagination
        ref="pagination"
        :total="userpage_total"
        :pagesizes="[10, 20, 30, 50]"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { get_departmentall } from '@/api/syshandle'
import { get_bindinguser } from '@/api/userhandle'
import pagination from '@/bitcomponents/pagination/index'
export default {
  components: { pagination: pagination },
  props: {
    // 父组件传节点id，按照节点id查询用户
    nodeid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialoginfo_flag: false, // 窗口显示隐藏
      // 已绑定数据
      // 默认分页数据
      pageinfo: {
        pageNum: 1, // 第几页
        pageSize: 10, // 一页多少条
        bmoneid: 0,
        bmtwoid: 0,
        bmthreeid: 0,
        searchtext: '',
        querytype: 'in',
        fk_node: 0
      },
      departmentData: [], // 部门数据
      selectDepartmentData: '', // 选中部门数据
      // 绑定树 数据结构
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
        // checkStrictly: true
      },
      loading: false, // 加载表格
      userTableData: [], // 用户数据
      userpage_total: 0, // 用户表格总数
      userSelectionData: [] // 选择的用户
    }
  },
  watch: {
    nodeid: {
      immediate: true, // 初始化监听
      deep: true, // 深度监听
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.pageinfo.fk_node = newValue
          this.get_bindinguser()
        }
      }
    }
  },
  beforeMount: function() {
    this.get_departmentall()
  },
  methods: {
    // 初始化已绑定表格用户
    get_bindinguser() {
      this.loading = true
      get_bindinguser(this.pageinfo).then(res => {
        if (res.code === 100) {
          this.userTableData = res.data
          this.userpage_total = res.count
          this.loading = false
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) {
          this.warning_box('参数为空')
          this.loading = false
          return
        } else if (res.code === -1) console.log('请求失败')
      })
    },
    // 获取选中行数据
    userSelection(val) {
      this.userSelectionData = val
    },
    // 分页点击事件，子组件调用
    pageChange(item) {
      this.pageinfo.pageSize = item.pageSize
      this.pageinfo.pageNum = item.pageNum
      this.get_alluser()
    },
    // 查询所有部门
    get_departmentall() {
      get_departmentall().then(res => {
        if (res.code === 100) {
          this.departmentData = res.data
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
    },
    // 选择公司部门
    departmentChange(val) {
      const userSelectDeoartment = []
      // 三元运算判断用户选择  没选则为0
      userSelectDeoartment.onebm = val[0] !== undefined ? val[0] : 0
      userSelectDeoartment.twobm = val[1] !== undefined ? val[1] : 0
      userSelectDeoartment.threebm = val[2] !== undefined ? val[2] : 0
    },
    // 搜索事件
    searchEvent() {
      this.pageinfo.bmoneid =
        this.selectDepartmentData[0] !== undefined
          ? this.selectDepartmentData[0]
          : 0
      this.pageinfo.bmtwoid =
        this.selectDepartmentData[1] !== undefined
          ? this.selectDepartmentData[1]
          : 0

      this.pageinfo.bmthreeid =
        this.selectDepartmentData[2] !== undefined
          ? this.selectDepartmentData[2]
          : 0
      this.get_bindinguser()
    },
    // 移除事件
    handleClick(row) {
      this.$emit('update:notuserTableRow', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
  background: no-repeat;
}
.bg-purple {
  background: #d3dce6;
  background: no-repeat;
}
.bg-purple-light {
  background: #e5e9f2;
  background: no-repeat;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
