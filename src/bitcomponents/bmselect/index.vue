<template>
  <el-cascader
    ref="myCascader"
    :style="bmselectwidth"
    filterable
    :debounce="300"
    :options="options"
    :props="defaultProps"
    clearable
    @change="handleChange"
  />
</template>

<script>
export default {
  data() {
    return {
      options: [],
      defaultProps: {
        children: 'children',
        label: 'agencyName',
        value: 'id',
        checkStrictly: true
      },
      bmresultData: {
        bmonevalue: 0,
        bmtwovalue: 0,
        bmthreevalue: 0
      }
    }
  }
}
</script>

<style>
</style>
