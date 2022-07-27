<template>
  <div class="block">
    <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
        <el-button
          v-if="activity.type == 'warning'"
          icon="el-icon-view el-icon--right"
          type="text"
          @click="btnDetails(index)"
        >查看详情</el-button>
      </el-timeline-item>
      <el-empty v-if="empty" description="暂无数据" />
    </el-timeline>

    <el-dialog
      :close-on-click-modal="false"
      top="10vh"
      :visible.sync="showSupplierDispose1"
      width="75%"
      center
      :title="dialogTitle"
      class=" dialog"
      @closed="dialogclose"
    >
      <supplierDispose1
        v-if="showSupplierDispose1 == true"
        ref="supplierDispose1"
        optype="查看"
        :nodeinfo="nodeinfo"
        :resdata="supplierSData"
      /></el-dialog>
  </div>
</template>

<script>
import { get_flowhandling } from '@/api/flowhandle'
import supplierDispose1 from '@/views/supplier/components/supplierDispose1.vue'
import { get_sflowsupplier } from '@/api/supplierhandle'
export default {
  components: { supplierDispose1 },
  props: {
    nodeinfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      activities: [],
      empty: false, // 判断是否有处理数据
      handlingData: [],
      showSupplierDispose1: false, // 供应商处理窗口 显示隐藏
      dialogTitle: '默认名称',
      supplierSData: [] // 供应商处理数据
    }
  },
  beforeMount() {
    this.get_flowhandling()
  },
  methods: {
    // 加载处理记录
    get_flowhandling() {
      get_flowhandling({ fk_uflow: this.nodeinfo.fk_uflow }).then(res => {
        if (res.code === 100) {
          if (res.data.length > 0) {
            this.handlingData = res.data
            // 遍历循环 整利数组渲染时间线
            for (let index = 0; index < res.data.length; index++) {
              if (res.data[index].type === '发起') {
                // primary蓝色，success绿色，warning黄色，danger红色，info灰色
                const newList = {
                  content:
                    '操作人：' +
                    res.data[index].操作人 +
                    ' | 操作类型：' +
                    res.data[index].type,
                  timestamp: res.data[index].time,
                  size: 'large',
                  type: 'success',
                  icon: 'el-icon-user-solid'
                }
                this.activities.push(newList)
              } else if (res.data[index].type === '审批' &&
                res.data[index].way !== '退回') {
                const newList = {
                  content:
                    '操作人：' +
                    res.data[index].操作人 +
                    ' | 操作类型：' +
                    res.data[index].type +
                    ' | 审核意见：' +
                    res.data[index].idea +
                    ' | 审核结果：' +
                    res.data[index].way,
                  timestamp: res.data[index].time,
                  size: 'large',
                  type: 'primary',
                  icon: 'el-icon-user-solid'
                }
                this.activities.push(newList)
              } else if (res.data[index].type === '处理') {
                const newList = {
                  content:
                    '操作人：' +
                    res.data[index].操作人 +
                    ' | 操作类型：' +
                    res.data[index].type +
                    ' | 处理意见：' +
                    res.data[index].idea,
                  timestamp: res.data[index].time,
                  size: 'large',
                  type: 'warning',
                  icon: 'el-icon-user-solid'
                }
                this.activities.push(newList)
              } else if (
                res.data[index].type === '审批' &&
                res.data[index].way === '退回'
              ) {
                const newList = {
                  content:
                    '操作人：' +
                    res.data[index].操作人 +
                    ' | 操作类型：' +
                    res.data[index].type +
                    ' | 审核意见：' +
                    res.data[index].idea +
                    ' | 审核结果：' +
                    res.data[index].way,
                  timestamp: res.data[index].time,
                  size: 'large',
                  type: 'danger',
                  icon: 'el-icon-user-solid'
                }
                this.activities.push(newList)
              } else if (
                res.data[index].type === '归档' ||
                res.data[index].type === '完成' ||
                res.data[index].type === '结束'
              ) {
                const newList = {
                  content:
                    '操作人：' +
                    res.data[index].操作人 +
                    ' | 完成信息：' +
                    res.data[index].idea +
                    ' | 操作类型：' +
                    res.data[index].type,

                  timestamp: res.data[index].time,
                  size: 'large',
                  type: 'info',
                  icon: 'el-icon-user-solid'
                }
                this.activities.push(newList)
              }
            }
          } else {
            // 暂无数据
            this.empty = true
          }
        }
      })
    },
    btnDetails(row) {
      // 供应商测试流程 处理
      if (this.handlingData[row].uflow_name === 'uflow_supplier') {
        // 待办业务的数据
        const fk_flow = this.handlingData[row].fk_flow
        const fk_uflow = this.handlingData[row].fk_uflow
        const fk_node = this.handlingData[row].fk_node
        get_sflowsupplier({
          fk_flow: fk_flow,
          fk_uflow: fk_uflow,
          fk_node: fk_node
        }).then(res => {
          if (res.data.length > 0) {
            // 待办业务数据和请求数据做对比
            const resdata = res.data[0]
            this.supplierSData = res.data[0]
            if (
              fk_flow === resdata.fk_flow &&
              fk_uflow === resdata.fk_uflow &&
              fk_node === resdata.fk_node
            ) {
              this.showSupplierDispose1 = true
              this.dialogTitle = this.handlingData[row].节点名称
            }
          } else {
            this.warning_box('未获取数据。')
          }
        })
      } else if (this.handlingData[row].uflow_name === 'flow2') {
        // 接着往下写
      }
    },
    // 关闭窗口
    dialogclose() {
      this.showSupplierDispose1 = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  font-size: 16px;
  font-weight: 700;
}
</style>
