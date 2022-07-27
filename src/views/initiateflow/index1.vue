<template>
  <div>
    <el-row
      style="width: 98%; margin: 0 auto; margin-top: 10px; font-size: 15px"
      :gutter="24"
    >
      <el-col
        v-for="item in flowinit"
        :key="item.id"
        :span="6"
        style="
          margin-top: 20px;
          height: 300px;
          min-height: 300px;
          max-height: 300px;
        "
      >
        <el-card
          class="box-card"
          shadow="hover"
          style="background-color: #ecf5ff; max-height: 300px"
        >
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">
              <i :class="ficon(item.name)" /> {{ item.name }}</span>
          </div>
          <div
            v-for="o in item.children"
            :key="o.id"
            class="text item"
            style="color: #409eff; margin-top: 10px"
            @click="click(o)"
          >
            <el-link type="primary">{{ o.name }} </el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get_flowinit, get_userflowinit } from '@/api/flowhandle'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      flowinit: [],
      flowarr: []
    }
  },
  computed: {
    ...mapGetters(['角色id', 'id_用户'])
  },
  beforeMount: function() {
    this.get_flowinit()
  },
  methods: {
    // 发起
    click(val) {
      get_userflowinit({ fk_user: this.id_用户, jointrole: this.角色id }).then(
        res => {
          if (res.code === 100) {
            const arr = res.data
            this.flowarr = this.whetherflowinit(arr, val.name)
            if (this.flowarr.length > 0) {
              this.flowInitOpen(this.flowarr[0], this.$router)
            } else {
              this.warning_box('您不可以发起此流程！')
            }
          }
        }
      )
    },
    // 流程图标
    ficon(val) {
      return 'el-icon-menu'
    },
    // 获取所有流程
    get_flowinit() {
      get_flowinit().then(res => {
        if (res.code === 100) {
          this.flowinit = res.data
        }
      })
    }
  }
}
</script>

<style>
.el-card__body {
  background-color: #fff;
}
</style>
