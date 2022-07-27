<template>
  <div style="margin: 1%">
    <el-button
      type="primary"
      style="float: left; margin-left: 0px"
      class="el-icon-plus"
      size="small"
      @click="addsubmit"
    >新供应商准入</el-button>

    <el-dialog
      :close-on-click-modal="false"
      top="10vh"
      :visible.sync="addshow"
      width="75%"
      center
      title="新供应商准入"
      class=" dialog"
      @closed="dialogclose"
    >
      <addsupplier
        v-if="flowarr.length > 0"
        ref="addsupplier"
        :flowarr="flowarr"
        @dialogcancel="dialogcancel"
      />
    </el-dialog>

  </div>
</template>

<script>
import addsupplier from './components/addsupplier'
import { get_userflowinit } from '@/api/flowhandle'
import { mapGetters } from 'vuex'
export default {
  components: { addsupplier },
  data() {
    return {
      addshow: false,
      flowarr: []
    }
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },

  // watch: {
  //   userTableRow: {
  //     handler(newValue, oldValue) {
  //
  //     }
  //   }
  // },

  beforeMount() {},
  methods: {
    // 新供应商准入 按钮
    addsubmit() {
      /**
       * 思路：
       * 取出后端当前用户能发起的全部流程信息
       * 把可以发起的流程传入统一方法处理（遍历是否包含当前流程，当前流程需要把名称传过去，跟后端对应）
       * 判断newArr是否有值，有视为可以发起，否则不能发起。
       */

      get_userflowinit({ fk_user: this.id_用户, jointrole: this.角色id }).then(
        res => {
          if (res.code === 100) {
            const arr = res.data
            this.flowarr = this.whetherflowinit(arr, '编制汇总') // 供应商测试流程
            if (this.flowarr.length > 0) {
              this.addshow = true
            } else {
              this.warning_box('您不可以发起此流程！')
            }
          }
        }
      )
    },
    // 关闭窗口
    dialogcancel() {
      this.addshow = false
    },
    // 关闭窗口时回调
    dialogclose() {
      this.$refs.addsupplier.resetForm('form')
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
