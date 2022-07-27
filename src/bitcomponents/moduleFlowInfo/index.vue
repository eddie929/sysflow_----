<template>
  <div>
    <supplierInit
      v-if="nodeinfo.流程名称 === '供应商测试流程'"
      ref="supplierInit"
      :nodeinfo="nodeinfo"
    />
    <budgetInit
      v-if="nodeinfo.流程名称 === '编制发起'"
      ref="budgetInit"
      :nodeinfo="nodeinfo"
    />
  </div>
</template>

<script>
import supplierInit from './supplier/index.vue' // 供应商准入
import budgetInit from './budgethandle/budgetInit.vue' // 编制发起
export default {
  components: { supplierInit, budgetInit },
  props: {
    nodeinfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
