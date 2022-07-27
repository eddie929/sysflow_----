<template>
  <div style="margin: 1%">
    <!-- 处理填写 -->
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{ cardName }}</span>
      </div>
      <flowApprove
        v-show="showFlowapprove"
        ref="flow_approve"
        :nodeinfo="nodeinfo"
      />
      <supplierDispose1
        v-show="showSupplierDispose1"
        ref="supplierDispose1"
        :nodeinfo="nodeinfo"
        optype="处理"
      />
      <flowend v-show="showFlowend" ref="flowend" :nodeinfo="nodeinfo" />

      <el-empty v-show="emptyShow" description="暂无数据" />
      {{ nodeinfo }}
    </el-card>
    <!-- 流程信息 -->
    <el-card class="box-card" shadow="hover" style="margin-top: 1% ">
      <el-tabs v-model="activeName">
        <el-tab-pane label="流程信息" name="tabflowinfo">
          <moduleFlowInfo ref="moduleFlowInfo" :nodeinfo="nodeinfo" />
          <div style="margin-top: 1% ">
            <el-collapse accordion>
              <el-collapse-item title="审批/处理信息">
                <disposeInfo ref="disposeInfo" :nodeinfo="nodeinfo" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <!-- <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import flowApprove from '@/bitcomponents/flowApprove/index.vue'
import moduleFlowInfo from '@/bitcomponents/moduleFlowInfo/index.vue'
import disposeInfo from '@/bitcomponents/flowApprove/disposeInfo.vue'
import supplierDispose1 from '@/views/supplier/components/supplierDispose1.vue'
import flowend from '@/bitcomponents/flowApprove/flowend.vue'
export default {
  components: {
    flowApprove,
    moduleFlowInfo,
    disposeInfo,
    supplierDispose1,
    flowend
  },
  data() {
    return {
      showFlowapprove: false, // 流程审批 显示隐藏,
      cardName: '未获取流程信息，请联系管理员。', // 处理卡片名称
      nodeinfo: {}, // 当前节点信息
      activeName: 'tabflowinfo', // tabs默认显示
      collapsename: '1', // 折叠面板默认展开
      emptyShow: false, // 暂无数据的显示隐藏
      showSupplierDispose1: false, // 供应商处理窗口 显示隐藏
      showFlowend: false // 流程完成 显示隐藏
    }
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },

  beforeMount() {
    if (this.$route.params.rows === undefined) {
      this.warning_box('未获取流程信息')
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
      // 开发审批组件
      // 判断当前节点状态 审批还是处理，审批调用通用审批组件
    } else {
      this.nodeinfo = this.$route.params.rows
      this.flowDisposeShow()
    }
  },
  methods: {
    // 返回上一级
    back() {
      this.warning_box('未获取流程信息')
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    },
    // 显示流程处理窗口
    flowDisposeShow() {
      if (this.nodeinfo.节点类型 === '审批') {
        this.cardName = '审批处理'
        this.showFlowapprove = true
      } else if (this.nodeinfo.节点类型 === '处理') {
        if (this.nodeinfo.流程名称 === '供应商测试流程') {
          this.supplierDispose()
        }
      } else if (this.nodeinfo.flowstate === '等待完成') {
        this.cardName = '完成处理'
        this.showFlowend = true
      } else {
        this.emptyShow = true
      }
    },
    // 供应商的处理
    supplierDispose() {
      if (
        this.nodeinfo.节点名称 === '流程处理2' ||
        this.nodeinfo.节点名称 === '流程处理'
      ) {
        this.cardName = this.nodeinfo.节点名称
        this.showSupplierDispose1 = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
