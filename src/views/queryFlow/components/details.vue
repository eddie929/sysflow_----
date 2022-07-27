<template>
  <div style="margin: 1%">
    <!-- 流程信息 -->
    <el-card class="box-card" shadow="hover" style="margin-top: 1% ">
      <el-tabs v-model="activeName">
        <el-tab-pane label="流程信息" name="tabflowinfo">
          <moduleFlowInfo ref="moduleFlowInfo" :nodeinfo="flowInfo" />
          <div style="margin-top: 1% ">
            <el-collapse accordion>
              <el-collapse-item title="审批/处理信息">
                <disposeInfo ref="disposeInfo" :nodeinfo="flowInfo" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="流程附件" name="second">附件</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moduleFlowInfo from '@/bitcomponents/moduleFlowInfo/index.vue'
import disposeInfo from '@/bitcomponents/flowApprove/disposeInfo.vue'

export default {
  components: { moduleFlowInfo, disposeInfo },
  data() {
    return {
      flowInfo: {}, // 流程信息
      activeName: 'tabflowinfo' // tabs默认显示
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
      this.flowInfo = this.$route.params.rows
    }
  },
  methods: {
    // 返回上一级
    back() {
      this.warning_box('未获取流程信息')
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped></style>
