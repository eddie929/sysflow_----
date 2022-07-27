<template>
  <el-dialog
    v-if="dialoginfo_flag"
    :visible.sync="dialoginfo_flag"
    center
    width="1000px"
  >
    <div slot="title" class="dialog-title">
      <i class="el-icon-edit-outline" />
      <span class="title-text">绑定节点操作人员</span>
      <div class="button-right">
        <span class="title-close" @click="dialogcancel" />
      </div>
    </div>
    <!-- 搜索条件 -->
    <el-form label-width="80px" label-position="left">
      <el-row style="margin-top: 0px" :gutter="10">
        <el-col :span="4">
          <el-switch
            v-model="condition"
            style="margin-top: 8px"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="职务"
            inactive-text="用户"
            clearable
            @change="changeusers"
          />
        </el-col>
        <el-col :span="7">
          <el-form-item label="模糊查询" label-width="80px">
            <el-input
              v-model="fuzzyQuery"
              placeholder="请输入内容"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="!condition" :span="7">
          <el-form-item label="公司/部门" label-width="80px">
            <el-cascader
              v-model="selectDepartmentData"
              :props="defaultProps"
              placeholder="请输入搜索内容"
              :options="departmentData"
              filterable
              :show-all-levels="false"
              @change="departmentChange"
            />
          </el-form-item>
        </el-col>

        <div style="float: right">
          <el-button type="warning" plain size="medium" @click="searchEvent">
            搜索
            <i class="el-icon-search el-icon--right" />
          </el-button>
        </div>
      </el-row>
    </el-form>
    <!-- 用户表格 -->
    <el-table
      v-if="!condition"
      ref="userTable"
      v-loading="loading"
      :data="userTableData"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 20px"
      max-height="300"
      :row-key="row => row.id_用户"
      :fit="true"
      @selection-change="userSelection"
    >
      <!-- <el-table-column type="index" :index="indexMethod" v-if="false">
      </el-table-column> -->
      <el-table-column type="selection" :reserve-selection="true" width="55" />
      <el-table-column v-if="false" prop="id_用户" label="id" />
      <el-table-column prop="姓名" label="姓名" :show-overflow-tooltip="true" />
      <el-table-column prop="工号" label="工号" :show-overflow-tooltip="true" />
      <el-table-column prop="职务" label="职务" :show-overflow-tooltip="true" />
      <el-table-column
        prop="办公电话"
        label="办公电话"
        :show-overflow-tooltip="true"
      />
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
    </el-table>
    <!-- 分页 -->
    <div v-if="!condition" class="block" style="margin-top: 15px">
      <pagination
        ref="pagination"
        :total="userpage_total"
        :pagesizes="[10, 20, 30, 50]"
        @pageChange="pageChange"
      />
    </div>
    <!-- 角色表格 -->
    <el-table
      v-if="condition"
      ref="roleTable"
      v-loading="loading"
      :data="roleTableData"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 20px"
      max-height="300"
      :row-key="row => row.id"
      :fit="true"
      @selection-change="roleSelection"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55" />
      <el-table-column
        v-if="false"
        prop="id"
        label="id"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="name"
        label="角色名称"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="power"
        label="权限"
        :show-overflow-tooltip="true"
      />
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="btnsubmit">确 定</el-button>
      <el-button
        v-if="!condition"
        type="success"
        @click="allsubmit"
      >选择全部用户</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get_departmentall } from '@/api/syshandle'
import { get_alluser, get_userrole } from '@/api/userhandle'
import pagination from '@/bitcomponents/pagination/index'
export default {
  components: { pagination: pagination },
  data() {
    return {
      dialoginfo_flag: false, // 窗口显示隐藏
      condition: false, // 滑块 true职务 false用户
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
      roleTableData: [], // 角色数据
      // 默认分页数据
      pageinfo: {
        pageNum: 1, // 第几页
        pageSize: 10, // 一页多少条
        bmoneid: 0,
        bmtwoid: 0,
        searchtext: ''
      },
      fuzzyQuery: '', // 模糊查询
      userpage_total: 0, // 用户表格总数
      userSelectionData: [], // 选择的用户
      roleSelectionData: [] // 选择的角色
    }
  },
  beforeMount: function() {
    this.get_departmentall()
    this.get_alluser()
    this.get_userrole()
  },
  methods: {
    // 关闭窗口
    dialogcancel() {
      this.dialoginfo_flag = false
    },
    // 查询所有部门
    get_departmentall() {
      get_departmentall().then(res => {
        if (res.code === 100) this.departmentData = res.data
        else if (res.code === 101) console.log('参数无效')
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
    // 初始化表格用户
    get_alluser() {
      this.loading = true
      get_alluser(this.pageinfo).then(res => {
        if (res.code === 100) {
          this.userTableData = res.data
          this.userpage_total = res.count
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
      this.loading = false
    },
    // 初始化角色
    get_userrole() {
      this.loading = true
      get_userrole().then(res => {
        if (res.code === 100) {
          this.roleTableData = res.data
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
      this.loading = false
    },

    // 分页点击事件，子组件调用
    pageChange(item) {
      this.pageinfo.pageSize = item.pageSize
      this.pageinfo.pageNum = item.pageNum
      this.get_alluser()
      // console.log(`每页展示${this.page_size}条，当前为${this.page_index}页`)
    },
    // 滑块切换
    changeusers(val) {
      this.roleSelectionData = []
      this.userSelectionData = []
      this.fuzzyQuery = ''
      this.selectDepartmentData = ''
      // 用法： 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
      this.$nextTick(() => {
        this.$refs.userTable.clearSelection() // 清除选中
      })
      this.$nextTick(() => {
        this.$refs.roleTable.clearSelection() // 清除选中
      })
      // val true是角色/职务
      // val false 是用户
      if (val === true) {
        // 清空数据用
        this.roleTableData = []
        this.get_userrole()
      } else {
        // 清空数据用
        this.pageinfo.pageNum = 1
        this.pageinfo.pageSize = 10
        this.userTableData = []
        this.get_alluser()
      }
    },
    // 搜索事件
    searchEvent() {
      // this.$refs.pagination.pageinfo.pageSize
    },
    // 获取选中行数据
    userSelection(val) {
      this.userSelectionData = val
      this.roleSelectionData = []
      // 循环遍历也可以解决 选中值不刷新问题，后续判断下那种方式好
      // console.log(this.$refs.userTable.selection)
      // this.userSelectionData = this.$refs.userTable.selection
      // const newFilArr = this.userSelectionData.filter((item, i) => {
      //   console.log(item)
      //   return item.id_用户 >= 0
      // })
      // console.log('newFilArr==', newFilArr)
    },
    roleSelection(val) {
      this.userSelectionData = []
      this.roleSelectionData = val
    },
    // 确定选择
    btnsubmit() {
      // 先判断选择的是职务还是用户
      if (this.condition === false) {
        this.$emit('update:usertablerow', this.userSelectionData)
      } else {
        this.$emit('update:roletablerow', this.roleSelectionData)
      }
      this.dialoginfo_flag = false
    },
    // 选择全部用户
    allsubmit() {
      this.$emit('allTableRowWay')
      this.dialoginfo_flag = false
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
