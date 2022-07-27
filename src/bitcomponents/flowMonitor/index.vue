<template>
  <div>
    <div style="margin: 1%; ">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="carbody">
            {{ nodeinfo }}
            <!-- <Time ref="Time" style="max-height: 100vh-200; padding: 5%" /> -->
          </div>
        </el-col>
        <el-col :span="18">
          <el-radio-group
            v-model="radioValue"
            style="margin-bottom: 1%"
            @change="radioChange"
          >
            <el-radio-button label="流程图" />
            <el-radio-button label="流程详细信息" />
            <el-radio-button label="附件" />
          </el-radio-group>
          <el-row>
            <el-col>
              <el-card v-show="radioValue === '流程图' ? true : false">
                <div style="height: 100vh-200">
                  <Panel ref="Panel" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Panel from '@/views/flow_node/components/ef/panel'
export default {
  components: { Panel },

  data() {
    return {
      nodeinfo: {}, // 当前节点信息
      radioValue: '流程图' // 单选绑定文本
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
    radioChange() {}
  }
}
</script>

<style lang="scss" scoped></style>
