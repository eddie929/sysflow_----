<template>
  <div>
    <el-alert
      :title="createLable"
      type="success"
      style="margin: 0px 0px 10px 0px"
    />
    <el-descriptions class="margin-top" :column="3" size="medium" border>
      <el-descriptions-item label="标题">
        <label> {{ uflowinfo.标题 }}</label>
      </el-descriptions-item>
      <el-descriptions-item label="申请部门">
        <label> {{ uflowinfo.部门名称 }}</label>
      </el-descriptions-item>
      <el-descriptions-item label="申请人员">
        <label> {{ uflowinfo.创建者 }}</label></el-descriptions-item>
      <el-descriptions-item label="申请日期">
        <label> {{ uflowinfo.申请日期 }}</label>
      </el-descriptions-item>
      <el-descriptions-item label="总计(万元)">
        <label style="color:red">
          {{ uflowinfo.预算总计 }}万</label></el-descriptions-item>
      <el-descriptions-item label="预算期间">
        <label> {{ uflowinfo.预算期间 }}</label></el-descriptions-item>
      <el-descriptions-item label="事由" :span="3">
        <label> {{ uflowinfo.事由 }}</label></el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">科目信息</el-divider>

    <el-row :gutter="24" style="margin-top: 2%">
      <el-col :offset="0" :span="6">
        <div style="float: left; margin-left: 10px">
          <el-switch
            v-model="subjectValue"
            active-text="科目汇总"
            inactive-text="科目明细"
            active-color="#006000"
            inactive-color="#6C3365"
            @change="changeSwitch"
          />
        </div>
      </el-col>
    </el-row>

    <el-table
      v-if="subjectValue === false ? true : false"
      ref="table"
      v-loading="loading"
      :data="tableData"
      max-height="800"
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 1%"
    >
      <el-table-column v-if="false" prop="id" label="id" />
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :reserve-selection="true"
        align="center"
      />
      <el-table-column
        label="科目"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.一级科目名称 }}/{{ row.二级科目名称 }}/{{ row.三级科目名称 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="科目描述"
        label="科目描述"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="科目说明"
        label="科目说明"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="申请预算str"
        label="申请预算(万元)"
        :show-overflow-tooltip="true"
        align="center"
      />
    </el-table>

    <el-table
      v-if="subjectValue !== false ? true : false"
      ref="table"
      v-loading="loading"
      :data="gathertableData"
      max-height="800"
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 1%"
    >
      <el-table-column
        label="汇总科目"
        :show-overflow-tooltip="true"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.一级科目名称 }}/{{ row.二级科目名称 }}/{{ row.三级科目名称 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="申请预算"
        label="汇总预算(万元)"
        :show-overflow-tooltip="true"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>
import { get_uflow } from '@/api/flowhandle'
import { get_applySubject, get_gatherSubject } from '@/api/budgethandle'

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
      createLable: '', // 创建者信息
      tableData: [], // 表格信息
      gathertableData: [], // 科目汇总信息
      loading: false,
      subjectValue: false // 单选切换
    }
  },
  beforeMount() {
    this.get_uflow()
    this.get_applySubject()
    this.get_gatherSubject()
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
    },
    // 科目汇总
    get_gatherSubject() {
      this.loading = true
      get_gatherSubject({
        fk_flow: this.nodeinfo.fk_flow,
        fk_uflow: this.nodeinfo.fk_uflow,
        ids: '',
        科目状态: ''
      }).then(res => {
        if (res.code === 100) {
          this.loading = false
          this.gathertableData = res.data
        }
      })
      this.loading = false
    },

    // 查询申请科目
    get_applySubject() {
      this.loading = true
      get_applySubject({
        fk_flow: this.nodeinfo.fk_flow,
        fk_uflow: this.nodeinfo.fk_uflow
      }).then(res => {
        if (res.code === 100) {
          this.loading = false
          this.tableData = res.data
        }
      })
      this.loading = false
    },

    // 开关切换
    changeSwitch(val) {

    }
  }
}
</script>

<style lang="scss" scoped></style>
