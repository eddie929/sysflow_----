<template>
  <div>
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="处理人">
          <el-input v-model="form.username" :readonly="true" />
        </el-form-item>

        <el-form-item label="意见">
          <el-input v-model="form.idea" type="textarea" />
        </el-form-item>
        <el-form-item
          v-show="nodeinfo.选择下一步处理人 === 1"
          label="指定用户"
          label-width="80px"
        >
          <ifforNext ref="ifforNext" />
        </el-form-item>
        <el-form-item>
          <el-button @click="btnok">同意</el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="退回至发起人！"
            placement="top"
          >
            <el-button type="warning" @click="btnno">退回</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ifforNext from '@/bitcomponents/iffor_next/index'
import { insert_handling, flowback } from '@/api/flowgeneral'
import { alter_applySubject } from '@/api/budgethandle' // 预算发起修改科目
export default {
  components: { ifforNext },
  props: {
    nodeinfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        username: '',
        idea: ''
      }
    }
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },
  // watch: {
  //   userTableRow: {
  //     // immediate: true, // 初始化监听
  //     handler(newValue, oldValue) {
  //       this.btniffortext = this.userTableRow.姓名
  //       this.selectuserShow = false
  //     }
  //   }
  // },
  beforeMount() {
    this.form.username = this.$store.getters.姓名
  },
  methods: {
    // 同意
    btnok() {
      const saveData = {
        fk_flow: this.nodeinfo.fk_flow,
        fk_node: this.nodeinfo.fk_node,
        uflow_name: this.nodeinfo.uflow_name,
        fk_uflow: this.nodeinfo.fk_uflow,
        fk_user: this.$store.getters.id_用户,
        idea: this.form.idea,
        way: '同意',
        type: this.nodeinfo.节点类型
      }
      insert_handling(
        saveData,
        this.$refs.ifforNext.fk_user,
        this.nodeinfo.fk_initiator,
        this.nodeinfo.fk_flowinfo
      ).then(res => {
        if (res.code === 100) {
          // 调用全局挂载的方法,关闭当前标签页
          this.$store.dispatch('tagsView/delView', this.$route)
          // 返回上一步路由，返回上一个标签页
          this.$router.go(-1)
        }
      })
      return
      // this.userTableRow.id_用户 =
      //   this.userTableRow.id_用户 !== undefined ? this.userTableRow.id_用户 : 0
      // console.log(this.userTableRow.id_用户)
    },
    // 退回
    btnno() {
      this.$confirm('将此流程退回至发起人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const saveData = {
            fk_flow: this.nodeinfo.fk_flow,
            fk_node: this.nodeinfo.fk_node,
            uflow_name: this.nodeinfo.uflow_name,
            fk_uflow: this.nodeinfo.fk_uflow,
            fk_user: this.$store.getters.id_用户,
            idea: this.form.idea,
            way: '退回',
            type: this.nodeinfo.节点类型
          }
          flowback(
            saveData,
            this.nodeinfo.fk_initiator,
            this.nodeinfo.fk_flowinfo
          ).then(res => {
            if (res.code === 100) {
              // 预算发起退回修改科目状态
              alter_applySubject({
                fk_flow: this.nodeinfo.fk_flow,
                fk_uflow: this.nodeinfo.fk_uflow,
                科目状态: '编制发起已退回'
              }).then(res => {})
              // 调用全局挂载的方法,关闭当前标签页
              this.$store.dispatch('tagsView/delView', this.$route)
              // 返回上一步路由，返回上一个标签页
              this.$router.go(-1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
