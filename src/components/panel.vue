<template>
  <div v-if="list.easyFlowVisible">
    <el-row>
      <el-col :span="3" ref="flowTool">
        <flowTool @addNode="addNode"></flowTool>
      </el-col>
      <el-col :span="21">
        <el-row>
          <el-col :span="24">
            <div style="margin-bottom: 5px; margin-left: 10px">
              <el-link type="primary">{{ list.data.name }}</el-link>
              <el-button type="info" icon="el-icon-document" @click="dataInfo"
                >流程信息</el-button
              >
              <el-button
                type="primary"
                @click="dataReloadA"
                icon="el-icon-refresh"
                >清空</el-button
              >
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!--画布-->
            <div id="flowContainer" class="container">
              <template v-for="node in list.data.nodeList" :key="node.id">
                <flow-node
                  ref="nodes"
                  v-show="node.show"
                  :id="node.id"
                  :node="node"
                  @deleteNode="deleteNode"
                  @changeNodeSite="changeNodeSite"
                  @editNode="editNode(node)"
                >
                </flow-node>

                <!-- <chart v-if="list.nodeFormVisible" ref="chart"></chart> -->
              </template>
              <div v-for="window in list.data.windowList" :key="window.wid">
                <flow-node-form
                  v-show="window.nodeFormVisible"
                  ref="nodeForm"
                  @change="change"
                ></flow-node-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <flow-info
      v-if="list.flowInfoVisible"
      ref="flowInfo"
      :data="list.data"
    ></flow-info>
  </div>
