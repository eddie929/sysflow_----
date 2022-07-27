<template>
  <div style="margin: 1.5%">
    <el-card>
      <div slot="header" class="clearfix">
        <span>表单填写</span>
      </div>
      <div>
        {{ flowarr }}
        <el-form
          ref="form"
          :label-position="labelPosition"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="标题">
                <label class="lable">{{ form.标题 }} </label></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请部门">
                <label class="lable">{{ this.二级部门名称 }} </label>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人员">
                <label class="lable">{{ this.姓名 }} </label>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 1%">
            <el-col
              :span="8"
            ><el-form-item label="申请日期">
              <label class="lable">{{ form.申请日期 }} </label>
            </el-form-item></el-col>
            <el-col :span="8">
              <el-form-item label="总计(万元)" prop="预算总计">
                <label
                  class="lable"
                  style="color:red;"
                >{{ form.预算总计 }}万
                </label>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 1%" :gutter="24">
            <el-col :span="8">
              <el-form-item label="预算期间" prop="预算期间">
                <el-date-picker
                  v-model="form.预算期间"
                  type="year"
                  placeholder="选择年"
                  value-format="yyyy"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item prop="事由" label="事由">
                <el-input
                  v-model="form.事由"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-show="flowarr.是否允许选择下一处理人 === 1"
            :gutter="12"
            style="margin-top: 1%"
          >
            <el-col :span="24">
              <el-form-item label="指定用户" label-width="80px">
                <ifforNext ref="ifforNext" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider content-position="left">科目信息</el-divider>
        <el-row style="margin-top: 1%">
          <el-table
            v-loading="loading"
            border
            :data="tableData"
            style="width: 95%; margin-top: 20px"
            height="300px"
            :header-cell-style="{
              'text-align': 'center',
              background: '#eef1f6'
            }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column width="55" label="序号" type="index" />
            <el-table-column label="科目" prop="subjects">
              <template slot-scope="{ row, $index }">
                <el-cascader
                  ref="cascader"
                  v-model="row.科目"
                  style="width: 100%"
                  :options="options"
                  filterable
                  :show-all-levels="true"
                  :props="props"
                  @change="cascaderChange($event, $index)"
                />
              </template>
            </el-table-column>
            <el-table-column label="科目描述" prop="remark">
              <template slot-scope="{ row }" style="width: 100%">
                <el-input v-model="row.科目描述" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="科目说明" prop="instructions">
              <template slot-scope="{ row }" style="width: 100%">
                <el-input v-model="row.科目说明" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="申请预算(万元)" prop="unitPrice">
              <template slot-scope="{ row, $index }" style="width: 100%">
                <el-input
                  v-model="row.申请预算"
                  size="small"
                  @keyup.native="handlNumber($index, row.申请预算)"
                  @blur="totalize(row)"
                />
              </template>
            </el-table-column>
            <el-table-column width="100px" align="center" fixed="right">
              <template slot="header">
                <el-button
                  type="text"
                  class="el-icon-plus"
                  size="mini"
                  @click="addrow"
                >添加</el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  class="el-icon-delete"
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.$index, scope.row)"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider content-position="left">项目文档</el-divider>
        </el-row>

        <div
          slot="footer"
          class="dialog-footer"
          style="text-align: center; margin: 2%"
        >
          <el-button @click="resetForm('form')">重 置</el-button>
          <el-button type="primary" @click="submit('form')">提 交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  get_allSubject,
  insert_budgetInit,
  insert_subjectInfo
} from '@/api/budgethandle'
import ifforNext from '@/bitcomponents/iffor_next/index'
export default {
  components: { ifforNext },
  data() {
    return {
      // 表单对齐方向
      labelPosition: 'left',
      // 表单绑定
      form: {
        标题: '',
        申请日期: this.get_nowDate(),
        备注: '',
        部门名称: this.二级部门名称,
        创建者: this.姓名,
        预算总计: 0,
        事由: ''
      },
      // 流程信息
      flowarr: [],
      // 限制输入
      rules: {
        预算期间: [
          { required: true, message: '请选择预算期间', trigger: 'change' }
        ]
      },
      // 等待加载
      loading: false,
      // 表格数据
      tableData: [],
      // 绑定下拉配置
      props: {
        children: 'children',
        label: '名称',
        value: 'id',
        multiple: false,
        checkStrictly: false
      },
      // 科目数据
      options: [],
      三级科目Array: []
    }
  },
  computed: {
    ...mapGetters(['二级部门名称', '一级部门名称', '姓名', 'id_用户'])
  },
  beforeMount() {
    if (
      this.$route.params.rows === undefined ||
      this.$route.params.rows.length <= 0
    ) {
      this.warning_box('未获取流程信息')
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    } else {
      this.flowarr = this.$route.params.rows
      this.showtitle()
    }
  },
  methods: {
    // 获取标题
    showtitle() {
      this.form.标题 = this.get_title(
        this.flowarr.流程名称,
        this.二级部门名称 !== '' ? this.二级部门名称 : this.一级部门名称
      )
    },

    get_allSubject() {
      get_allSubject().then(response => {
        if (response.code === 100) {
          this.options = response.data

          for (const arr一级科目 in this.options) {
            for (const arr二级科目 in this.options[arr一级科目].children) {
              for (const arr三级科目 in this.options[arr一级科目].children[
                arr二级科目
              ].children) {
                this.三级科目Array.push(
                  this.options[arr一级科目].children[arr二级科目].children[
                    arr三级科目
                  ]
                )
              }
            }
          }
        }
      })
    },
    // 添加一行表格数据
    addrow() {
      this.tableData.push({
        科目: '',
        申请预算: '',
        科目说明: '',
        科目描述: ''
      })
      // 查询全部科目
      this.get_allSubject()
    },
    // 表格内选择科目事件  读取说明
    cascaderChange(val, index) {
      // val[2]是三级科目id
      const row三级科目 = this.三级科目Array.find(item => {
        return item.id === val[2]
      })
      this.tableData[index].科目说明 = row三级科目.备注
    },
    // 处理输入申请预算
    handlNumber(index, value) {
      this.tableData[index].申请预算 = this.handleDoble(value)
    },
    // 计算总预算
    totalize(row) {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (!reg.test(row.申请预算)) {
        this.$message({
          message: '请输入正确的金额 !',
          type: 'danger'
        })
        row.申请预算 = ''
        return
      }
      row.申请预算 = parseFloat(row.申请预算)
      let sum = 0
      for (var i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].申请预算 * 100
      }
      this.form.预算总计 = sum / 100
    },
    // 重置数据
    resetForm(form) {
      this.tableData = []
      this.$refs[form].resetFields()
    },
    // 提交
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.tableData.length === 0) {
            this.warning_box('请添加科目信息', '提示')
            return
          }
          /**
           * 判断表格里科目和预算申请
           */
          for (const index in this.tableData) {
            if (this.tableData[index].科目 === '') {
              this.warning_box('请输入科目', '提示')
              return
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
            if (!reg.test(this.tableData[index].申请预算)) {
              this.warning_box('请输入申请预算', '提示')
              return
            }
          }
          /**
           * 选择下一步处理人
           */
          let nexthandler = 0
          if (this.flowarr.是否允许选择下一处理人 === 1) {
            nexthandler = this.$refs.ifforNext.fk_user
          } else {
            nexthandler = 0
          }
          const arr = this.flowarr
          const servedata = {
            fk_flow: arr.fk_flow,
            fk_departmenttwo: this.$store.getters.id_二级部门,
            fk_user: this.id_用户,
            fk_node: arr.fk_node,
            部门名称: this.二级部门名称,
            申请日期: this.form.申请日期,
            创建者: this.姓名,
            标题: this.form.标题,
            备注: this.form.备注,
            // 以上通用字段
            预算期间: parseInt(this.form.预算期间),
            预算总计: parseInt(this.form.预算总计),
            事由: this.form.事由
          }
          insert_budgetInit(servedata, nexthandler).then(res => {
            if (res.code === 100) {
              this.insert_box(res.code)
              // 发送短信
              // this.sendMessage({
              //   uFlowID: res.code,
              //   flowID: this.$route.query.flowid,
              //   hand_way: "发起",
              // });
              const 科目信息 = []
              this.tableData.forEach((item, index, array) => {
                const rowData = {
                  fk_flow: arr.fk_flow,
                  fk_uflow: parseInt(res.resid),
                  uflow_name: arr.数据表名称,
                  fk_node: arr.fk_node,
                  fk_departmenttwo: this.$store.getters.id_二级部门,
                  fk_一级科目: this.tableData[index].科目[0],
                  fk_二级科目: this.tableData[index].科目[1],
                  fk_三级科目: this.tableData[index].科目[2],
                  部门名称: this.二级部门名称,
                  科目描述: this.tableData[index].科目描述,
                  科目说明: this.tableData[index].科目说明,
                  申请预算: parseFloat(this.tableData[index].申请预算),
                  科目状态: '编制发起'
                }
                科目信息.push(rowData)
              })
              insert_subjectInfo(科目信息).then(res => {
                if (res.code === 100) {
                  this.$store.dispatch('tagsView/delView', this.$route)
                  this.$router.go(-1)
                }
              })
            } else if (res.code === 101) {
              this.insert_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.insert_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.insert_box(res.code, res.msg)
              return
            }
          })
        } else {
          return
        }
      })
    },
    // 移除表格数据
      handleDelete(index, row) {
      this.tableData.splice(index, 1)
      row.申请预算 = parseFloat(row.申请预算)
      var sum = 0
      for (var i = 0; i < this.tableData.length; i++) {
        sum += this.tableData[i].申请预算 * 100
      }
      this.form.预算总计 = sum / 100
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  width: 99.9% !important;
}
.lable {
  font-weight: 700; //加粗
  font-size: 15px;
}
</style>
