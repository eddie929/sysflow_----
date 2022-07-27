<template>
  <div>
    <div class="ef-node-form">
      <div class="ef-node-form-header">节点详细信息</div>
      <div class="ef-node-form-body" style="padding-left: 10px">
        <el-form
          v-show="type === 'node'"
          ref="dataForm"
          :model="node"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="类型">
            <el-input v-model="node.type" :disabled="true" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="node.name" />
          </el-form-item>
          <el-form-item v-if="false" label="left坐标">
            <el-input v-model="node.left" :disabled="true" />
          </el-form-item>
          <el-form-item v-if="false" label="top坐标">
            <el-input v-model="node.top" :disabled="true" />
          </el-form-item>

          <el-form-item label="图标">
            <selecticon
              ref="selecticon"
              typename="node_form"
              @bindingicon="bindingicon"
            />
          </el-form-item>

          <el-form-item label="节点状态">
            <el-input v-model="style" placeholder="请输入" />
          </el-form-item>

          <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, name) in icon_option"
                :key="name"
                :icon="item.name"
                :command="item"
              >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu> -->

          <!-- <el-form-item label="图标">
            <el-input v-model="node.ico" style="" disabled />
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link" style="color: #409eff">
                选择<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, name) in icon_option"
                  :key="name"
                  :icon="item.name"
                  :command="item"
                >{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item> -->
          <el-form-item label="选择用户">
            <el-button
              type="text"
              :disabled="binding_type"
              @click="selectUsers"
            >选择...</el-button>
          </el-form-item>

          <el-form-item label="选择职务">
            <el-button
              type="text"
              :disabled="binding_type"
              @click="selectRole"
            >选择...</el-button>
          </el-form-item>

          <el-form-item label="处理范围">
            <el-radio
              v-model="outside"
              label="1"
              @change="outsideradio"
            >外部处理</el-radio>
            <el-radio
              v-model="outside"
              label="0"
              @change="outsideradio"
            >内部处理</el-radio>
          </el-form-item>

          <el-form-item label="所有人均可发起/处理" label-width="150px">
            <el-checkbox
              v-model="binding_type"
              @change="bindingtype_change"
            >是</el-checkbox>
            <el-tooltip
              content="默认否！选择“是”其他选项则失效！"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-warning-outline" style="color: #409eff" />
            </el-tooltip>
          </el-form-item>

          <!-- <el-form-item label="允许选择代办人" label-width="120px">
            <el-checkbox v-model="iffor_someone">允许</el-checkbox>
            <el-tooltip
              content="默认可以选择代办人，选择后由代办人进行处理，节点处理人和代办人都会留下处理痕迹。"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-warning-outline" style="color: #409eff" />
            </el-tooltip>
          </el-form-item> -->

          <el-form-item label="自定义下一步处理人" label-width="150px">
            <el-checkbox v-model="iffor_next">允许</el-checkbox>
            <el-tooltip
              content="如果下一步节点存在分支，将不允许选择下一步处理人，默认遵循系统节点配置人员。"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-warning-outline" style="color: #409eff" />
            </el-tooltip>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-check"
              size="small"
              @click="save"
            >保存</el-button>
            <el-button
              icon="el-icon-close"
              type="danger"
              size="small"
              @click="deletenode"
            >删除</el-button>
          </el-form-item>
        </el-form>

        <el-form
          v-show="type === 'line'"
          ref="dataForm"
          :model="line"
          label-width="80px"
        >
          <el-form-item label="标题">
            <el-input v-model="line.title" />
          </el-form-item>

          <el-form-item>
            <el-button type="text" @click="selectLine">编辑分支条件</el-button>
          </el-form-item>
          <!-- <el-form-item label="线条件">
            <el-input
              ref="inputLine"
              v-model="inputLineValue"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              @focus="selectLine"
              @input="updateView($event)"
            />
          </el-form-item> -->

          <!-- <el-form-item label="字段名">
            <el-tooltip
              content="选择下一步处理人，默认遵循系统节点配置人员"
              placement="bottom"
              effect="light"
            >
              <i class="el-icon-warning-outline" style="color: #409eff" />
            </el-tooltip>
          </el-form-item> -->

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-check"
              size="small"
              @click="saveLine"
            >保存</el-button>
            <el-button
              icon="el-icon-close"
              type="danger"
              size="small"
              @click="deleteline"
            >删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <selectnodeuser
      ref="selectnodeuser"
      :usertablerow.sync="userTableRow"
      :roletablerow.sync="roleTableRow"
      @allTableRowWay="allTableRowWay"
    /> -->
    <linecondition ref="linecondition" />
    <!-- 绑定用户窗口 -->
    <el-dialog
      v-if="userdialog_flag"
      :visible.sync="userdialog_flag"
      center
      width="85%"
      title="分配操作节点用户"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-divider content-position="center">未绑定用户</el-divider>
            <notbindinguser
              ref="notbindinguser"
              :nodeid="parseInt(node.id)"
              :user-table-row.sync="userTableRow"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-divider content-position="center">已绑定用户</el-divider>
            <isbindinguser
              ref="isbindinguser"
              :nodeid="parseInt(node.id)"
              :notuser-table-row.sync="notuserTableRow"
            />
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 绑定角色窗口 -->
    <el-dialog
      v-if="roledialog_flag"
      :visible.sync="roledialog_flag"
      center
      width="85%"
      title="分配操作节点角色"
    >
      <el-row :gutter="50">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-divider content-position="center">未绑定角色</el-divider>
            <notbindingrole
              ref="notbindingrole"
              :role-table-row.sync="roleTableRow"
              :nodeid="parseInt(node.id)"
            />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-divider content-position="center">已绑定角色</el-divider>
            <bindingrole
              ref="bindingrole"
              :nodeid="parseInt(node.id)"
              :notrole-table-row.sync="notroleTableRow"
            />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import linecondition from '../linecondition/index.vue'
import { cloneDeep } from 'lodash'
import selecticon from '@/bitcomponents/selecticon/index'
import isbindinguser from './components/bindinguser'
import notbindinguser from './components/notbindinguser'
import bindingrole from './components/bindingrole'
import notbindingrole from './components/notbindingrole'
import { insert_nodebinding, del_nodebinding } from '@/api/flowhandle'
export default {
  name: 'Nodeform',
  components: {
    linecondition,
    selecticon,
    isbindinguser,
    notbindinguser,
    bindingrole,
    notbindingrole
  },
  data() {
    return {
      userdialog_flag: false, // 选择用户窗口显示隐藏
      roledialog_flag: false, // 选择角色窗口显示隐藏
      visible: true,
      type: 'node',
      inputUsersValue: '',
      outside: '1', // 1是 0否 默认外部
      style: '', // 节点状态
      iffor_next: false, // 是否允许选择下一处理人
      binding_type: false, // 绑定类型是否全部 否认否
      line: {},
      nodedata: {},
      node: {},
      // 绑定 信息
      // bindingList: {
      //   binding_name: '',
      //   binding_type: '' // 绑定类型
      // },
      bindingArr: [],
      // 节点状态
      stateList: [
        {
          state: 'success',
          label: '成功'
        },
        {
          state: 'warning',
          label: '警告'
        },
        {
          state: 'error',
          label: '错误'
        },
        {
          state: 'running',
          label: '运行中'
        }
      ],
      userTableRow: [], // 绑定的用户
      notuserTableRow: [], // 移除的用户
      roleTableRow: [], // 绑定的角色
      notroleTableRow: [], // 移除的角色
      allTableRow: '' // 选择全部
    }
  },
  watch: {
    // 绑定用户
    userTableRow: {
      handler(newValue, oldValue) {
        this.bindingArr = []
        // 保留数组 如果又需求多选稍加改动就可以
        const newList = {
          fk_user: newValue.id_用户,
          binding_type: '用户',
          fk_role: 0,
          fk_flow: parseInt(this.node.fk_flow),
          fk_node: parseInt(this.node.id)
        }
        this.bindingArr.push(newList)
        // this.$emit('add_nodebinding', this.bindingArr)

        insert_nodebinding(this.bindingArr).then(res => {
          this.alter_box(res.code, '添加成功!')
          this.$refs.notbindinguser.get_bindinguser()
          this.$refs.isbindinguser.get_bindinguser()
        })
      }
    },
    // 移除用户
    notuserTableRow: {
      handler(newValue, oldValue) {
        const deldata = {
          fk_flow: parseInt(this.node.fk_flow),
          fk_node: parseInt(this.node.id),
          binding_type: '用户',
          id: newValue.id_用户
        }
        del_nodebinding(deldata).then(res => {
          this.del_box(res.code, '删除成功!')
          this.$refs.notbindinguser.get_bindinguser()
          this.$refs.isbindinguser.get_bindinguser()
        })
      }
    },
    // 绑定角色
    roleTableRow: {
      handler(newValue, oldValue) {
        this.bindingArr = []
        // 保留数组 如果又需求多选稍加改动就可以
        const newList = {
          fk_user: 0,
          binding_type: '角色',
          fk_role: newValue.id,
          fk_flow: parseInt(this.node.fk_flow),
          fk_node: parseInt(this.node.id)
        }
        this.bindingArr.push(newList)
        insert_nodebinding(this.bindingArr).then(res => {
          this.alter_box(res.code, '添加成功!')
          this.$refs.notbindingrole.get_bindingrole()
          this.$refs.bindingrole.get_bindingrole()
        })
      }
    },
    // 移除角色
    notroleTableRow: {
      handler(newValue, oldValue) {
        const deldata = {
          fk_flow: parseInt(this.node.fk_flow),
          fk_node: parseInt(this.node.id),
          binding_type: '角色',
          id: newValue.id
        }
        del_nodebinding(deldata).then(res => {
          this.del_box(res.code, '删除成功!')
          this.$refs.notbindingrole.get_bindingrole()
          this.$refs.bindingrole.get_bindingrole()
        })
      }
    }
  },

  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    nodeInit(data, id) {
      this.type = 'node'
      this.nodedata = data
      data.nodeList.filter(node => {
        if (node.id === id) {
          this.node = cloneDeep(node)
          this.$refs.selecticon.icon = this.node.ico
          this.outside = this.node.outside
          this.style = this.node.style
          if (this.node.iffor_next === 1) {
            this.iffor_next = true
          } else {
            this.iffor_next = false
          }
          if (parseInt(this.node.binding_type) === 1) {
            this.binding_type = true
          } else {
            this.binding_type = false
          }
        }
      })
    },
    lineInit(line) {
      this.type = 'line'
      this.line = line
    },
    // 解决双向绑定失效
    updateView(e) {
      this.$forceUpdate()
    },

    // 点击选择用户 绑定
    selectUsers() {
      if (this.nodedata.id === undefined) {
        this.$message({
          message: '请选择节点!',
          type: 'warning'
        })
        return
      }
      this.userdialog_flag = true
      this.bindingList = {}
    },
    // 点击选择职务 绑定
    selectRole() {
      if (this.nodedata.id === undefined) {
        this.$message({
          message: '请选择节点!',
          type: 'warning'
        })
        return
      }
      this.roledialog_flag = true
    },
    // 编辑线条件
    selectLine() {
      if (this.line.id === undefined) {
        this.$message({
          message: '请选择连线!',
          type: 'warning'
        })
        this.$refs.inputLine.blur()
        return
      }
      this.$refs.linecondition.dialogline_flag = true
      this.$refs.linecondition.lineinfo = this.line
    },

    // 删除节点
    deletenode() {
      if (this.node.id === undefined) {
        this.$message({
          message: '请选择要删除节点!',
          type: 'warning'
        })
        return
      }
      this.$emit('deleteElement', this.node)
    },
    // 删除连线
    deleteline() {
      this.$emit('deleteElement', this.line)
    },
    // 修改连线
    saveLine() {
      this.$emit(
        'setLineLabel',
        this.line.fk_my,
        this.line.fk_tonode,
        this.line.title
      )
    },
    // 保存
    save() {
      try {
        this.nodedata.nodeList.filter(node => {
          if (node.id === this.node.id) {
            this.$emit('repaintEverything')
          }
        })
      } catch {
        this.$message({
          message: '请选择要保存的节点!',
          type: 'warning'
        })
        return
      }

      // 判断具体哪个节点
      var i = this.nodedata.nodeList.length - 1

      // 找到最后一个节点
      // console.log(this.data.nodeList[i]);
      // 判断节点id是不是纯数字,纯数字说明修改,反之创建
      if (isNaN(this.nodedata.nodeList[i].id) === true) {
        // 保存创建

        this.$emit('nodeSave', this.nodedata.nodeList[i])
      } else {
        // 保存修改
        this.node.style = this.style
        if (this.iffor_next === false) {
          this.node.iffor_next = 0
        } else {
          this.node.iffor_next = 1
        }
        if (this.binding_type === false) {
          this.node.binding_type = 0
        } else {
          this.node.binding_type = 1
        }
        this.$emit('Modify', this.node)
      }
    },

    // 选择图标
    bindingicon(id, name) {
      if (this.node.id === undefined) {
        this.$message({
          message: '请选择节点!',
          type: 'warning'
        })
        return
      }
      this.node.ico = name
      this.node.icoid = id
    },
    // 选择内外部
    outsideradio(val) {
      this.node.outside = val
    },
    // allTableRowWay() {
    //   this.inputUsersValue = '全部'
    //   this.node.binding_type = '全部'
    //   const newList = {
    //     fk_user: 0,
    //     fk_role: 0,
    //     binding_type: '全部'
    //   }
    //   this.bindingArr.push(newList)
    // },
    // 所有人可以处理 点击事件
    bindingtype_change(val) {}
  }
}
</script>

<style scoped>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
</style>
