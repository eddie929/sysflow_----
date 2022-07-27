<template>
  <el-container>
    <transition name="el-zoom-in-top">
      <el-card
        v-show="showtree"
        style="margin: 0px 0px 0px 0px;  "
      >
        <!-- <el-divider><i class="el-icon-folder" />流程树</el-divider> -->
        <el-row style="margin: 0px 10px 0px 0px; height: 100%; width: 230px">
          <el-col :span="24">
            <el-tree
              ref="tree"
              v-loading="treeloading"
              :data="treedata"
              :props="defaultProps"
              :highlight-current="true"
              node-key="id"
              class="filter-tree"
              @node-click="handleNodeClick"
            />
          </el-col>
        </el-row>
      </el-card>
    </transition>
    <el-container>
      <el-main>
        <el-button
          size="mini"
          @click="showtree = !showtree"
        >左侧分类</el-button>
        <el-button size="mini" @click="hiddenmenu">节点分类</el-button>
        <el-button size="mini" @click="righthidden">右侧编辑</el-button>

        <Panel ref="Panel" @getnodeid="getnodeid" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { get_flowinit, get_flownode } from '@/api/flowhandle'
import Panel from './components/ef/panel'
export default {
  components: { Panel },
  data() {
    return {
      showtree: true, // 隐藏左侧树型控件
      treedata: [], // 树数据
      filterText: '', // 模糊查询搜索树
      treeloading: false, // 树加载动画
      defaultProps: {
        // 树结构
        children: 'children',
        label: 'name',
        value: 'id',
        checkStrictly: true
      },
      fk_flow: 0 // 流程ID
    }
  },
  beforeMount() {
    this.get_flowinit()
  },
  methods: {
    // 新建流程
    addFLow() {},
    // 隐藏form 左侧树
    hidden() {
      if (this.$refs.panel.showform === false) {
        this.$refs.panel.showform = true
      } else {
        this.$refs.panel.showform = false
      }
    },
    // 点击树中  某一流程
    handleNodeClick(val) {
      this.fk_flow = val.id
      // 向子组件传入  流程ID
      // this.$refs.Panel.getflowid(this.flowId)
      if (val.str_level === '二级') {
        this.getnodeid(val.id)
      }
    },
    // 刷新
    getnodeid(id) {
      get_flownode({ fk_flow: parseInt(id) }).then(res => {
        if (res.code === 100) {
          const flowNodeData = res.data[0]
          const nodedata = {}
          const nodeList = []
          const lineList = []
          for (var i = 0; i < flowNodeData.nodelist.length; i++) {
            let data = {}
            data = {
              id: flowNodeData.nodelist[i].id + '',
              name: flowNodeData.nodelist[i].name,
              left: flowNodeData.nodelist[i].coordinates_x,
              top: flowNodeData.nodelist[i].coordinates_y,
              task: flowNodeData.nodelist[i].task,
              ico: flowNodeData.nodelist[i].图标名称,
              icoid: flowNodeData.nodelist[i].fk_icon,
              type: flowNodeData.nodelist[i].task,
              // process_way: flowNodeData.nodelist[i].process_way,
              outside: flowNodeData.nodelist[i].outside,
              binding_type: flowNodeData.nodelist[i].binding_type,
              remark: flowNodeData.nodelist[i].remark,
              style: flowNodeData.nodelist[i].style,
              fk_flow: flowNodeData.nodelist[i].fk_flow,
              fk_form: flowNodeData.nodelist[i].fk_form,
              iffor_next: flowNodeData.nodelist[i].iffor_next
            }
            if (flowNodeData.nodelist[i].mnode_binding == null) {
              data.mnode_binding = {}
            } else {
              data.mnode_binding = flowNodeData.nodelist[i].mnode_binding
            }
            nodeList.push(data)
          }
          nodedata.nodeList = nodeList
          nodedata.lineList = lineList
          nodedata.name = flowNodeData.name
          nodedata.id = flowNodeData.id

          // 构建线
          for (let i = 0; i < flowNodeData.linelist.length; i++) {
            const data = {
              id: flowNodeData.linelist[i].id + '',
              title: flowNodeData.linelist[i].title, // 标题
              fk_my: flowNodeData.linelist[i].fk_my + '',
              fk_tonode: flowNodeData.linelist[i].fk_tonode + '',
              fk_flow: flowNodeData.linelist[i].fk_flow
            }
            lineList.push(data)
          }
          nodedata.lineList === lineList
          this.$refs.Panel.dataReload(nodedata)
        }
      })
    },
    // 节点分类显示隐藏
    hiddenmenu() {
      if (this.$refs.Panel.showmenu === false) {
        this.$refs.Panel.showmenu = true
      } else {
        this.$refs.Panel.showmenu = false
      }
    },
    righthidden() {
      if (this.$refs.Panel.showform === false) {
        this.$refs.Panel.showform = true
      } else {
        this.$refs.Panel.showform = false
      }
    },
    // 初始加载所有流程
    get_flowinit() {
      get_flowinit().then(res => {
        if (res.code === 100) {
          this.treedata = res.data
        }
      })
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
