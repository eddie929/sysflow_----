<template>
  <div>
    <div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="left"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="处理人">
              <el-input v-model="form.username" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意见">
              <el-input
                v-model="form.idea"
                :readonly="fromReadonly"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 1%">
          <el-col :span="12">
            <el-form-item label="测试字段1">
              <el-input
                v-model="form.test_field1"
                :readonly="fromReadonly"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试字段2">
              <el-input
                v-model="form.test_field2"
                :readonly="fromReadonly"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          v-show="nodeinfo.选择下一步处理人 === 1"
          label="指定用户"
          label-width="80px"
        >
          <ifforNext ref="ifforNext" />
        </el-form-item>
        <el-form-item style="margin-top: 1% ">
          <el-button v-if="optype == '处理'" @click="btnok">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ifforNext from '@/bitcomponents/iffor_next/index'
import { insert_ssupplier } from '@/api/supplierhandle'
import { insert_handling } from '@/api/flowgeneral'
export default {
  components: { ifforNext },
  props: {
    nodeinfo: {
      type: Object,
      default: () => ({})
    },
    optype: {
      type: String,
      default: () => ''
    },
    resdata: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        username: '',
        idea: '',
        test_field1: '',
        test_field2: ''
      },
      fromReadonly: false
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
    if (this.optype === '处理') {
      this.form.username = this.$store.getters.姓名
      this.fromReadonly = false
    } else {
      // 查看读取查看处理接口
      this.fromReadonly = true
      this.form.username = this.resdata.username
      this.form.idea = this.resdata.idea
      this.form.test_field1 = this.resdata.test_field1
      this.form.test_field2 = this.resdata.test_field2
    }
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
        way: '处理',
        type: this.nodeinfo.节点类型
      }
      insert_handling(
        saveData,
        0,
        this.nodeinfo.fk_initiator,
        this.nodeinfo.fk_flowinfo
      ).then(res => {
        if (res.code === 100) {
          // 插入个性化处理
          const sflowData = {
            fk_flow: this.nodeinfo.fk_flow,
            fk_node: this.nodeinfo.fk_node,
            uflow_name: this.nodeinfo.uflow_name,
            fk_uflow: this.nodeinfo.fk_uflow,
            fk_user: this.$store.getters.id_用户,
            username: this.$store.getters.姓名,
            fk_initiator: this.nodeinfo.fk_initiator,
            idea: this.form.idea,
            test_field1: this.form.test_field1,
            test_field2: this.form.test_field2
          }
          insert_ssupplier(sflowData).then(res => {
            if (res.code === 100) {
              // 调用全局挂载的方法,关闭当前标签页
              this.$store.dispatch('tagsView/delView', this.$route)
              // 返回上一步路由，返回上一个标签页
              this.$router.go(-1)
            }
          })
        }
      })
      return
    }
  }
}
</script>

<style lang="scss" scoped></style>
