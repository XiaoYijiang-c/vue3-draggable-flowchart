<template>
  <!-- 主组件 -->
  <div v-if="list.easyFlowVisible">
    <el-row>
      <el-col :span="3" ref="flowTool">
        <flowTool @addNode="addNode"></flowTool>
      </el-col>
      <el-col :span="21">
        <el-row :span="3">
          <el-col :span="24">
            <div style="margin-bottom: 5px; margin-left: 10px">
              <el-link type="primary">{{ list.name }}</el-link>
              <el-button type="info" icon="el-icon-document" @click="dataInfo"
                >上传流程</el-button
              >
              <el-button
                type="primary"
                @click="dataReloadA"
                icon="el-icon-refresh"
                >清空</el-button
              >
              <el-button
                type="success"
                icon="el-icon-refresh"
                @click="addConsole"
                >添加控制台</el-button
              >
            </div>
          </el-col>
        </el-row>
        <el-row :span="21">
          <el-col :span="24">
            <!--画布-->
            <div id="flowContainer" class="container" ref="efContainer">
              <template v-for="node in list.nodeList" :key="node.id">
                <flow-node
                  ref="nodes"
                  v-show="node.show"
                  :id="node.id"
                  :node="node"
                  @deleteNode="deleteNode(node)"
                  @changeNodeSite="changeNodeSite"
                  @editNode="editNode(node)"
                >
                </flow-node>
              </template>
              <template v-for="window in list.windowList" :key="window.wid">
                <!-- v-if="window.type === 'txt'" -->
                <el-dialog
                  title="提示"
                  v-model="window.nodeFormVisible"
                  width="50%"
                  :before-close="handleClose"
                  v-if="
                    window.type === 'txt' ||
                    window.type === 'csv' 
                  "
                  center
                >
                  <el-form
                    ref="dataForm"
                    label-width="80px"
                    :id="'form' + window.wid"
                    @change="computeSize(window)"
                  >
                  <el-form-item label="数据类型">
                      <el-radio
                        v-model="window.dataType"
                        label="DNA"
                        name="dataType"
                        >DNA</el-radio
                      >
                      <el-radio
                        v-model="window.dataType"
                        label="RNA"
                        name="dataType"
                        >RNA</el-radio
                      >
                      <el-radio
                        v-model="window.dataType"
                        label="protein"
                        name="dataType"
                        >protein</el-radio
                      >
                      <el-radio
                        v-model="window.dataType"
                        label="other"
                        name="dataType"
                        >other</el-radio
                      >
                    </el-form-item>
                    <el-form-item label="编码类型" v-show="window.dataType !='other'">
                      <el-radio
                        v-model="window.dataEncodingType"
                        label="dict"
                        name="dataEncodingType"
                        >dict</el-radio
                      >
                      <el-radio
                        v-model="window.dataEncodingType"
                        label="oneHot"
                        name="dataEncodingType"
                        >oneHot</el-radio
                      >
                    </el-form-item>
                    
                    <el-form-item label="Spclen" v-show="window.dataType !='other'">
                      <el-input
                        v-model="window.input"
                        placeholder="请输入内容"
                        name="Spclen"
                        type="number"
                      ></el-input>
                      <el-input
                        name="node-id"
                        v-model="window.id"
                        id="hiddenInput"
                        style="display:none"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="矩阵维度" v-show="window.dataType !='other'"
                      >{{ window.size }}
                    </el-form-item>
                    <el-form-item label="文件上传" >
                      <input
                        type="file"
                        name="file"
                        :id="window.wid"
                        class="file"
                        @change="fileInfo(getFileContent, window)"
                        v-if="window.type === 'txt'"
                      />
                      <input
                        type="file"
                        name="file"
                        accept=".csv"
                        :id="window.wid"
                        class="file"
                        @change="fileInfo(getFileContent, window)"
                        v-else-if="window.type === 'csv'"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="window.nodeFormVisible = false"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="
                          (window.nodeFormVisible = false), uploadFiles(window)
                        "
                        >确 定</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
                <!-- v-if="window.type === 'list'" -->
                <el-dialog
                  title="DataList"
                  v-model="window.nodeFormVisible"
                  v-else-if="window.type === 'list'"
                  center
                  
                >
                  <el-scrollbar>
                    <div v-if="window.showData != null">
                      <!-- <p v-for="item in window.showData" :key="item">
                        {{ item }}
                      </p> -->
                      <p class="listDataP"><pre>
                        {{ window.showData }}
                        </pre></p>
                    </div>
                    <div v-else><el-empty :image-size="200"></el-empty></div>
                  </el-scrollbar>
                </el-dialog>
                <!-- v-if="window.type === 'zdy'" -->
                <el-dialog
                  title="上传自定义模型"
                  class="zdy"
                  v-model="window.nodeFormVisible"
                  width="50%"
                  :before-close="handleClose"
                  v-else-if="window.type === 'zdy'"
                  center
                >
                  <el-form
                    ref="dataForm"
                    label-width="140px"
                    label-position="left"
                    :id="'form' + window.wid"
                    class="zdymodel"
                  >
                    <el-form-item label="文件类型">
                      <el-radio-group v-model="window.fileType">
                        <el-radio-button label="py" name="modelfiletype"
                          >选择.py模型文件</el-radio-button
                        >
                        <el-radio-button label="json" name="modelfiletype"
                          >选择.json模型文件</el-radio-button
                        >
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label=".py模型文件上传"
                      v-show="window.fileType === 'py'"
                    >
                      <input
                        type="file"
                        name="model"
                        :id="window.wid"
                        class="file"
                        accept=".py"
                        @change="fileInfo(getFileContent, window)"
                      />
                    </el-form-item>
                    <el-form-item
                      label=".json模型文件上传"
                      v-show="window.fileType === 'json'"
                    >
                      <input
                        type="file"
                        name="model"
                        :id="window.wid"
                        class="file"
                        accept=".json"
                        @change="fileInfo(getFileContent, window)"
                      />
                    </el-form-item>
                    <el-form-item label="文件类型">
                      <el-radio-group v-model="window.fileType2">
                        <el-radio-button label="1" name="hasweight"
                          >选择权重文件</el-radio-button
                        >
                        <el-radio-button label="0" name="hasweight"
                          >不选择权重文件</el-radio-button
                        >
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      label="权重文件上传"
                      v-show="window.fileType2 === '1'"
                    >
                      <input
                        type="file"
                        name="weight"
                        :id="window.wid"
                        class="file"
                        @change="fileInfo(getFileContent, window)"
                      />
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="window.nodeFormVisible = false"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="
                          (window.nodeFormVisible = false), uploadFiles1(window)
                        "
                        >确 定</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
                <!-- v-if="window.type === 'mat'" -->
                <el-dialog
                  title="矩 阵"
                  v-model="window.nodeFormVisible"
                  v-else-if="window.type === 'mat'"
                  center
                >
                  <el-form
                    ref="dataForm"
                    label-width="140px"
                    label-position="left"
                    :id="'form' + window.wid"
                  >
                    <el-form-item label="矩阵处理">
                      <el-radio-group v-model="window.standardizing">
                        <el-radio-button
                          label="standardization"
                          name="matHandle"
                          >标准化</el-radio-button
                        >
                        <el-radio-button label="normalization" name="matHandle"
                          >归一化</el-radio-button
                        >
                        <el-radio-button label="none" name="matHandle"
                          >不进行处理</el-radio-button
                        >
                      </el-radio-group>
                      
                    </el-form-item>
                    <el-input
                        name="lineFrom"
                        v-model="window.lineFrom"
                        style="display:none"
                      ></el-input>
                      <el-input
                        name="dataType"
                        v-model="window.type"
                        style="display:none"
                      ></el-input>
                      <el-input
                        name="nodeid"
                        v-model="window.id"
                        style="display:none"
                      ></el-input>
                    <el-form-item label="归一化操作" v-show="window.standardizing === 'normalization'">
                      <el-radio-group v-model="window.normalization">
                        <el-radio-button
                          label="row"
                          name="matNormalization"
                          >行归一化</el-radio-button
                        >
                        <el-radio-button label="col" name="matNormalization"
                          >列归一化</el-radio-button
                        >
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="归一区间" v-show="window.standardizing === 'normalization'">
                        [<el-input-number v-model="window.negNormalizationNum" size="small" step=0.01 name="negNormalizationNum" :label="window.negNormalizationNum" :max="window.posNormalizationNum"/>
                        , <el-input-number v-model="window.posNormalizationNum" size="small" step="0.01" name="posNormalizationNum" :label="window.posNormalizationNum" :min="window.negNormalizationNum"/>]
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="window.nodeFormVisible = false"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="
                          (window.nodeFormVisible = false), uploadFiles2(window)
                        "
                        >确 定</el-button
                      >
                    </span>
                  </template>
                </el-dialog>
              </template>
            </div>
          </el-col>
        </el-row>
        <flow-consoles class="FlowConsoles" ref="FlowConsoles"></flow-consoles>
      </el-col>
    </el-row>

    <flow-info
      v-if="list.flowInfoVisible"
      ref="flowInfo"
      :data="list"
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
import FlowConsoles from "@/components/consoles";
import $ from "jquery";
import lodash from "lodash";
import { getDataA } from "./data_A";

