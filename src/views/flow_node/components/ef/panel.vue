<template>
  <div v-if="easyFlowVisible" style="height: calc(80vh)">
    <el-row>
      <!--顶部工具菜单-->
      <el-col v-show="topShow" :span="24">
        <div class="ef-tooltar">
          <el-link type="primary" :underline="false">{{ data.name }}</el-link>
          <el-divider direction="vertical" />
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; height: calc(100% - 47px)">
      <div style=" border-right: 1px solid #dce3e8">
        <transition name="el-zoom-in-top">
          <node-menu v-show="showmenu" ref="nodeMenu" @addNode="addNode" />
        </transition>
      </div>
      <div id="efContainer" ref="efContainer" v-flowDrag class="container">
        <template v-for="node in data.nodeList">
          <flow-node
            :id="node.id"
            :key="node.id"
            :node="node"
            :active-element="activeElement"
            @changeNodeSite="changeNodeSite"
            @nodeRightMenu="nodeRightMenu"
            @clickNode="clickNode"
          />
        </template>
        <!-- 给画布一个默认的宽度和高度 -->
        <div style="position: absolute; top: 1000px; left: 1100px">&nbsp;</div>
      </div>
      <!-- 右侧表单 -->
      <div
        style="
          border-left: 1px solid #dce3e8;
          background-color: #fbfbfb;
        "
      >
        <transition name="el-zoom-in-top">
          <flow-node-form
            v-show="showform"
            ref="nodeForm"
            @setLineLabel="setLineLabel"
            @repaintEverything="repaintEverything"
            @nodeSave="nodeSave"
            @Modify="Modify"
            @deleteElement="deleteElement"
          />
        </transition>
      </div>
    </div>
    <!-- 流程数据详情 -->
  </div>
</template>

<script>
import {
  insert_node,
  alter_flownode,
  del_node,
  insert_nodeline,
  del_nodeline,
  alter_nodeline,
  insert_nodebinding,
  del_nodebinding
} from '@/api/flowhandle'
// import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
import './jsplumb'
// import { easyFlowMixin } from '@/components/ef/mixins'
import { easyFlowMixin } from './mixins'
// import flowNode from '@/components/ef/node'
import flowNode from './node'
// import nodeMenu from '@/components/ef/node_menu'
import nodeMenu from './node_menu'
// import FlowInfo from '@/components/ef/info'
// import FlowHelp from '@/components/ef/help'
// import FlowHelp from './help'
// import FlowNodeForm from './node_form'
import FlowNodeForm from './node_form'
import lodash from 'lodash'
import { get_flownode } from '@/api/flowhandle'

