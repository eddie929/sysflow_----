<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <!-- 树 -->
    <transition name="el-zoom-in-top">
      <el-card style="margin: 0px 0px 0px 0px; height: 90vh; ">
        <div slot="header" class="clearfix">
          <el-button
            type="primary"
            plain
            size="mini"
            style="margin-left: 10px"
            icon="el-icon-circle-plus"
            @click="newcategory()"
          >新建类别</el-button>
        </div>

        <el-row style="margin: 0px 10px 0px 0px; height: 100%; width: 300px">
          <el-col :span="24">
            <el-tree
              ref="tree"
              v-loading="treeloading"
              :data="treedata"
              :props="defaultProps"
              :highlight-current="true"
              node-key="id"
              accordion
              class="filter-tree"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    v-if="data.str_level === '一级'"
                    type="text"
                    size="mini"
                    icon="el-icon-plus"
                    @click="newflow(data)"
                  >新建流程
                  </el-button>
                  <!-- <el-button
                    v-if="data.str_level === '二级'"
                    type="text"
                    size="mini"
                    icon="el-icon-plus"
                    @click="newflow(data)"
                  >新建流程</el-button> -->
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-card>
    </transition>
    <!-- 编辑 删除等... -->
    <el-container style="height: 90vh">
      <el-main>
        <el-row style="margin: 0px 0px 0px 20px;  ">
          <el-tabs v-model="activeName" @tab-click="handleTabsClick">
            <el-tab-pane label="基本信息" name="first">
              <el-form
                ref="formflow"
                :model="flowinfo"
                :label-position="labelPosition"
                :rules="rules"
              >
                <el-form-item
                  label="名称"
                  :label-width="formLabelWidth"
                  prop="name"
                >
                  <el-input v-model="flowinfo.name" autocomplete="off" />
                </el-form-item>
                <el-form-item
                  label="备注"
                  :label-width="formLabelWidth"
                  prop="remark"
                >
                  <el-input
                    v-model="flowinfo.remark"
                    autocomplete="off"
                    clearable
                    placeholder="请输入内容"
                  />
                </el-form-item>
                <el-form-item style="float: left">
                  <el-button
                    type="primary"
                    icon="el-icon-check"
                    size="small"
                    @click="altersubmit('formflow')"
                  >保存</el-button>
                  <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                    @click="deletesubmit()"
                  >删除</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!-- 配置数据表 -->
            <el-tab-pane label="绑定数据表" name="second" :disabled="tabsShow">
              <el-form
                ref="configForm"
                :model="configFlowinfo"
                :label-position="labelPosition"
                :rules="selectrules"
              >
                <el-form-item
                  style="margin-bottom: 10px"
                  :label="'流程名称：' + flowinfo.name"
                >
                  <!-- <el-link type="warning" disabled>流程名称：123213</el-link> -->
                </el-form-item>
                <el-form-item>
                  <el-switch
                    v-model="switchType"
                    style="display: block"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="子表"
                    inactive-text="主表"
                    @change="switchchange"
                  />
                </el-form-item>
                <el-form-item
                  label="表名"
                  :label-width="formLabelWidth"
                  prop="name"
                >
                  <el-select
                    v-model="configFlowinfo.name"
                    filterable
                    placeholder="请选择"
                    autocomplete="off"
                    style="width: 400px "
                  >
                    <el-option
                      v-for="item in flowoptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                  <el-input
                    v-model="configFlowinfo.remark"
                    autocomplete="off"
                    clearable
                    placeholder="请输入内容"
                    style="width: 400px "
                  />
                </el-form-item>
                <el-form-item>
                  <el-link type="info" disabled>已绑定信息：</el-link>
                  <!-- 表格 -->

                  <el-table
                    v-loading="loading"
                    :data="tableData"
                    style="width: 80%"
                    :highlight-current-row="true"
                    border
                    stripe
                    :fit="true"
                    :header-cell-style="{
                      'text-align': 'center',
                      background: '#eef1f6'
                    }"
                    :cell-style="{ 'text-align': 'center' }"
                  >
                    <el-table-column v-if="false" prop="id" label="id" />
                    <el-table-column
                      prop="name"
                      label="表名"
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column
                      prop="remark"
                      label="备注"
                      :show-overflow-tooltip="true"
                    />

                    <el-table-column
                      prop="type"
                      label="类型"
                      :show-overflow-tooltip="true"
                    >
                      <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                          <el-tag
                            size="medium"
                            :type="
                              scope.row.type == '主表' ? 'success' : 'info'
                            "
                          >{{ scope.row.type }}</el-tag>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="180">
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          size="mini"
                          plain
                          class="el-icon-delete"
                          @click="handledelete(scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>

                <el-form-item style="float: left">
                  <el-button
                    icon="el-icon-edit"
                    @click="flowconfigsubmit('configForm')"
                  >保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-main>
    </el-container>
    <!-- 创建 -->
    <el-dialog
      top="15vh"
      :title="dialogtitle"
      :visible.sync="newcategoryshow"
      width="30%"
      center
      @close="dialogclose"
    >
      <el-form
        ref="ruleForm"
        :model="newform"
        :label-position="labelPosition"
        :rules="rules"
      >
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input
            v-model="newform.name"
            autocomplete="off"
            clearable
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input
            v-model="newform.remark"
            autocomplete="off"
            clearable
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="el-icon-check"
          size="small"
          @click="submitadd('ruleForm')"
        >
          保 存</el-button>
        <el-button
          class="el-icon-close"
          size="small"
          @click="newcategoryshow = false"
        >
          取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  get_flowinit,
  insert_flowcategory,
  insert_flow,
  alter_flow,
  del_flow
} from '@/api/flowhandle'
import {
  get_flowInfo,
  insert_flowInfo,
  get_flowinfodata,
  del_flowInfo
} from '@/api/flowgeneral'

