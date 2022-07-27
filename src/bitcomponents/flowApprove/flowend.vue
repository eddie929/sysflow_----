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

        <el-form-item label="完成说明">
          <el-input v-model="form.完成说明" type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button @click="btnok">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { insert_handling } from '@/api/flowgeneral'
import { alter_applySubject } from '@/api/budgethandle' // 预算发起修改科目
export default {
  components: {},
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
        完成说明: ''
      }
    }
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },
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
        idea: this.form.完成说明,
        way: '完成',
        type: this.nodeinfo.节点类型
      }
      insert_handling(
        saveData,
        0,
        this.nodeinfo.fk_initiator,
        this.nodeinfo.fk_flowinfo
      ).then(res => {
        if (res.code === 100) {
          // 预算发起完成修改科目状态
          alter_applySubject({
            fk_flow: this.nodeinfo.fk_flow,
            fk_uflow: this.nodeinfo.fk_uflow,
            科目状态: '编制发起已完成'
          }).then(res => {})
          // 调用全局挂载的方法,关闭当前标签页
          this.$store.dispatch('tagsView/delView', this.$route)
          // 返回上一步路由，返回上一个标签页
          this.$router.go(-1)
        }
      })
      return
    }
  }
}
</script>

<style lang="scss" scoped></style>
