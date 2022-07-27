<template>
  <div style="margin: 1%">
    <el-form :inline="true" class="demo-form-inline" style="overflow:hidden">
      <div style="float: right; margin-right: 10px">
        <el-form-item>
          <el-input
            v-model="pageinfo.searchtext"
            placeholder="模糊查询"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-button size="medium" icon="el-icon-search">搜索</el-button>
      </div>
      <div style="float: right; margin-right: 10px">
        <el-radio-group
          v-model="radioValue"
          size="medium"
          @change="radioChange"
        >
          <el-radio-button label="我的发起" />
          <el-radio-button label="我的处理" />
        </el-radio-group>
      </div>
    </el-form>

    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      max-height="800"
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 0px"
    >
      <el-table-column v-if="false" prop="id" label="id" />
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :reserve-selection="true"
        align="center"
      />
      <el-table-column
        prop="流程名称"
        label="流程名称"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="flowstate"
        label="流程状态"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="initiator_username"
        label="发起人"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="用户姓名"
        label="处理人"
        :show-overflow-tooltip="true"
        align="center"
      />
      <!-- <el-table-column
        prop="节点名称"
        label="节点名称"
        :show-overflow-tooltip="true"
        align="center"
      /> -->
      <!-- <el-table-column
        prop="节点类型"
        label="节点类型"
        :show-overflow-tooltip="true"
        align="center"
      /> -->
      <el-table-column
        prop="creator_time"
        label="处理时间"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column fixed="right" width="150" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handle(scope.row)"
          >查看详情</el-button>
        </template>
        <!-- v-if="scope.row.流程状态=='正在进行'" -->
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="margin-top: 15px">
      <pagination
        ref="pagination"
        :total="total"
        :pagesizes="[10, 20, 30, 50]"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { get_myflow } from '@/api/flowgeneral'
import pagination from '@/bitcomponents/pagination/index' // 分页组件
import { mapGetters } from 'vuex'
export default {
  components: { pagination: pagination },
  data() {
    return {
      tableData: [], // 数据
      loading: false, // 加载动画
      total: 0, // 数据总数
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        searchtext: ''
      },
      radioValue: '我的发起'
    }
  },
  computed: {
    ...mapGetters(['id_用户'])
  },
  beforeMount() {
    this.get_myflow()
  },
  methods: {
    get_myflow() {
      this.loading = true
      let type = '发起'
      if (this.radioValue !== '我的发起') {
        type = '处理'
      }
      get_myflow({
        pageNum: this.pageinfo.pageNum,
        pageSize: this.pageinfo.pageSize,
        type: type,
        fk_user: this.id_用户
      }).then(res => {
        this.tableData = res.data
        this.total = res.count
        this.loading = false
      })
      this.loading = false
    },
    // 查看详情
    handle(row) {
      this.$router.push({
        name: 'details',
        params: {
          rows: row
        }
      })
    },
    // 分页点击事件，子组件调用
    pageChange(item) {
      this.pageinfo.pageSize = item.pageSize
      this.pageinfo.pageNum = item.pageNum
      this.get_myflow()
    },
    // 单选切换事件
    radioChange() {
      this.get_myflow()
    }
  }
}
</script>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