export default defineComponent({
  name: "App",
  components: {
    flowNode,
    flowTool,
    FlowInfo,
    FlowConsoles,
  },
  setup() {
    //获取子组件
    const flowTool = ref(null);
    const flowInfo = ref(null);
    const FlowConsoles = ref();
    const efContainer = ref(null);
    onMounted(() => {
      console.log("efContainer", efContainer.value);
    });

    const nodes = ref();
    //对节点的全局计数
    const INDEX = ref(0);
    // nodeType
    let uploadFilesType = ["txt", "csv", "zdy"];
    let transfrom = ["list", "mat"];
    let splice = ["col", "row"];
    //关于节点的属性设置
    const list = reactive({
      lineList: [],
      nodeList: [],
      windowList: [],
      easyFlowVisible: true,
      flowInfoVisible: false,
      index: 1,
    });

    // 关于jsplumb的设置
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
        PaintStyle: { stroke: "black", strokeWidth: 2 },
        HoverPaintStyle: { stroke: "#D3D3D3", strokeWidth: 3 },
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
    //挂载 jsplumb 初始化画布
    onMounted(() => {
      allJsPlumb.jsPlumb = jsPlumb.getInstance();
      nextTick(() => {
        dataReloadA();
      });
    });
    //绘制流程图
    function loadEasyFlow() {
      for (var i = 0; i < list.nodeList.length; i++) {
        let node = list.nodeList[i];
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
    //删除线
    function deleteLine(from, to) {
      list.lineList = list.lineList.filter(function (line) {
        return line.from !== from && line.to !== to;
      });
    }

    //对是否连线的逻辑判断
    function hasLine(from, to) {
      for (var i = 0; i < list.lineList.length; i++) {
        var line = list.lineList[i];
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
      for (var i = 0; i < list.nodeList.length; i++) {
        var node1 = list.nodeList[i];
        if (node1.id === from) {
          for (var cnt = 0; cnt < list.nodeList.length; cnt++) {
            var node2 = list.nodeList[cnt];
            let nType1 = node1.type;
            let nType2 = node2.type;
            if (node2.id === to) {
              if (uploadFilesType.includes(nType2)) {
                // 上传节点不可互连 且不可被连接
                return true;
              } else if (nType1 === "list") {
                // list只能被连接
                return true;
              } else if (
                splice.includes(nType2) &&
                !transfrom.includes(nType1)
              ) {
                // 只能拼接矩阵
                return true;
              } else if (
                transfrom.includes(nType2) &&
                !uploadFilesType.includes(nType1)
              ) {
                // 矩阵只能转换文件节点
                return true;
              }
              //
            }
          }
        }
      }
      return false;
    }
    function limitDataTable(from, to) {
      console.log("to", to);

      for (var i = 0; i < list.nodeList.length; i++) {
        if (list.nodeList[i].id == to) {
          if (
            list.nodeList[i].type === "list" ||
            list.nodeList[i].type === "mat"
          ) {
            for (var cnt = 0; cnt < list.lineList.length; cnt++) {
              var line = list.lineList[cnt];
              if (line.to == to) {
                return true;
              }
            }
          }
        }
      }

      return false;
    }
    function isMAT(from, to) {
      for (var i = 0; i < list.nodeList.length; i++) {
        var node1 = list.nodeList[i];
        if (node1.id === from) {
          for (var cnt = 0; cnt < list.nodeList.length; cnt++) {
            var node2 = list.nodeList[cnt];
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
    //初始化jsplumb
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
            list.lineList.push({
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
          } else if (limitDataTable(from, to)) {
            ElMessage.error("Data Table和矩阵只能被一个其他节点连接");
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
    //改变节点位置 实现可拖拽布局
    function changeNodeSite(data) {
      for (var i = 0; i < list.nodeList.length; i++) {
        let node = list.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    }

    function isFirefox() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    }

    //添加节点
    function addNode(evt, nodeMenu, mousePosition) {
      console.log("添加节点", evt, nodeMenu);
      console.log("flowTool.value", flowTool.value);
      let width = flowTool.value.$el.clientWidth;
      const index = list.index++;
      let nodeId = "node" + index;
      var left = evt.originalEvent.clientX;
      var top = evt.originalEvent.clientY;
      //居中
      left -= 300;
      top -= 75;
      if (isFirefox()) {
        console.log("INFIREFOX");
        left = mousePosition.left;
        top = mousePosition.top;
        //居中
        left -= 100;
        top -= 25;
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
        id: "node" + index,
        wid: index,
        type: nodeMenu.type,
        nodeFormVisible: false,
        dataEncodingType: ref(null),
        dataType: ref(null),
        fileType: ref("py"),
        fileType2: ref("1"),
        standardizing: ref("none"),
        normalization: ref("col"),
        posNormalizationNum: ref(0),
        negNormalizationNum: ref(0),
        showData: ref(null),
        lineFrom: ref(null),
        FILE: reactive({
          file: {},
          fileName: "",
          fileContent: "",
        }),
        input: ref(0),
        size: ref(),
      };
      list.windowList.push(window);
      // console.log(nodes.value);
      list.nodeList.push(node);
      INDEX.value++;
      // list = { 1: "1", 2: "2" };
      nextTick(() => {
        nodes.value.nodes.style.left = node.left;
        nodes.value.nodes.style.top = node.top;
        console.log(typeof node.top);
        allJsPlumb.jsPlumb.makeSource(nodeId, allJsPlumb.jsplumbSourceOptions);

        allJsPlumb.jsPlumb.makeTarget(nodeId, allJsPlumb.jsplumbTargetOptions);

        allJsPlumb.jsPlumb.draggable(nodeId, {
          containment: "parent",
        });
      });
    }
    //删除节点
    function deleteNode(Node) {
      ElMessageBox("确定要删除节点" + Node.id + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false,
      })
        .then(() => {
          list.nodeList = list.nodeList.filter((node) => {
            return node.id !== Node.id;
          });
          list.windowList = list.windowList.filter((window) => {
            return window.wid !== Node.wid;
          });
          INDEX.value--;
          nextTick(() => {
            allJsPlumb.jsPlumb.removeAllEndpoints(Node.id);
          });
        })
        .catch(() => {});
      return true;
    }
    //点击编辑节点时触发
    function findWindow(nodeid) {
      for (let window of list.windowList) {
        if (window.id === nodeid) {
          return window;
        }
      }
      return false;
    }
    function editNode(node) {
      for (var cnt = 0; cnt < list.nodeList.length; cnt++) {
        if (node.wid === list.windowList[cnt].wid) {
          let window = list.windowList[cnt];
          window.nodeFormVisible = true;
          if (node.type === "list") {
            try {
              let foundNode = findWindow(findLinefrom(window));
              console.log("foundNode", foundNode);
              if (uploadFilesType.includes(foundNode.type)) {
                window.showData = foundNode.FILE.fileContent;
                console.log(window.showData);
              } else {
                window.showData = dataFromBack.value[node.wid];
              }
            } catch (e) {
              console.log(e);
            }
          } else if (node.type === "mat") {
            window.lineFrom = findLinefrom(window);
            console.log("window.lineFrom", window.lineFrom);
          }
          break;
        }
      }
    }
    //点击上传流程后触发
    const dataFromBack = ref();

    function findLinefrom(window) {
      console.log("linelist", list.lineList);
      for (let line of list.lineList) {
        if (window.id == line.to) {
          console.log("line.from", line.from);
          return line.from;
        }
      }
    }

    function dataInfo() {
      list.flowInfoVisible = true;
      nextTick(() => {
        flowInfo.value.init();
        flowInfo.value.dataAll
          .then((res) => {
            console.log("flowInfo.value.dataALL", res.data.rowjointdata);
            dataFromBack.value = res.data.rowjointdata;
          })
          .catch((e) => {
            console.log("then", e);
          });
      });
    }
    //获取初始画布信息
    function dataReload(data) {
      list.easyFlowVisible = false;
      list.nodeList = [];
      list.lineList = [];
      nextTick(() => {
        // 这里模拟后台获取数据、然后加载
        data = lodash.cloneDeep(data);
        list.easyFlowVisible = true;
        // list = data;
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
    function changeNodeName(window) {
      for (let node of list.nodeList) {
        if (node.id == window.id && window.FILE.fileName) {
          let str = window.FILE.fileName;
          if (str.length > 12) {
            node.name =
              str.substring(0, 9) +
              "..." +
              str.split(".")[str.split(".").length - 1];
          } else {
            node.name = str;
          }
          console.log("node.name.length", node.name.length);
          break;
        }
      }
    }
    //上传文件
    function uploadFiles(window) {
      var formData = new FormData($("#form" + window.wid)[0]);
      console.log("formData", window.wid);
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:5000",
        // url: "http://182.92.194.235:8000/users/register",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: (res) => {},
      });
      changeNodeName(window);
    }
    function uploadFiles1(window) {
      var formData = new FormData($("#form" + window.wid)[0]);
      console.log("formData", window.wid);
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:5000",
        // url: "http://182.92.194.235:8000/users/register",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: (res) => {
          ElMessage({
            message: res.respone,
            type: "success",
          });
        },
        error: (err) => {
          alert(err);
        },
      });
    }
    function uploadFiles2(window) {
      var formData = new FormData($("#form" + window.wid)[0]);
      console.log("formData", window.wid);
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:5000",
        // url: "http://182.92.194.235:8000/users/register",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: (res) => {
          ElMessage({
            message: res,
            type: "success",
          });
          console.log("res.response", res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    //计算矩阵维度
    function computeSize(window) {
      if (window.dataEncodingType === "dict") {
        window.size = String(window.input) + "*1";
      } else if (window.dataEncodingType === "oneHot") {
        if (window.dataType === "DNA" || window.dataType === "RNA") {
          window.size = String(window.input) + "* 4";
        } else if (window.dataType === "protein") {
          window.size = String(window.input) + "* 20";
        }
      }
    }

    //读取文件
    function fileInfo(callback, window) {
      // 获取input标签选择的文件,并选择第一条

      let resultFile = document.getElementById(window.wid).files[0];
      console.log(window.wid);
      // 如果文件存在

      if (resultFile) {
        // 获取文件信息
        window.FILE.file = resultFile;
        // 获取文件名
        window.FILE.fileName = resultFile.name;

        // 使用 FileReader 来读取文件
        let reader = new FileReader();

        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(resultFile, "UTF-8");

        // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
        reader.onload = function (e) {
          let fileContent = e.target.result;

          // 若为回调函数,则触发回调事件
          if (callback && typeof callback === "function") {
            callback(fileContent, window);
          }
        };
      }
    }
    //提取获得的文件内容
    function getFileContent(fileContent, window) {
      window.FILE.fileContent = fileContent;
    }
    //关闭时的提示
    const handleClose = (done) => {
      ElMessageBox.confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch
        });
    };
    // 点击添加console
    function addConsole() {
      console.log(FlowConsoles.value);
      FlowConsoles.value.addConsoleList();
    }
    return {
      fileInfo,
      FlowConsoles,
      getFileContent,
      handleClose,
      list,
      nodes,
      flowTool,
      flowInfo,
      findLinefrom,
      isMAT,
      computeSize,
      changeNodeSite,
      addNode,
      deleteNode,
      editNode,
      dataInfo,
      dataReloadA,
      dataEncodingType: ref(null),
      uploadFiles,
      uploadFiles1,
      uploadFiles2,
      dataFromBack,
      addConsole,
    };
  },
});
</script>
<style>
p {
  white-space: nowrap;
}
#flowContainer {
  /* background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%); */
  background-size: 10px 10px;
  /* height: 900px; */
  background-color: rgb(251, 251, 251);
  height: 650px;
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

#scrollbar {
  width: 600px;
}

#hiddenInput {
  float: left;
  z-index: -1;
  /* width: 0px;
  height: 0px; */
}
.FlowConsoles {
  position: fixed;
  bottom: 0px;
  width: 87.5%;
}
.file {
  margin-top: 20px;
}
.select {
  display: grid;
  grid-template-columns: 5% repeat(3, 30%) 5%;
  justify-items: center;
  align-items: center;
  height: 40px;
  margin-bottom: 10px;
  user-select: none;
  /* background-color: #fff; */
}
.select .chooseBox1 {
  grid-column-start: 2;
  font-size: large;
  padding: 7px;
}
.select .chooseBox1:hover {
  grid-column-start: 2;
  background-color: pink;
  box-shadow: 6px 0px 10px rgba(0, 204, 204, 0.5);
}
.select .chooseBox2 {
  grid-column-start: 4;
  font-size: large;
  padding: 7px;
}
.select .chooseBox2:hover {
  grid-column-start: 4;
  background-color: pink;
  box-shadow: 6px 0px 10px rgba(0, 204, 204, 0.5);
}
.listDataP {
  height: 300px;
}
</style>
