<template>
  <div>
    <!-- 搜索条件 -->
    <el-form ref="form" label-width="80px" label-position="left">
      <el-row style="margin-top: 0px" :gutter="5">
        <el-col :span="7">
          <el-form-item label="模糊查询" label-width="80px" prop="模糊查询">
            <el-input
              v-model="pageinfo.searchtext"
              placeholder="请输入内容"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
              style="width: 90%"
            />
            <el-tooltip
              content="按姓名，工号，职务模糊查询"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-warning-outline" style="color: #409eff" />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="公司/部门" label-width="80px" prop="公司/部门">
            <el-cascader
              v-model="selectDepartmentData"
              :props="defaultProps"
              placeholder="请输入搜索内容"
              :options="departmentData"
              filterable
              :show-all-levels="false"
              style="width: 95%"
              clearable
              @change="departmentChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="用户角色" label-width="80px" prop="用户角色">
            <el-select v-model="userroleValue" clearable placeholder="请选择">
              <el-option
                v-for="item in userroleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <div style="float: right">
          <el-button size="medium" @click="searchEvent">
            搜索
            <i class="el-icon-search el-icon--right" />
          </el-button>
        </div>
      </el-row>
    </el-form>
    <!-- 用户表格 -->
    <el-table
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
      :highlight-current-row="!selectionShow"
      @selection-change="userSelection"
      @row-click="userTableRwoClick"
    >
      <!-- <el-table-column type="index" :index="indexMethod" v-if="false">
      </el-table-column> -->
      <el-table-column
        v-if="selectionShow"
        type="selection"
        :reserve-selection="true"
        width="55"
      />
      <el-table-column v-if="false" prop="id_用户" label="id" />
      <el-table-column
        prop="姓名"
        label="姓名"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="工号"
        label="工号"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="职务"
        label="职务"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="办公电话"
        label="办公电话"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="一级部门名称"
        label="公司名称"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="二级部门名称"
        label="部门名称"
        :show-overflow-tooltip="true"
        align="center"
      />
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
    <div slot="footer" class="dialog-footer">
      <el-button
        icon="el-icon-check"
        type="primary"
        @click="submitok"
      >确 定</el-button>
      <el-button
        icon="el-icon-refresh-right"
        @click="submitClear"
      >清 除</el-button>
    </div>
  </div>
</template>

<script>
import { get_departmentall } from '@/api/syshandle'
import { get_alluser, get_userrole } from '@/api/userhandle'
import pagination from '@/bitcomponents/pagination/index' // 分页组件
export default {
  name: 'SelectUser',
  components: { pagination: pagination },
  props: {
    // 控制是否多选
    selectionShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      departmentData: [], // 部门数据
      selectDepartmentData: '', // 选中部门数据
      // 绑定树 数据结构
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      loading: false, // 加载表格
      userTableData: [], // 用户数据
      userSelectionData: [], // 选中用户数据 多选
      userSelectionDataD: [], // 选中用户数据 单选
      userroleData: [], // 角色数据
      userroleValue: '', // 选中角色数据
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        bmoneid: 0,
        bmtwoid: 0,
        bmthreeid: 0,
        userrole: 0,
        searchtext: ''
      },
      userpage_total: 0 // 用户表格总数
    }
  },
  beforeMount: function() {
    this.get_departmentall()
    this.get_userrole()
    this.get_alluser()
  },
  mounted: function() {
    console.group('mounted 挂载结束状态===============》')
    console.log('%c%s', 'color:green', 'el     : ' + this.$el) // 已被初始化
    console.log(this.$el)
    console.log('%c%s', 'color:green', 'data   : ' + this.$data) // 已被初始化
    console.log('%c%s', 'color:green', 'message: ' + this.message) // 已被初始化
  },
  created: function() {
    console.group('created 创建完毕状态===============》')
    console.log('%c%s', 'color:red', 'el     : ' + this.$el) // undefined
    console.log('%c%s', 'color:green', 'data   : ' + this.$data) // [object Object]  =>  已被初始化
    console.log('%c%s', 'color:green', 'message: ' + this.message) // Welcome Vue  =>  已被初始化
  },
  methods: {
    // 查询所有部门
    get_departmentall() {
      get_departmentall().then(res => {
        if (res.code === 100) this.departmentData = res.data
        else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
    },
    // 初始化角色
    get_userrole() {
      this.loading = true
      get_userrole().then(res => {
        if (res.code === 100) {
          this.userroleData = res.data
          this.loading = false
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
    },
    // 初始化表格用户
    get_alluser() {
      this.loading = true
      get_alluser(this.pageinfo).then(res => {
        if (res.code === 100) {
          this.userTableData = res.data
          this.userpage_total = res.count
          this.loading = false
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
    },
    // 搜索条件
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
      this.pageinfo.userrole =
        this.userroleValue !== '' ? this.userroleValue : 0
      this.get_alluser()
    },
    // 选择公司部门
    departmentChange(val) {
      const userSelectDeoartment = []
      // 三元运算判断用户选择  没选则为0
      userSelectDeoartment.onebm = val[0] !== undefined ? val[0] : 0
      userSelectDeoartment.twobm = val[1] !== undefined ? val[1] : 0
      userSelectDeoartment.threebm = val[2] !== undefined ? val[2] : 0
    },
    // 获取选中行数据 多选
    userSelection(val) {
      // 多选的值
      this.userSelectionData = val

      // 循环遍历也可以解决 选中值不刷新问题，后续判断下那种方式好
      // this.userSelectionData = this.$refs.userTable.selection
      // const newFilArr = this.userSelectionData.filter((item, i) => {
      //   console.log(item)
      //   return item.id_用户 >= 0
      // })
      // console.log('newFilArr==', newFilArr)
    },
    //	当某一行被点击时会触发该事件 单选时用到的
    userTableRwoClick(row) {
      this.userSelectionDataD = row
    },

    // 分页点击事件，子组件调用
    pageChange(item) {
      this.pageinfo.pageSize = item.pageSize
      this.pageinfo.pageNum = item.pageNum
      this.get_alluser()
      // console.log(`每页展示${this.page_size}条，当前为${this.page_index}页`)
    },

    // 清空数据
    toggleSelection() {
      this.$refs.userTable.clearSelection()
      this.pageinfo.pageNum = 1
      this.pageinfo.pageSize = 10
      this.pageinfo.searchtext = ''
      this.pageinfo.bmoneid = 0
      this.pageinfo.bmtwoid = 0
      this.pageinfo.bmthreeid = 0
      this.pageinfo.userrole = 0
      this.userTableData = []
      this.selectDepartmentData = '' // 选中部门数据
      this.userrole = '' // 选中角色数据
      this.userpage_total = 0
      this.get_alluser()
    },
    // 确定选择
    submitok() {
      // 多选
      if (this.selectionShow === true) {
        this.$emit('update:userTableRow', this.userSelectionData)
      }
      // 单选
      if (this.selectionShow === false) {
        this.$emit('update:userTableRow', this.userSelectionDataD)
      }
    },
    // 清除选择
    submitClear() {
      this.$emit('Userdialogclose')
      this.userSelectionData = []
      this.userSelectionDataD = []
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