export default {
  data() {
    return {
      treedata: [], // 树数据
      treeloading: false, // 树加载动画
      defaultProps: {
        // 树结构
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      fk_flow: 0, // 流程ID
      activeName: 'first',
      tabsShow: true, // 配置数据表默认禁用，二级的时侯开启
      flowinfo: {
        name: '',
        remark: ''
      },
      labelPosition: 'left', // 对齐方向
      formLabelWidth: '50px', // label宽度
      newcategoryshow: false,
      // 创建类别
      newform: {
        name: '',
        remark: '',
        str_level: '',
        fk_category: 0
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      selectrules: {
        name: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      dialogtitle: '',
      configFlowinfo: {
        name: '', // 表名称
        fk_flow: 0,
        type: '主表',
        remark: ''
      }, // 配置流程数据表数据
      flowoptions: [],
      switchType: false, // 开关绑定
      loading: false, // 表格加载
      tableData: [] // 表格数据
    }
  },
  beforeMount() {
    this.get_flowinit()
  },
  methods: {
    // 点击树中  某一流程
    handleNodeClick(val) {
      if (val.str_level === '一级') {
        this.tabsShow = true // 关闭配置数据表
        this.flowinfo.id = val.id
        this.flowinfo.name = val.name
        this.flowinfo.remark = val.remark
        this.flowinfo.str_level = val.str_level
        this.activeName = 'first'
      } else {
        this.tabsShow = false // 显示配置数据表
        this.flowinfo.id = val.id
        this.flowinfo.name = val.name
        this.flowinfo.remark = val.remark
        this.flowinfo.str_level = val.str_level
        this.flowinfo.fk_category = val.fk_category
        this.configFlowinfo.fk_flow = val.id
        this.get_flowinfodata()
      }
    },
    // 新建流程类别
    newcategory(data) {
      this.newform.str_level = '一级'
      this.dialogtitle = '新建流程类别'
      this.newcategoryshow = true
    },
    // 新建流程
    newflow(data) {
      this.newform.str_level = '二级'
      this.newform.fk_category = data.id
      this.dialogtitle = '新建流程'
      this.newcategoryshow = true
    },
    // 创建流程
    submitadd(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.newform.str_level === '一级') {
            insert_flowcategory(this.newform).then(res => {
              if (res.code === 100) {
                this.insert_box(res.code, '类别创建成功')
                this.newcategoryshow = false
                this.get_flowinit()
              } else if (res.code === 101) {
                this.insert_box(res.code, '')
                return
              } else if (res.code === 102) {
                this.insert_box(res.code, '')
                return
              } else if (res.code === -1) {
                this.insert_box(res.code, '')
                return
              }
            })
          } else {
            // 二级
            insert_flow(this.newform).then(res => {
              if (res.code === 100) {
                this.insert_box(res.code, '流程创建成功')
                this.newcategoryshow = false
                this.get_flowinit()
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
          }
        } else {
          // 验证未通过
          return false
        }
      })
    },
    // 窗口关闭回调
    dialogclose() {
      // 清空数据
      this.newform = {}
    },
    // 初始加载所有流程
    get_flowinit() {
      this.treeloading = true
      get_flowinit().then(res => {
        if (res.code === 100) {
          this.treedata = res.data
          this.treeloading = false
        }
      })
    },
    // 点击标签页
    handleTabsClick(tab, event) {
      if (tab.label === '绑定数据表') {
        this.configFlowinfo.name = ''
        this.configFlowinfo.remark = ''
        this.configFlowinfo.type = '主表'
        this.get_flowInfo()
        this.get_flowinfodata()
      }
    },
    // 点击开关
    switchchange(para) {
      this.configFlowinfo.name = ''
      if (para === false) {
        this.configFlowinfo.type = '主表'
      } else {
        this.configFlowinfo.type = '子表'
      }
      this.get_flowInfo()
    },
    // 加载主表/子表数据
    get_flowInfo() {
      get_flowInfo({ type: this.configFlowinfo.type }).then(res => {
        if (res.code === 100) {
          this.flowoptions = res.data
        }
      })
    },
    // 提交绑定
    flowconfigsubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.insert_flowInfo()
        } else {
          // 未选择表名
        }
      })
    },
    // 创建流程配置数据表
    insert_flowInfo() {
      insert_flowInfo(this.configFlowinfo).then(res => {
        if (res.code === 100) {
          this.get_flowinfodata()
          this.insert_box(res.code)
          this.configFlowinfo.name = ''
          this.configFlowinfo.remark = ''
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
    },
    // 查询已绑定数据表的流程
    get_flowinfodata() {
      this.loading = true
      get_flowinfodata({ fk_flow: this.configFlowinfo.fk_flow }).then(res => {
        if (res.code === 100) {
          this.loading = false
          this.tableData = res.data
        }
      })
    },
    // 删除已绑定数据表
    handledelete(row) {
      del_flowInfo({ id: row.id }).then(res => {
        if (res.code === 100) {
          this.get_flowinfodata()
          this.del_box(res.code, '删除成功')
        } else if (res.code === 101) {
          this.del_box(res.code, res.msg)
          return
        } else if (res.code === 102) {
          this.del_box(res.code, res.msg)
          return
        } else if (res.code === -1) {
          this.del_box(res.code, res.msg)
          return
        }
      })
    },
    // 修改流程类别，流程
    altersubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alter_flow(this.flowinfo).then(res => {
            if (res.code === 100) {
              this.alter_box(res.code, '修改成功')
              this.get_flowinit()
              this.flowinfo.name = ''
              this.flowinfo.remark = ''
            } else if (res.code === 101) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.alter_box(res.code, res.msg)
              return
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除流程类别，流程
    deletesubmit() {
      if (this.flowinfo.id <= 0) {
        this.del_box(110, '请选择')
        return
      }
      this.$confirm('确定删除' + this.flowinfo.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: this.flowinfo.id,
            str_level: this.flowinfo.str_level
          }
          del_flow(data).then(res => {
            if (res.code === 100) {
              this.del_box(res.code, '删除成功')
              this.flowinfo.name = ''
              this.flowinfo.remark = ''
              this.flowinfo.id = 0
              this.flowinfo.str_level = ''
              this.get_flowinit()
            } else if (res.code === 101) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              this.alter_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              this.alter_box(res.code, res.msg)
              return
            }
          })
        })
        .catch(() => {})
      return
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
