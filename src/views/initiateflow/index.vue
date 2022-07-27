<template>
  <div style="margin:50px">
    <el-button type="text" @click="test">测试</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    test() {
      this.$router.push({ path: "/path_Test" });
    }
  }
};
</script>

<style></style>
