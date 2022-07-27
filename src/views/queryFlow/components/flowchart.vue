<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <!-- 流程图等... -->
    <el-container style="height: 90vh">
      <el-main>
        <el-row style="margin: 0px 0px 0px 20px;  ">
          {{ nodeinfo }}
          <Panel v-if="nodeinfo.fk_flow > 0" ref="Panel" />
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from '@/views/flow_node/components/ef/panel'
export default {
  components: { Panel },
  props: {
    nodeinfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },

  beforeMount() {},
  mounted: function() {
    if (this.nodeinfo.fk_flow > 0) {
      this.$refs.Panel.getFlowMonitor(this.nodeinfo)
      this.$refs.Panel.showform = false
      this.$refs.Panel.showmenu = false
      this.$refs.Panel.topShow = false
    }
  },
  methods: {}
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
