<template>
  <div>
    <el-form label-width="80px" label-position="left">
      <el-row style="margin-top: 0px" :gutter="10">
        <el-col :span="10">
          <el-form-item label="模糊查询" label-width="80px">
            <el-input
              v-model="searchData.searchtext"
              placeholder="请输入内容"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
            />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label-width="10px">
            <el-button size="medium" @click="searchEvent">
              搜索
              <i class="el-icon-search el-icon--right" />
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="roleTable"
      v-loading="loading"
      :data="roleTableData"
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 20px"
      max-height="300"
      :row-key="row => row.id"
      :fit="true"
      height="300px"
      @selection-change="roleSelection"
    >

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
      <el-table-column fixed="right" label="操作" width="75">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get_bindingrole } from '@/api/userhandle'

export default {
  components: {},
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
      loading: false, // 加载表格
      roleTableData: [], // 角色数据
      searchData: {
        searchtext: '',
        querytype: 'notin',
        fk_node: 0
      },
      roleSelectionData: [] // 选择的职务
    }
  },
  watch: {
    nodeid: {
      immediate: true, // 初始化监听
      deep: true, // 深度监听
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.searchData.fk_node = newValue
          this.get_bindingrole()
        }
      }
    }
  },
  beforeMount: function() {},
  methods: {
    // 初始化角色
    get_bindingrole() {
      this.loading = true
      get_bindingrole(this.searchData).then(res => {
        if (res.code === 100) {
          this.roleTableData = res.data
          this.loading = false
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
      this.loading = false
    },

    // 搜索事件
    searchEvent() {
      this.get_bindingrole()
    },
    // 移除事件
    handleClick(row) {
      this.$emit('update:roleTableRow', row)
    },
    // 获取选中行数据
    roleSelection(val) {
      this.roleSelectionData = val
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
