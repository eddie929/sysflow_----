<template>
  <div>
    <div>
      <el-input
        v-model="btniffortext"
        :readonly="true"
        placeholder="请选择..."
        style="width: 98%"
        @focus="selectUsers"
      />
      <el-tooltip
        content="如果下一步节点存在分支，将默认遵循系统节点配置人员。如果不选择，默认按照节点配置进行。"
        placement="bottom"
        effect="light"
      >
        <i class="el-icon-warning-outline" style="color: #409eff" />
      </el-tooltip>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      top="10vh"
      :visible.sync="selectuserShow"
      width="1200px"
      center
      title="选择用户"
      class=" dialog"
      append-to-body
      @close="selectUserOpen"
    >
      <selectuser
        ref="selectuser"
        :selection-show="false"
        :user-table-row.sync="userTableRow"
        :selectuser-show.sync="selectuserShow"
        @Userdialogclose="Userdialogclose"
      />
    </el-dialog>
  </div>
</template>

<script>
import selectuser from '@/bitcomponents/selectuser/index'
export default {
  components: { selectuser },
  props: {
    ifforNextShow: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      /*
        以下全部是选择用户字段
       */
      btniffortext: '', // 选择下一步处理人文本
      userTableRow: [], // 绑定的用户
      selectuserShow: false, // 选择用户窗口打开关闭
      fk_user: 0
    }
  },
  watch: {
    userTableRow: {
      //  immediate: true, // 初始化监听
      // deep: true, // 深度监听设置为 true
      handler(newValue, oldValue) {
        if (newValue.id_用户 > 0) {
          this.btniffortext = this.userTableRow.姓名
          this.selectuserShow = false
          this.fk_user = this.userTableRow.id_用户 =
            this.userTableRow.id_用户 !== undefined
              ? this.userTableRow.id_用户
              : 0
        } else {
           this.fk_user = 0
        }
      }
    }
  },

  beforeMount() {},
  methods: {
    // 选择用户
    selectUsers() {
      this.selectuserShow = true
    },
    // 关闭选择用户窗口
    Userdialogclose() {
      this.selectuserShow = false
      this.fk_user = 0
      this.btniffortext = ''
      this.userTableRow = []
      // this.$refs.selectuser.toggleSelection()
    },
    // 打开选择用户窗口时
    selectUserOpen() {
      this.$refs.selectuser.toggleSelection()
    }
  }
}
</script>

<style lang="scss" scoped></style>
