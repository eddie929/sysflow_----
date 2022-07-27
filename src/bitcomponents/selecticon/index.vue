<template>
  <div>
    <el-select v-model="icon" placeholder="请选择" @change="iconChange">
      <el-option
        v-for="(item, name) in icon_option"
        :key="name"
        :value="item.id"
        :label="item.name"
      >
        <span style="float: left;color:yello;">
          <i :class="item.name" />
        </span>
        <span style="float: right; color: #8492a6; font-size: 13px">
          {{ item.name }}
        </span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { get_icon } from '@/api/flowhandle'
export default {
  props: {
    // 判断是否需要验证是否有节点
    typename: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icon: '',
      icon_option: [],
      selectvalue: []
    }
  },
  beforeMount() {
    this.get_icon()
  },
  methods: {
    // 查询节点所有图标
    get_icon() {
      get_icon().then(res => {
        if (res.code === 100) {
          this.icon_option = res.data
        }
      })
    },
    iconChange(val) {
      if (this.typename === 'node_form') {
        // 以此类推，外层包裹了几个组件就需要几个$parent
        if (this.$parent.$parent.$parent.node.id > 0) {
          this.selectvalue = this.title = this.icon_option.find(
            item => item.id === val
          )
          this.$emit('bindingicon', this.selectvalue.id, this.selectvalue.name)
        } else {
          this.$message({
            message: '请选择节点',
            type: 'warning'
          })
          // 清空
          this.icon = ''
          this.selectvalue = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
