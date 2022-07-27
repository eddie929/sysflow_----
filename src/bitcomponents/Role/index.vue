<template>
  <el-select
    v-model="value"
    clearable
    placeholder="请选择系统角色"
    value-key="id"
    multiple
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { get_userrole } from '@/api/userhandle'
export default {
  props: {
    // 编辑用户时用到
    userinfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [],
      value: []
    }
  },
  watch: {
    userinfo: {
      immediate: true, // 初始化监听
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          const strArr = newValue.角色id.split(',')
          var intArr = []
          for (let i = 0; i < strArr.length; i++) {
              intArr.push(parseInt(strArr[i]))
          }
           this.value = intArr
        }
      }
    }
  },
  beforeMount() {
    this.get_userrole()
  },
  methods: {
    get_userrole() {
      get_userrole().then(res => {
        this.options = res.data
      })
    },
    change(val) {
      this.$emit('optionRole', val)
    }
  }
}
</script>

<style></style>
