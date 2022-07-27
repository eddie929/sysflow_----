<template>
  <div>
    <el-pagination
      background
      :current-page="pageinfo.pageNum"
      :page-sizes="pagesizes"
      :page-size="pageinfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pagesizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    }
  },
  data() {
    return {
      // 页码参数
      pageinfo: {
        pageNum: 1, // 第几页
        pageSize: this.pagesizes[0] // 默认父组件分页数量数组第一索引值
      }
    }
  },
  beforeMount: function() {
    // this.pageinfoInit()
  },
  methods: {
    // 控制每页显示条数
    handleSizeChange(val) {
      this.pageinfo.pageSize = val
      // console.log(`每页 ${this.pageinfo.pageSize} 条`)
      this.$emit('pageChange', this.pageinfo)
    },
    // 第几页
    handleCurrentChange(val) {
      this.pageinfo.pageNum = val
      // console.log(`当前页: ${this.pageinfo.pageNum}`)
      this.$emit('pageChange', this.pageinfo)
    },
    pageinfoInit() {
      // console.log('lai')

      // this.pageinfo.pageNum = 1
      // this.pageinfo.pageSize = 10
    }
  }
}
</script>

<style lang="scss" scoped></style>
