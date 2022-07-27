<template>
  <div>
    <el-alert
      :title="createLable"
      type="success"
      style="margin: 0px 0px 10px 0px"
    />

    <el-descriptions class="margin-top" :column="3" size="medium" border>
      <el-descriptions-item label="标题" :span="3">
        {{ uflowinfo.标题 }}
      </el-descriptions-item>
      <el-descriptions-item label="供应商名称">{{
        uflowinfo.名称
      }}</el-descriptions-item>
      <el-descriptions-item label="法人">{{
        uflowinfo.法人
      }}</el-descriptions-item>
      <el-descriptions-item label="联系人">
        {{ uflowinfo.联系人 }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ uflowinfo.联系人 }}</el-descriptions-item>
      <el-descriptions-item label="首次承建项目名称">
        {{ uflowinfo.首次承建项目名称 }}</el-descriptions-item>
      <el-descriptions-item label="备注">
        {{ uflowinfo.联系电话 }}</el-descriptions-item>
      <el-descriptions-item label="是否合格">
        {{ uflowinfo.是否合格 }}
      </el-descriptions-item>
      <el-descriptions-item label="资质相关证明文件审查">
        {{ uflowinfo.资质相关证明文件审查 }}
      </el-descriptions-item>
      <el-descriptions-item label="是否两年未合作">
        {{ uflowinfo.是否两年未合作 }}
      </el-descriptions-item>
      <el-descriptions-item label="参与招投标">
        {{ uflowinfo.参与招投标 }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { get_uflow } from '@/api/flowhandle'
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
      是否合格: '是',
      uflowinfo: [],
      createLable: '' // 创建者信息
    }
  },
  beforeMount() {
    this.get_uflow()
  },
  methods: {
    // 查询发起信息
    get_uflow() {
      get_uflow({
        uflow_name: this.nodeinfo.uflow_name,
        fk_uflow: this.nodeinfo.fk_uflow
      }).then(res => {
        if (res.code === 100) {
          this.uflowinfo = res.data[0]
          this.createLable =
            '流程名称：' +
            this.uflowinfo.流程名称 +
            ' | 申请人：' +
            this.uflowinfo.创建者 +
            ' | 申请日期：' +
            this.uflowinfo.申请日期 +
            ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