</template>
<script>
import { defineComponent, reactive, onMounted, nextTick, ref } from "vue";
import { jsPlumb } from "jsplumb";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import flowNode from "@/components/node";
import flowTool from "@/components/tool";
import FlowInfo from "@/components/info";
import FlowNodeForm from "./node_form";
// import chart from "./chart";
import lodash from "lodash";
import { getDataA } from "./data_A";
export default defineComponent({
  name: "App",
  components: {
    flowNode,
    flowTool,
    FlowInfo,
    FlowNodeForm,
    // chart,
  },
  setup() {
    const flowTool = ref(null);
    const flowInfo = ref(null);
    const nodeForm = ref();
    const chart = ref(null);
    const nodes = ref(null);

    const list = reactive({
      lineList: [],
      nodeList: [],
      windowList: [],
      easyFlowVisible: true,
      flowInfoVisible: false,
      index: 1,
      data: {},
    });
    const allJsPlumb = reactive({
      jsPlumb: null, // jsPlumb 实例

      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          "Top",
          "TopCenter",
          "TopRight",
          "TopLeft",
          "Right",
          "RightMiddle",
          "Bottom",
          "BottomCenter",
          "BottomRight",
          "BottomLeft",
          "Left",
          "LeftMiddle",
        ],
        Container: "flowContainer",
        // 连线的样式 StateMachine、Flowchart
        Connector: "StateMachine",
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: ["Rectangle", { height: 10, width: 10 }],
        // 线端点的样式
        EndpointStyle: { fill: "rgba(255,255,255,0)", outlineWidth: 1 },
        LogEnabled: true, //是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: { stroke: "black", strokeWidth: 3 },
        // 绘制箭头
        Overlays: [["Arrow", { width: 10, length: 14, location: 1 }]],
        RenderMode: "svg",
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous",
      },
      jsplumbSourceOptions: {
        filter:
          ".flow-node-drag" /*"span"表示标签，".className"表示类，"#id"表示元素id*/,
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false,
      },
      jsplumbTargetOptions: {
        filter:
          ".flow-node-drag" /*"span"表示标签，".className"表示类，"#id"表示元素id*/,
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false,
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
    });
    onMounted(() => {
      allJsPlumb.jsPlumb = jsPlumb.getInstance();
      nextTick(() => {
        dataReloadA();
      });
    });
    function change(node) {
      for (let cnt = 0; cnt < list.data.nodeList.length; cnt++) {
        if (node.wid === list.data.windowList[cnt].wid) {
          list.data.windowList[cnt].nodeFormVisible = true;
          console.log(list.data.windowList[cnt]);
          break;
        }
      }
    }
    function loadEasyFlow() {
      for (var i = 0; i < list.data.nodeList.length; i++) {
        let node = list.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        allJsPlumb.jsPlumb.makeSource(node.id, allJsPlumb.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        allJsPlumb.jsPlumb.makeTarget(node.id, allJsPlumb.jsplumbTargetOptions);

        allJsPlumb.jsPlumb.draggable(node.id, {
          containment: "parent",
        });
      }
      nextTick(() => {
        allJsPlumb.loadEasyFlowFinish = true;
      });
    }
    function deleteLine(from, to) {
      list.data.lineList = list.data.lineList.filter(function (line) {
        return line.from !== from && line.to !== to;
      });
    }
    function hasLine(from, to) {
      for (var i = 0; i < list.data.lineList.length; i++) {
        var line = list.data.lineList[i];
        if (line.from === from && line.to === to) {
          return true;
        }
      }
      return false;
    }
    function hashOppositeLine(from, to) {
      return hasLine(to, from);
    }
    function hasProblem(from, to) {
      for (var i = 0; i < list.data.nodeList.length; i++) {
        var node1 = list.data.nodeList[i];
        if (node1.id === from) {
          for (var cnt = 0; cnt < list.data.nodeList.length; cnt++) {
            var node2 = list.data.nodeList[cnt];
            if (node2.id === to) {
              if (
                (node1.type === "txt" && node2.type === "csv") ||
                (node1.type === "csv" && node2.type === "txt") ||
                (node1.type === "txt" && node2.type === "txt") ||
                (node1.type === "csv" && node2.type === "csv")
              ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
    function jsPlumbInit() {
      allJsPlumb.jsPlumb.ready(() => {
        // 导入默认配置
        allJsPlumb.jsPlumb.importDefaults(allJsPlumb.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        allJsPlumb.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        loadEasyFlow();
        // 单点击了连接线,
        allJsPlumb.jsPlumb.bind("click", function (conn) {
          console.log("click", conn);

          ElMessageBox.alert("确定删除所点击的线吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              allJsPlumb.jsPlumb.deleteConnection(conn);
            })
            .catch(() => {});
        });
        // 连线
        allJsPlumb.jsPlumb.bind("connection", function (evt) {
          let from = evt.source.id;
          let to = evt.target.id;
          if (allJsPlumb.loadEasyFlowFinish) {
            list.data.lineList.push({
              from: from,
              to: to,
            });
          }
        });

        // 删除连线
        allJsPlumb.jsPlumb.bind("connectionDetached", function (evt) {
          console.log("connectionDetached", evt);
          deleteLine(evt.sourceId, evt.targetId);
        });

        // beforeDrop
        allJsPlumb.jsPlumb.bind("beforeDrop", function (evt) {
          console.log("beforeDrop", evt);

          let from = evt.sourceId;
          console.log("evt.sourceID", evt.sourceId);
          let to = evt.targetId;
          console.log("evt.targetID", evt.targetId);
          if (from === to) {
            ElMessage.error("不能连接自己");
            return false;
          } else if (hasLine(from, to)) {
            ElMessage.error("不能重复连线");
            return false;
          } else if (hashOppositeLine(from, to)) {
            ElMessage.error("不能回环哦");
            return false;
          } else if (hasProblem(from, to)) {
            ElMessage.error("不满足逻辑");
            return false;
          } else {
            ElMessage({
              message: "连接成功",
              type: "success",
            });
            if (isMAT(from, to)) {
              console.log(nodeForm.value);
              nodeForm.value.uploadFile();
            }
          }
          return true;
        });
      });
    }
    function isMAT(from, to) {
      for (var i = 0; i < list.data.nodeList.length; i++) {
        var node1 = list.data.nodeList[i];
        if (node1.id === from) {
          for (var cnt = 0; cnt < list.data.nodeList.length; cnt++) {
            var node2 = list.data.nodeList[cnt];
            if (node2.id === to) {
              if (
                (node1.type === "txt" && node2.type === "mat") ||
                (node1.type === "csv" && node2.type === "mat")
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    function changeNodeSite(data) {
      for (var i = 0; i < list.data.nodeList.length; i++) {
        let node = list.data.nodeList[i];
        if (node.id === data.nodeId) {
          console.log("data", data);
          console.log("nodes", nodes.value.Node);
          node.left = data.left;
          node.top = data.top;
        }
      }
    }
    function addNode(evt, nodeMenu, mousePosition) {
      console.log("添加节点", evt, nodeMenu);
      let width = flowTool.value.$el.clientWidth;
      const index = list.index++;
      let nodeId = "node" + index;
      var left = mousePosition.left;
      var top = mousePosition.top;

      if (mousePosition.left < 0) {
        left = evt.originalEvent.layerX - width;
      }
      if (mousePosition.top < 0) {
        top = evt.originalEvent.clientY - 50;
      }

      var node = {
        id: "node" + index,
        wid: index,
        name: nodeMenu.name,
        type: nodeMenu.type,
        left: left + "px",
        top: top + "px",
        ico: nodeMenu.ico,
        show: true,
      };
      var window = {
        wid: index,
        nodeFormVisible: false,
      };
      list.data.windowList.push(window);

      list.data.nodeList.push(node);

      // list.data = { 1: "1", 2: "2" };
      nextTick(() => {
        allJsPlumb.jsPlumb.makeSource(nodeId, allJsPlumb.jsplumbSourceOptions);

        allJsPlumb.jsPlumb.makeTarget(nodeId, allJsPlumb.jsplumbTargetOptions);

        allJsPlumb.jsPlumb.draggable(nodeId, {
          containment: "parent",
        });
      });
    }
    function deleteNode(nodeId) {
      ElMessageBox("确定要删除节点" + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          list.data.nodeList = list.data.nodeList.filter((node) => {
            return node.id !== nodeId;
          });
          nextTick(() => {
            console.log("删除" + nodeId);
            allJsPlumb.jsPlumb.removeAllEndpoints(nodeId);
          });
        })
        .catch(() => {});
      return true;
    }
    function editNode(node) {
      console.log("编辑节点", nodeForm.value, chart.value);
      for (var cnt = 0; cnt < list.data.nodeList.length; cnt++) {
        if (node.wid === list.data.windowList[cnt].wid) {
          // console.log(list.data.windowList[cnt]);
          // list.data.windowList[cnt].nodeFormVisible = true;
          // console.log(list.data.windowList[cnt]);
          break;
        }
      }

      if (node.type === "txt") {
        nextTick(() => {
          nodeForm.value.node = node.id;
          nodeForm.value.init(list.data, node.id);
        });
      } else if (node.type === "list") {
        nextTick(() => {
          chart.value.init(list.data, node.id);
        });
      }
    }
    function dataInfo() {
      list.flowInfoVisible = true;
      nextTick(() => {
        // props.flowInfo.init();
        flowInfo.value.init();
        console.log(flowInfo.value);
      });
    }
    function dataReload(data) {
      list.easyFlowVisible = false;
      list.data.nodeList = [];
      list.data.lineList = [];
      nextTick(() => {
        // 这里模拟后台获取数据、然后加载
        data = lodash.cloneDeep(data);
        list.easyFlowVisible = true;
        list.data = data;
        nextTick(() => {
          allJsPlumb.jsPlumb = jsPlumb.getInstance();
          nextTick(() => {
            jsPlumbInit();
          });
        });
      });
    }
    function dataReloadA() {
      dataReload(getDataA());
    }

    return {
      list,
      nodes,
      nodeForm,
      flowTool,
      flowInfo,
      chart,
      isMAT,
      change,
      changeNodeSite,
      addNode,
      deleteNode,
      editNode,
      dataInfo,
      dataReloadA,
    };
  },
});
</script>
<style>
#flowContainer {
  /* background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%); */
  background-size: 10px 10px;
  height: 500px;
  background-color: rgb(251, 251, 251);
  /*background-color: #42b983;*/
  position: relative;
}

.labelClass {
  background-color: white;
  padding: 5px;
  opacity: 0.7;
  border: 1px solid #346789;
  /*border-radius: 10px;*/
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
