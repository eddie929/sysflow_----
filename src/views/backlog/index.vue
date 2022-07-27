<template>
  <div style="margin: 1%">
    <el-form :inline="true" class="demo-form-inline" style="overflow:hidden">
      <div style="float: right; margin-right: 10px">
        <el-form-item>
          <el-input placeholder="模糊查询" clearable style="width: 250px" />
        </el-form-item>
        <el-button size="medium" icon="el-icon-search">搜索</el-button>
      </div>

      <el-badge
        :value="200"
        :max="tableData.length"
        class="item"
        style="float: left; margin-left: 10px"
      >
        <el-link
          :underline="false"
          type="primary"
        >待办总数 &nbsp;&nbsp;</el-link>
      </el-badge>
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
        prop="发起人"
        label="发起人"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="节点名称"
        label="当前节点"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column fixed="right" width="150" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handle(scope.row)"
          >查看/处理</el-button>
          <el-button
            type="text"
            size="small"
            @click="handleMonitor(scope.row)"
          >流程监控</el-button>
        </template>
        <!-- v-if="scope.row.流程状态=='正在进行'" -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get_backlog } from '@/api/flowhandle'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      tableData: [], // 数据
      loading: false // 加载动画
    }
  },
  computed: {
    ...mapGetters(['id_用户'])
  },
  beforeMount() {
    this.get_backlog()
  },
  methods: {
    get_backlog() {
      this.loading = true
      get_backlog({ fk_user: this.id_用户 }).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 查看处理
    handle(row) {
      this.$router.push({
        name: 'look',
        params: {
          rows: row
        }
      })
    },
    // 流程监控
    handleMonitor(row) {
      this.$router.push({
        name: 'flowMonitor',
        params: {
          rows: row
        }
      })
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
