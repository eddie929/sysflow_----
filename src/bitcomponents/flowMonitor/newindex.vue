<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <!-- 处理轴 -->
    <transition name="el-zoom-in-top">
      <el-card style="margin: 0px 0px 0px 0px; height: 90vh; ">
        <div slot="header" class="clearfix">
          处理记录
        </div>
        <el-row style="margin: 0px 10px 0px 0px; height: 100%; width: 300px">
          <el-col :span="24">
            <!-- {{ nodeinfo }} -->
            <disposeInfo ref="disposeInfo" :nodeinfo="nodeinfo" style="margin: 10px 0px 0px -30px; " />
          </el-col>
        </el-row>
      </el-card>
    </transition>
    <!-- 流程图等... -->
    <el-container style="height: 90vh">
      <el-main>
        <el-row style="margin: 0px 0px 0px 20px;  ">
          <el-tabs
            v-model="tabsValue"
            style="margin: -0.5%;"
            @tab-click="handleTabsClick"
          >
            <el-tab-pane label="流程节点图" name="流程图">
              <Panel ref="Panel" />
            </el-tab-pane>
            <!-- 配置数据表 -->
            <el-tab-pane
              label="流程详细信息"
              name="流程详细信息"
              :disabled="true"
            />
            <el-tab-pane label="附件" name="附件" :disabled="true" />
          </el-tabs>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from '@/views/flow_node/components/ef/panel'
import disposeInfo from '@/bitcomponents/flowApprove/disposeInfo.vue'

export default {
  components: { Panel, disposeInfo },
  data() {
    return {
      nodeinfo: {}, // 当前节点信息
      tabsValue: '流程图' // 单选绑定文本
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
      return
    } else {
      this.nodeinfo = this.$route.params.rows
    }
  },
  mounted: function() {
    this.$refs.Panel.getFlowMonitor(this.nodeinfo)
    this.$refs.Panel.showform = false
    this.$refs.Panel.showmenu = false
    this.$refs.Panel.topShow = false
  },
  methods: {
    // 单选点击事件
    radioChange() {},
    // tab点击
    handleTabsClick() {}
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