export default {
  components: {
    flowNode,
    nodeMenu,

    FlowNodeForm
  },
  directives: {
    flowDrag: {
      bind(el, binding, vnode, oldNode) {
        if (!binding) {
          return
        }
        el.onmousedown = e => {
          if (e.button === 2) {
            // 右键不管
            return
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX
          let disY = e.clientY
          el.style.cursor = 'move'

          document.onmousemove = function(e) {
            // 移动时禁止默认事件
            e.preventDefault()
            const left = e.clientX - disX
            disX = e.clientX
            el.scrollLeft += -left

            const top = e.clientY - disY
            disY = e.clientY
            el.scrollTop += -top
          }

          document.onmouseup = function(e) {
            el.style.cursor = 'auto'
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  data() {
    return {
      // 隐藏
      topShow: true,
      showform: true,
      showmenu: true,
      // 流程id
      fk_flow: 0,
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      flowHelpVisible: false,
      // 数据
      data: {},
      // 激活的元素、可能是节点、可能是连线
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined
      },
      zoom: 0.5
    }
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    // console.log(getDataB());
    this.$nextTick(() => {
      // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
      // this.dataReload(getDataB());
    })
  },
  methods: {
    // 保存新增节点
    nodeSave(val) {
      const nodedata = {
        fk_flow: this.fk_flow,
        style: '',
        task: val.type,
        name: val.name,
        fk_icon: val.icoid,
        coordinates_x: val.left,
        coordinates_y: val.top,
        remark: '',
        // process_way: '0',
        outside: '1', // 默认外部
        iffor_next: 0,
        binding_type: 0
      }
      insert_node(nodedata).then(res => {
        if (res.code > 0) {
          this.$emit('getnodeid', this.fk_flow)
          this.$notify({
            title: '成功',
            message: '节点创建成功',
            type: 'success'
          })
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
    },
    // 修改
    Modify(val) {
      var data = {
        id: parseInt(val.id),
        name: val.name,
        fk_flow: parseInt(this.fk_flow),
        task: val.type,
        fk_icon: val.icoid,
        coordinates_x: val.left,
        coordinates_y: val.top,
        remark: '',
        // process_way: val.process_way,
        outside: val.outside,
        style: val.style !== '' ? val.style : '',
        binding_type: val.binding_type !== 0 ? val.binding_type : 0,
        iffor_next: val.iffor_next
      }
      alter_flownode(data).then(res => {
        if (res.code === 100) {
          this.alter_box(res.code, '修改成功!')
          this.$emit('getnodeid', this.fk_flow)
          if (val.binding_type === 1) {
            // 删除历史绑定的数据 新增全部
            const deldata = {
              fk_flow: parseInt(this.fk_flow),
              fk_node: parseInt(val.id),
              binding_type: '',
              id: 0
            }
            del_nodebinding(deldata).then(res => {
              if (res.code === 100) {
                const bindingArr = []
                const newList = {
                  fk_user: 0,
                  fk_role: 0,
                  fk_flow: parseInt(this.fk_flow),
                  fk_node: parseInt(val.id),
                  binding_type: '全部'
                }
                bindingArr.push(newList)
                insert_nodebinding(bindingArr).then()
              }
            })
          } else {
            // 删除全部绑定
            const deldata = {
              fk_flow: parseInt(this.fk_flow),
              fk_node: parseInt(val.id),
              binding_type: '全部',
              id: 0
            }
            del_nodebinding(deldata).then()
          }

          return
        } else {
          this.alter_box(res.code)
        }
      })
    },

    // 返回唯一标识
    getUUID() {
      return Math.random()
        .toString(36)
        .substr(3, 10)
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html

        this.jsPlumb.bind('click', (conn, originalEvent) => {
          // 判断取得  线ID
          let lineinfo = []

          for (var i = 0; i < this.data.lineList.length; i++) {
            if (
              this.data.lineList[i].fk_my === conn.sourceId &&
              this.data.lineList[i].fk_tonode === conn.targetId
            ) {
              lineinfo = this.data.lineList[i]
            }
          }
          this.activeElement.type = 'line'
          this.activeElement.sourceId = conn.sourceId
          this.activeElement.targetId = conn.targetId
          this.$refs.nodeForm.lineInit({
            fk_my: conn.sourceId,
            fk_tonode: conn.targetId,
            title: lineinfo.title,
            id: lineinfo.id,
            fk_flow: lineinfo.fk_flow
          })
        })
        // 连线
        this.jsPlumb.bind('connection', evt => {
          const from = evt.source.id
          const to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
          }
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', evt => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', evt => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 连线右击
        this.jsPlumb.bind('contextmenu', evt => {
          console.log('contextmenu', evt)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', evt => {
          const from = evt.sourceId
          const to = evt.targetId

          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          var dataline = {
            fk_flow: this.fk_flow,
            fk_my: parseInt(from),
            fk_tonode: parseInt(to)
          }
          insert_nodeline(dataline).then(res => {
            this.$emit('getnodeid', this.fk_flow)
            this.$message.success('连接成功')
            return true
          })
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', evt => {
          console.log('beforeDetach', evt)
        })
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(
          node.id,
          lodash.merge(this.jsplumbSourceOptions, {})
        )
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: 'parent',
            stop: function(el) {}
          })
        }
      }
      // 初始化连线
      for (let i = 0; i < this.data.lineList.length; i++) {
        const line = this.data.lineList[i]
        var connParam = {
          source: line.fk_my,
          target: line.fk_tonode,
          label: line.title ? line.title : '',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined,
          id: line.id,
          fk_flow: line.fk_flow
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true
      })
    },
    // 设置连线条件
    setLineLabel(fk_my, fk_tonode, label, conditions) {
      var conn = this.jsPlumb.getConnections({
        source: fk_my,
        target: fk_tonode
      })[0]
      if (!label || label === '') {
        conn.removeClass('flowLabel')
        conn.addClass('emptyFlowLabel')
      } else {
        conn.addClass('flowLabel')
      }
      conn.setLabel({
        label: label
      })
      var that = this // 指向问题

      this.data.lineList.forEach(function(line) {
        if (line.fk_my === fk_my && line.fk_tonode === fk_tonode) {
          line.title = label
          var data = {
            id: parseInt(line.id),
            fk_flow: that.fk_flow,
            fk_my: parseInt(line.fk_my),
            fk_tonode: parseInt(line.fk_tonode),
            title: line.title
          }
          alter_nodeline(data).then(res => {
            if (res.code === 100) {
              that.$emit('getnodeid', that.fk_flow)
              that.alter_box(res.code, '修改成功')
            } else if (res.code === 101) {
              that.alter_box(res.code, res.msg)
              return
            } else if (res.code === 102) {
              that.alter_box(res.code, res.msg)
              return
            } else if (res.code === -1) {
              that.alter_box(res.code, res.msg)
              return
            }
          })
        }
      })
    },
    // 删除激活的元素
    deleteElement(val) {
      if (this.activeElement.type === 'node') {
        // 删除节点
        this.deleteNode(this.activeElement.nodeId, val)
      } else if (this.activeElement.type === 'line') {
        this.$confirm('确定删除所点击的线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (var i = 0; i < this.data.lineList.length; i++) {
              if (
                this.data.lineList[i].from === val.from &&
                this.data.lineList[i].to === val.to
              ) {
                // 如果是 前台展示的线
                //  cons ole.log(this.data.lineList[i])
                if (this.data.lineList[i].id === undefined) {
                  this.$emit('getnodeid', this.fk_flow)
                  break
                }
                del_nodeline({ id: this.data.lineList[i].id }).then(res => {
                  if (res.code === 100) {
                    this.$emit('getnodeid', this.fk_flow)
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
              }
            }
            var conn = this.jsPlumb.getConnections({
              source: this.activeElement.sourceId,
              target: this.activeElement.targetId
            })[0]
            this.jsPlumb.deleteConnection(conn)
          })
          .catch(() => {})
      }
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      // 判断 选择流程  才可以添加节点
      if (this.data.nodeList === undefined) {
        this.$message({
          message: '请选择具体流程!',
          type: 'warning'
        })
        return
      }
      var screenX = evt.originalEvent.clientX
      var screenY = evt.originalEvent.clientY
      const efContainer = this.$refs.efContainer
      var containerRect = efContainer.getBoundingClientRect()
      var left = screenX
      var top = screenY
      // 计算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        this.$message.error('请把节点拖入到画布中')
        return
      }
      if (this.data.nodeList.length !== 0) {
        for (var i = 0; i < this.data.nodeList.length; i++) {
          if (this.data.nodeList[i].type === '发起') {
            if (nodeMenu.type === '发起') {
              this.$message({
                message: '已有开始节点存在!',
                type: 'warning'
              })
              return
            }
          } else if (this.data.nodeList[i].type === '结束') {
            if (nodeMenu.type === '结束') {
              this.$message({
                message: '已有结束节点存在!',
                type: 'warning'
              })
              return
            }
          }
        }
      } else {
        if (nodeMenu.type !== '发起') {
          this.$message({
            message: '请选择开始节点!',
            type: 'warning'
          })
          return
        }
      }
      left = left - containerRect.x + efContainer.scrollLeft
      top = top - containerRect.y + efContainer.scrollTop
      // 居中
      left -= 85
      top -= 16
      var nodeId = this.getUUID()
      // 动态生成名字
      var origName = nodeMenu.name
      var nodeName = origName
      var index = 1

      while (index < 10000) {
        var repeat = false
        for (let i = 0; i < this.data.nodeList.length; i++) {
          const node = this.data.nodeList[i]
          if (node.name === nodeName) {
            nodeName = origName + index
            repeat = true
          }
        }
        if (repeat) {
          index++
          continue
        }
        break
      }

      var node = {
        id: nodeId,
        name: nodeName,
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        icoid: nodeMenu.icoid,
        state: ''
      }

      const nodedata = {
        name: nodeName,
        task: nodeMenu.type,
        coordinates_x: left + 'px',
        coordinates_y: top + 'px',
        fk_flow: this.fk_flow,
        fk_icon: nodeMenu.icoid,
        remark: '',
        // process_way: '0',
        outside: '1',
        style: '',
        iffor_next: 0,
        binding_type: 0
      }
      insert_node(nodedata).then(res => {
        if (res.code > 0) {
          this.$emit('getnodeid', this.fk_flow)
          this.$notify({
            title: '成功',
            message: '节点创建成功',
            type: 'success'
          })
        } else if (res.code === 101) console.log('参数无效')
        else if (res.code === 102) console.log('参数为空')
        else if (res.code === -1) console.log('请求失败')
      })
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node)
      this.$nextTick(function() {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(nodeId, {
          containment: 'parent',
          stop: function(el) {}
        })
      })
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId, node) {
      this.$confirm('确定要删除“' + node.name + '”节点么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        this.data.nodeList = this.data.nodeList.filter(function(node) {
          if (node.id === nodeId) {
            // 伪删除，将节点隐藏，否则会导致位置错位
            // node.show = false
            return false
          }
          return true
        })
        this.$nextTick(function() {
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
        if (isNaN(nodeId) === true) {
          return
        }
        del_node({ id: parseInt(nodeId) }).then(res => {
          if (res.code === 100) {
            this.$emit('getnodeid', this.fk_flow)
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
      })
      return true
    },
    // 点击
    clickNode(nodeId) {
      this.activeElement.type = 'node'
      this.activeElement.nodeId = nodeId.id
      this.$refs.nodeForm.nodeInit(this.data, nodeId.id)
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },
    repaintEverything() {
      this.jsPlumb.repaint()
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true
      this.$nextTick(function() {
        this.$refs.flowInfo.init()
      })
    },
    // 加载流程图
    dataReload(data) {
      try {
        this.fk_flow = data.id
        // this.$refs.nodeForm.nodedata = data // 向form传入数据
        this.easyFlowVisible = false
        this.data.nodeList = []
        this.data.lineList = []
        this.$nextTick(() => {
          data = lodash.cloneDeep(data)
          this.easyFlowVisible = true
          if (data === {}) {
            return
          }
          this.data = data
          this.$nextTick(() => {
            this.jsPlumb = jsPlumb.getInstance()
            this.$nextTick(() => {
              this.jsPlumbInit()
            })
          })
        })
      } catch (error) {
        console.log(error)
      }
    },

    // 用于流程监控等
    getFlowMonitor(nodeinfo) {
      get_flownode({ fk_flow: nodeinfo.fk_flow }).then(res => {
        if (res.code === 100 && res.data.length > 0) {
          const resData = res.data[0]
          const data = {
            name: nodeinfo.流程名称,
            id: nodeinfo.fk_flow
          }
          const newNodeList = [] // 节点数组
          const newLineList = [] // 线数组
          // 遍历节点
          for (let index = 0; index < resData.nodelist.length; index++) {
            const newNodeArr = {
              id: resData.nodelist[index].id + '',
              name: resData.nodelist[index].name,
              type: resData.nodelist[index].task,
              left: resData.nodelist[index].coordinates_x + '',
              top: resData.nodelist[index].coordinates_y + '',
              fk_flow: resData.nodelist[index].fk_flow,
              ico: resData.nodelist[index].图标名称,
              icoid: resData.nodelist[index].fk_icon,
              style: resData.nodelist[index].style,
              iffor_next: resData.nodelist[index].iffor_next,
              binding_type: resData.nodelist[index].binding_type,
              outside: resData.nodelist[index].outside,
              state: '',
              remark: resData.nodelist[index].remark,
              viewOnly: true
            }

            if (nodeinfo.fk_node === resData.nodelist[index].id) {
              newNodeArr.state = 'running'
            }
            // 这个条件需要调整，等做了我的发起后在来完善 当前id等于节点id 并且结束 就要用结束状态表示
            if (
              nodeinfo.节点状态 === '完成' ||
              nodeinfo.节点状态 === '结束' ||
              nodeinfo.节点状态 === '归档'
            ) {
              newNodeArr.state = 'success'
            }
            newNodeList.push(newNodeArr)
          }
          data.nodeList = newNodeList
          // 遍历线
          for (let i = 0; i < resData.linelist.length; i++) {
            const newLineArr = {
              fk_my: resData.linelist[i].fk_my + '',
              fk_tonode: resData.linelist[i].fk_tonode + '',
              title: resData.linelist[i].title,
              fk_flow: resData.linelist[i].fk_flow,
              id: resData.linelist[i].id + ''
            }
            newLineList.push(newLineArr)
          }
          data.lineList = newLineList

          this.dataReload(data)
        } else {
          // 未获取流程信息
        }
      })
    },

    zoomAdd() {
      if (this.zoom >= 1) {
        return
      }
      this.zoom = this.zoom + 0.1
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`
      this.jsPlumb.setZoom(this.zoom)
    },
    zoomSub() {
      if (this.zoom <= 0) {
        return
      }
      this.zoom = this.zoom - 0.1
      this.$refs.efContainer.style.transform = `scale(${this.zoom})`
      this.jsPlumb.setZoom(this.zoom)
    },
    // 下载数据
    downloadData() {
      this.$confirm('确定要下载该流程数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          var datastr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(this.data, null, '\t'))
          var downloadAnchorNode = document.createElement('a')
          downloadAnchorNode.setAttribute('href', datastr)
          downloadAnchorNode.setAttribute('download', 'data.json')
          downloadAnchorNode.click()
          downloadAnchorNode.remove()
          this.$message.success('正在下载中,请稍后...')
        })
        .catch(() => {})
    },
    openHelp() {
      this.flowHelpVisible = true
      this.$nextTick(function() {
        this.$refs.flowHelp.init()
      })
    }
  }
}
</script>
