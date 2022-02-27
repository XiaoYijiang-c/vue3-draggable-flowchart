<template>
  <!-- 主组件 -->
  <div v-if="easyFlowVisible">
    <el-row>
      <el-col :span="3" >
        <flowTool @addNode="addNode" ref="flowTool" @fromCaddTab="fromCaddTab" @removeTab="removeTab"></flowTool>
      </el-col>
      <el-col :span="21">
        <el-row :span="3">
          <el-col :span="24">
            <div style="margin-bottom: 5px; margin-left: 10px">
              <span><el-link type="primary">{{ list.name }}</el-link>
              <el-button type="info" icon="el-icon-document" @click="uploadFlow"
                >{{panel_txt.top_meun.upload}}</el-button
              >
              <el-button
                type="primary"
                @click="dataReloadB"
                icon="el-icon-refresh"
                >{{panel_txt.top_meun.clear}}</el-button
              >
              <el-button
                type="success"
                icon="el-icon-refresh"
                @click="addConsole"
                >{{panel_txt.top_meun.add_console}}</el-button
              >
              <el-button type="info" @click="openAddtab">
                {{panel_txt.top_meun.add_tab}}
              </el-button>
              <el-button type="success" @click="save(editableTabsValue,list)">
                {{panel_txt.top_meun.save}}
              </el-button></span>
              <span style="float:right;"><el-button type="success" @click="switchLan">
                {{panel_txt.top_meun.switch_lan}}
              </el-button><el-button type="success" @click="deleteMeun(editableTabsValue)" :disabled="!editableTabsValue">
                {{panel_txt.top_meun.delete_tab}}
              </el-button></span>
            </div>
          </el-col>
          
        </el-row>
        <el-row :span="21">
          <el-col :span="24">
            <!--画布-->
            <el-tabs
              v-model="editableTabsValue"
              type="card"
              class="demo-tabs"
              closable
              
              @tab-remove="removeTab"
              :before-leave="switchTabs"
              ref="Tabs"
            >
              <el-tab-pane
                v-for="item in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                
              >
              </el-tab-pane>
            </el-tabs>
            <el-dialog v-model="newTabdialogVisible" title="Tips" width="30%" draggable destroy-on-close>
            <el-input v-model="newtabinput" placeholder="请输入新tab name"></el-input>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="newTabdialogVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="addTab"
                    >Confirm</el-button
                  >
                </span>
              </template>
            </el-dialog>
            <div id="flowContainer" class="container" ref="efContainer" v-show="consoleVisiable">
                  <template v-for="node in list.nodeList" :key="node.id">
                    <flow-node
                      :ref="nodes"
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
                      :title="panel_txt.window.tc.title"
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
                        class="form"
                        ref="dataForm"
                        label-width="80px"
                        :id="'form' + window.wid"
                        @change="computeSize(window)"
                      >
                      <el-form-item :label="panel_txt.window.tc.data_type">
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
                        <el-form-item :label="panel_txt.window.tc.data_enc_type" v-show="window.dataType !='other'">
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
                            :placeholder="panel_txt.window.tc.placeholder"
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

                        <el-form-item :label="panel_txt.window.tc.mat_size" v-show="window.dataType !='other'"
                          >{{ window.size }}
                        </el-form-item>
                        <el-form-item :label="panel_txt.window.tc.file_upload" >
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
                            >{{panel_txt.window.footer.cancel}}</el-button
                          >
                          <el-button
                            type="primary"
                            @click="
                              (window.nodeFormVisible = false), changeNodeName(window)
                            "
                            >{{panel_txt.window.footer.confirm}}</el-button
                          >
                        </span>
                      </template>
                    </el-dialog>                    
                    <!-- v-if="window.type === 'list'" -->                    
                    <el-dialog
                      title="DataList"
                      v-model="window.nodeFormVisible"
                      v-if="window.type === 'list'"
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
                      :title="panel_txt.window.zdy.title"
                      class="zdy"
                      v-model="window.nodeFormVisible"
                      width="50%"
                      :before-close="handleClose"
                      v-if="window.type === 'zdy'"
                      center
                    >
                      <el-form
                        ref="dataForm"
                        label-width="140px"
                        label-position="left"
                        :id="'form' + window.wid"
                        class="form"
                      >
                        <el-form-item :label="panel_txt.window.zdy.file_type">
                          <el-radio-group v-model="window.fileType">
                            <el-radio-button label="py" name="modelfiletype"
                              >{{panel_txt.window.zdy.file_type_value1}}</el-radio-button
                            >
                            <el-radio-button label="json" name="modelfiletype"
                              >{{panel_txt.window.zdy.file_type_value2}}</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item
                          :label="panel_txt.window.zdy.file_type_value1"
                          v-show="window.fileType === 'py'"
                        >
                          <input
                            type="file"
                            name="model_py"
                            :id="window.wid"
                            class="file"
                            accept=".py"
                            @change="fileInfo(getFileContent, window)"
                          />
                        </el-form-item>
                        <el-form-item
                          :label="panel_txt.window.zdy.file_type_value2"
                          v-show="window.fileType === 'json'"
                        >
                          <input
                            type="file"
                            name="model_json"
                            :id="window.wid"
                            class="file"
                            accept=".json"
                            @change="fileInfo(getFileContent, window)"
                          />
                        </el-form-item>
                        <el-form-item :label="panel_txt.window.zdy.file_type">
                          <el-radio-group v-model="window.fileType2">
                            <el-radio-button label="1" name="hasweight"
                              >{{panel_txt.window.zdy.file_type_value3}}</el-radio-button
                            >
                            <el-radio-button label="0" name="hasweight"
                              >{{panel_txt.window.zdy.file_type_value4}}</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item
                          :label="panel_txt.window.zdy.file_upload_value"
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
                        <el-form-item label="batch_size">
                          <el-input v-model="window.batch_size" name="batch_size"/>
                        </el-form-item>
                        <el-form-item label="epochs">
                          <el-input v-model="window.epochs" name="epochs"/>
                        </el-form-item>
                        <el-input
                            name="dataType"
                            value="model"
                            style="display:none"
                          ></el-input>
                      </el-form>
                      <div class="jzbutton"><el-button size="small" @click="checkModel(window)">{{panel_txt.window.zdy.check_model}}</el-button></div>
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button @click="window.nodeFormVisible = false"
                            >{{panel_txt.window.footer.cancel}}</el-button
                          >
                          <el-button
                            type="primary"
                            @click="
                              (window.nodeFormVisible = false)
                            "
                            >{{panel_txt.window.footer.confirm}}</el-button
                          >
                        </span>
                      </template>
                    </el-dialog>                    
                    <!-- v-if="window.type === 'mat'" -->                    
                    <el-dialog
                      :title="panel_txt.window.mat.title"
                      v-model="window.nodeFormVisible"
                      v-if="window.type === 'mat'"
                      center
                    >
                      <el-form
                        class="form"
                        ref="dataForm"
                        label-width="140px"
                        label-position="left"
                        :id="'form' + window.wid"
                      >
                        <el-form-item :label="panel_txt.window.mat.mat_handle">
                          <el-radio-group v-model="window.standardizing">
                            <el-radio-button
                              label="standardization"
                              name="matHandle"
                              >{{panel_txt.window.mat.mat_handle_value1.value1}}</el-radio-button
                            >
                            <el-radio-button label="normalization" name="matHandle"
                              >{{panel_txt.window.mat.mat_handle_value2.value1}}</el-radio-button
                            >
                            <el-radio-button label="none" name="matHandle"
                              >{{panel_txt.window.mat.mat_handle_value3}}</el-radio-button
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
                            name="node-id"
                            v-model="window.id"
                            style="display:none"
                          ></el-input>
                        <el-form-item :label="panel_txt.window.mat.mat_handle_value2.value1" v-show="window.standardizing == 'normalization'">
                          <el-radio-group v-model="window.normalization">
                            <el-radio-button
                              label="row"
                              name="matNormalization"
                              >{{panel_txt.window.mat.mat_handle_value2.value2}}</el-radio-button
                            >
                            <el-radio-button label="col" name="matNormalization"
                              >{{panel_txt.window.mat.mat_handle_value2.value3}}</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="panel_txt.window.mat.mat_handle_value1.value1" v-show="window.standardizing == 'standardization'">
                          <el-radio-group v-model="window.standardization">
                            <el-radio-button
                              label="row"
                              name="matstandardization"
                              >{{panel_txt.window.mat.mat_handle_value1.value2}}</el-radio-button
                            >
                            <el-radio-button label="col" name="matstandardization"
                              >{{panel_txt.window.mat.mat_handle_value1.value3}}</el-radio-button
                            >
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item :label="panel_txt.window.mat.mat_handle_value4" v-show="window.standardizing === 'normalization'">
                            [<el-input-number v-model="window.negNormalizationNum" size="small" step=0.01 name="negNormalizationNum" :label="window.negNormalizationNum" :max="window.posNormalizationNum"/>
                            , <el-input-number v-model="window.posNormalizationNum" size="small" step="0.01" name="posNormalizationNum" :label="window.posNormalizationNum" :min="window.negNormalizationNum"/>]
                        </el-form-item>
                      </el-form>
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button @click="window.nodeFormVisible = false"
                            >{{panel_txt.window.footer.cancel}}</el-button
                          >
                          <el-button
                            type="primary"
                            @click="
                              (window.nodeFormVisible = false)
                            "
                            >{{panel_txt.window.footer.confirm}}</el-button
                          >
                        </span>
                      </template>
                    </el-dialog>
                    <!-- v-if="window.type === 'tag'" -->                    
                    <el-dialog
                      :title="panel_txt.window.tag.title"
                      v-model="window.nodeFormVisible"
                      v-if="window.type === 'tag'"
                      center
                    >
                    
                    <el-form
                        class="form"
                        ref="dataForm"
                        label-width="140px"
                        label-position="left"
                        :id="'form' + window.wid"
                      >
                      <el-form-item :label="panel_txt.window.tag.name" >
                          <el-input 
                            v-model="window.inputValue"
                            name="labelnum"
                            class="w-50 m-2"
                            placeholder="Pick a date"
                            autofocus="autofocus"/>
                        </el-form-item>
                        <el-form-item :label="panel_txt.window.tag.tip"><span>{{window.tip}}</span><input type="text" name="connect" style="display:none;" v-model="window.tip"></el-form-item>
                      </el-form>
                      <template #footer>
                        <span class="dialog-footer">
                          <el-button @click="(window.nodeFormVisible = false),(window.inputValue = null)"
                            >{{panel_txt.window.footer.cancel}}</el-button
                          >
                          <el-button
                            type="primary"
                            @click="
                              (window.nodeFormVisible = false)
                            "
                            >{{panel_txt.window.footer.confirm}}</el-button
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

    <!-- <flow-info
      v-if="flowInfoVisible"
      ref="flowInfo"
      :data="list"
    ></flow-info> -->
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  nextTick,
  ref,
  watch,
  onMounted,
} from "vue";
import { jsPlumb } from "jsplumb";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";
import flowNode from "@/components/node";
import flowTool from "@/components/tool";
// import FlowInfo from "@/components/info";
import FlowConsoles from "@/components/consoles";
import $ from "jquery";
import lodash from "lodash";
import { getDataA } from "./js/data_A";
import { getDataB } from "./js/data_B";
import { get_chinese } from "./js/Chinese";
import { get_English } from "./js/English";
import { Calendar } from "@element-plus/icons-vue";
import axios from "axios";

export default defineComponent({
  name: "App",
  components: {
    flowNode,
    flowTool,
    FlowConsoles,
  },
  setup() {
    //获取子组件
    // console.log(getDataA, getDataB);
    let urls = "http://182.92.194.235:8000/users/register";
    // let urls = "http://127.0.0.1:5000";
    const flowTool = ref(null);
    const flowInfo = ref(null);
    const FlowConsoles = ref();
    const panel_txt = ref({});
    const Tabs = ref(null);
    onMounted(() => {
      IndexLoading();
    });
    panel_txt.value = get_chinese().panel;
    console.log(panel_txt.value);
    let switch_status = ref(true);
    function switchLan() {
      if (switch_status.value) {
        panel_txt.value = get_English().panel;
        flowTool.value.switch_status(true);
        switch_status.value = get_English().status;
      } else {
        panel_txt.value = get_chinese().panel;
        flowTool.value.switch_status(false);
        switch_status.value = get_chinese().status;
      }
    }
    // const efContainer = ref(null);
    function IndexLoading() {
      axios
        .post(urls, { operation: "openindex" })
        .then((res) => {
          console.log(res.data.projectlist);
          for (let v of res.data.projectlist) {
            flowTool.value.addTabs(v);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    const itemRefs = ref([]);
    const nodes = (el) => {
      if (el) {
        itemRefs.value.push(el);
      }
    };
    //对节点的全局计数
    const INDEX = ref(0);
    // nodeType
    let uploadFilesType = ["txt", "csv", "zdy"];
    let transfrom = ["list", "mat", "tag", "train", "test"];
    let splice = ["col", "row"];
    //关于节点的属性设置
    let list = reactive({
      lineList: [],
      nodeList: [],
      windowList: [],
      index: 1,
    });
    let easyFlowVisible = ref(true);
    let flowInfoVisible = ref(false);
    // 关于标签栏的设置
    // let tabIndex = 2;
    const editableTabsValue = ref(null);
    const newTabdialogVisible = ref(false);
    const newtabinput = ref(null);
    const editableTabs = ref([
      // reactive({
      //   title: "Tab 1",
      //   name: "Tab 1",
      //   isSave: false,
      // }),
      // reactive({
      //   title: "Tab 2",
      //   name: "Tab 2",
      //   isSave: false,
      // }),
    ]);
    const consoleVisiable = ref(false);
    function deleteMeun(name) {
      flowTool.value.deleteMeun(name);
    }
    watch(editableTabs.value, (newVal, oldVal) => {
      console.log("11111", newVal, oldVal);
    });
    function changeTabColor(name, color) {
      let child = document.getElementsByClassName("el-tabs__item");
      child.forEach((item) => {
        if (item.outerText == name) {
          item.style.color = color;
        }
      });
    }
    function ChangeTag() {
      for (let v of editableTabs.value) {
        if (v.name == editableTabsValue.value) {
          v.isSave = false;
          console.log("changetag", v.isSave);
          changeTabColor(v.name, "red");
          break;
        }
      }
    }
    function save(name, list) {
      let list0 = list;
      for (let window of list0.windowList) {
        console.log("window", window);
        if (window.type === "txt" || window.type == "csv")
          delete window.FILE.fileContent;
      }
      let data = {
        operation: "savedata",
        name: name,
        list: list0,
      };
      axios.post(urls, data).then((res) => {
        console.log(urls, res);
        for (let v of editableTabs.value) {
          if (v.name == name) {
            v.isSave = true;
            changeTabColor(v.name, "pink");
            break;
          }
        }
      });
    }
    function openAddtab() {
      newTabdialogVisible.value = true;
    }
    const addTab = () => {
      let flag = true;
      console.log("addTab");

      if (newtabinput.value == null) {
        console.log("addFalse");
        newTabdialogVisible.value = false;
        flag = false;
        ElMessageBox.alert("未输入新tab name", "错误", {
          type: "warning",
          confirmButtonText: "确定",
        });
      }
      const newTabName = newtabinput.value;
      newtabinput.value = null;
      let data = {
        name: newTabName,
        operation: "newproject",
      };
      if (flag) {
        axios
          .post(urls, data)
          .then((res) => {
            console.log("newTabName", res.data);
            if (res.data.result != "项目已存在") {
              flowTool.value.addTabs(newTabName);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }

      newTabdialogVisible.value = false;
      // editableTabsValue.value = newTabName;
    };
    const fromCaddTab = (name) => {
      console.log("fromCaddTab");
      let flag = true;
      for (let i of editableTabs.value) {
        if (i.name == name) {
          flag = false;
          break;
        }
      }
      if (flag) {
        if (editableTabs.value.length == 0) {
          // editableTabsValue.value = name;
          // consoleVisiable.value = true;
          // changeTagReload(editableTabsValue.value);
          // editableTabsValue.value = null;
          switchTabs(name, null);
        }
        editableTabs.value.push(
          reactive({
            title: name,
            name: name,
            isSave: false,
          })
        );
      }
    };
    const removeTab = (targetName) => {
      const tabs = editableTabs.value;
      // let activeName = editableTabsValue.value;

      setEmptyFlow();
      editableTabsValue.value = null;
      consoleVisiable.value = false;
      editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
      console.log("flowTool.value", flowTool.value);

      // if (activeName === targetName) {
      //   tabs.forEach((tab, index) => {
      //     if (tab.name === targetName) {
      //       const nextTab = tabs[index + 1] || tabs[index - 1];
      //       if (nextTab) {
      //         activeName = nextTab.name;
      //       }
      //     }
      //   });
      // }
      // editableTabsValue.value = activeName;
    };
    function setEmptyFlow() {
      list.nodeList = [];
      list.lineList = [];
      list.windowList = [];
      list.index = 1;
      // dataReload(list);
      // allJsPlumb.jsPlumb.deleteEveryConnection();
      // console.log(connections);
      // for (var i in connections) {
      //   console.log(connections[i].sourceId, connections[i].targetId);
      // }
    }

    function changeTagReload(item) {
      consoleVisiable.value = true;
      let data = {
        name: item,
        operation: "openproject",
      };
      axios
        .post(urls, data)
        .then((res) => {
          console.log("res.data", res.data);
          let resData = res.data.list;
          // let data = JSON.parse(res.data);
          let data = {
            windowList: resData.windowList,
            nodeList: resData.nodeList,
            lineList: resData.lineList,
            index: resData.index,
          };
          // dataReload(res.data.list);
          dataReload(data);
          // console.log("data", data);
          // setEmptyFlow();
          // dataReloadA();
          console.log("111");
        })
        .catch((e) => {
          console.log(e);
        });
      // console.log("changeTagReload", item);
    }
    // function switchTabs(activeName, oldActiveName) {
    //   for (let v of editableTabs.value) {
    //     if (v.name == oldActiveName && v.isSave == false) {
    //       changeTagReload(activeName);

    //       ElMessageBox.confirm("未保存流程，是否保存？")
    //         .then(() => {
    //           console.log("List", list);
    //           save(oldActiveName, list);
    //         })
    //         .catch(() => {
    //           editableTabsValue.value = activeName;
    //         });

    //       return true;
    //     }
    //   }
    // }
    async function switchTabs(activeName, oldActiveName) {
      for (let v of editableTabs.value) {
        if (v.name == oldActiveName && v.isSave == false) {
          allJsPlumb.jsPlumb.deleteEveryConnection();
          ElMessageBox.confirm("未保存流程，是否保存？")
            .then(() => {
              console.log("List", list);
              save(oldActiveName, list);
            })
            .catch(() => {
              editableTabsValue.value = activeName;
            })
            .finally(() => {
              allJsPlumb.jsPlumb.deleteEveryConnection();
              changeTagReload(activeName);
            });

          // changeTagReload(activeName);
        } else if (v.name == oldActiveName && v.isSave) {
          allJsPlumb.jsPlumb.deleteEveryConnection();
          changeTagReload(activeName);
        }
      }
      // setEmptyFlow();
      if (activeName && oldActiveName == null) {
        if (editableTabs.value.length != 1) {
          editableTabsValue.value = activeName;
          changeTagReload(activeName);
        } else if (editableTabs.value.length == 1 && !consoleVisiable.value) {
          editableTabsValue.value = activeName;
          changeTagReload(activeName);
        }
        consoleVisiable.value = true;
        console.log("editableTabs.value.length", editableTabs.value.length);
      }
      // if (activeName && oldActiveName != 0) {
      //   changeTagReload(activeName);
      // }

      console.log("acti", activeName, oldActiveName);
      // //
      // return true;
    }
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

    //绘制流程图
    function loadEasyFlow() {
      // 初始化各个节点的位置
      itemRefs.value.forEach((item) => {
        for (let node of list.nodeList) {
          if (item.node.id == node.id) {
            console.log("item", item);
            // item.editNode();
            // item.editNode();
            item.nodes.style.left = node.left;
            item.nodes.style.top = node.top;
          }
        }
      });
      //绘制节点
      // for (let i = 0; i < list.nodeList.length; i++)
      for (let node of list.nodeList) {
        // let node = list.nodeList[i];
        // let window = list.windowList[i];
        // window.nodeFormVisible = false;
        // 设置源点，可以拖出线连接其他节点
        allJsPlumb.jsPlumb.makeSource(node.id, allJsPlumb.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        allJsPlumb.jsPlumb.makeTarget(node.id, allJsPlumb.jsplumbTargetOptions);

        allJsPlumb.jsPlumb.draggable(node.id, {
          containment: "parent",
        });
      }
      // 绘制线
      for (let i = 0; i < list.lineList.length; i++) {
        console.log("1");
        let line = list.lineList[i];
        let connParam = {
          source: line.from,
          target: line.to,
        };
        allJsPlumb.jsPlumb.connect(
          connParam,
          allJsPlumb.jsPlumb.jsplumbConnectOptions
        );
      }
      nextTick(() => {
        allJsPlumb.loadEasyFlowFinish = true;
      });
    }
    //删除线
    function deleteLine(from, to) {
      ChangeTag();
      list.lineList = list.lineList.filter(function (line) {
        return line.from !== from && line.to !== to;
      });
    }

    //对是否连线的逻辑判断
    function hasLine(from, to) {
      for (let i = 0; i < list.lineList.length; i++) {
        let line = list.lineList[i];
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
      for (let i = 0; i < list.nodeList.length; i++) {
        let node1 = list.nodeList[i];
        if (node1.id === from) {
          for (let cnt = 0; cnt < list.nodeList.length; cnt++) {
            let node2 = list.nodeList[cnt];
            let nType1 = node1.type;
            let nType2 = node2.type;
            console.log(splice, nType1, transfrom, nType2);
            if (node2.id === to) {
              // if (uploadFilesType.includes(nType2)) {
              //   // 上传节点不可互连 且不可被连接
              //   return true;
              // } else if (nType1 === "list") {
              //   // list只能被连接
              //   console.log(splice);
              //   return true;
              // } else if (
              //   splice.includes(nType2) &&
              //   !transfrom.includes(nType1)
              // ) {
              //   // 只能拼接矩阵
              //   return true;
              // } else if (
              //   transfrom.includes(nType2) &&
              //   transfrom.includes(nType1)
              // ) {
              //   // 矩阵只能转换文件节点
              //   return true;
              // }
            }
          }
        }
      }
      return false;
    }
    function limitDataTable(from, to) {
      console.log("to", to);

      for (let i = 0; i < list.nodeList.length; i++) {
        if (list.nodeList[i].id == to) {
          if (
            list.nodeList[i].type === "list" ||
            list.nodeList[i].type === "mat"
          ) {
            for (let cnt = 0; cnt < list.lineList.length; cnt++) {
              let line = list.lineList[cnt];
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
      for (let i = 0; i < list.nodeList.length; i++) {
        let node1 = list.nodeList[i];
        if (node1.id === from) {
          for (let cnt = 0; cnt < list.nodeList.length; cnt++) {
            let node2 = list.nodeList[cnt];
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

          list.lineList.push({
            from: from,
            to: to,
          });
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
              // console.log(nodeForm.value);
              // nodeForm.value.uploadFile();
            }
          }
          return true;
        });
      });
    }
    //改变节点位置 实现可拖拽布局
    function changeNodeSite(data) {
      ChangeTag();
      for (let i = 0; i < list.nodeList.length; i++) {
        let node = list.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    }
    // 对火狐浏览器兼容
    function isFirefox() {
      let userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    }
    //构建window
    function buildWindow(node, index) {
      let txtwindow = {
        dataEncodingType: ref(null),
        dataType: ref(null),
        input: ref(0),
        size: ref(),
        FILE: reactive({
          file: {},
          fileName: "",
          fileContent: "",
        }),
      };
      let zdywindow = {
        fileType: ref("py"),
        fileType2: ref("1"),
        batch_size: ref(0),
        epochs: ref(0),
      };
      let matwindow = {
        standardizing: ref("none"),
        standardizion: ref("row"),
        normalization: ref("col"),
        posNormalizationNum: ref(0),
        negNormalizationNum: ref(0),
      };
      let listwindow = {
        showData: ref(null),
      };
      let tagwindow = {
        tip: ref(null),
        tagName: ref(null),
        inputValue: ref(null),
      };
      let basewindow = {
        id: "node" + index,
        wid: index,
        type: node.type,
        nodeFormVisible: false,
        lineFrom: ref(null),
      };
      let wType = node.type;
      if (wType == "txt" || wType == "csv") {
        let window = {
          ...basewindow,
          ...txtwindow,
        };
        return window;
      } else if (wType == "zdy") {
        let window = {
          ...zdywindow,
          ...basewindow,
        };
        return window;
      } else if (wType == "mat") {
        let window = {
          ...matwindow,
          ...basewindow,
        };
        return window;
      } else if (wType == "list") {
        let window = {
          ...listwindow,
          ...basewindow,
        };
        return window;
      } else if (wType == "tag") {
        let window = {
          ...tagwindow,
          ...basewindow,
        };
        return window;
      } else {
        return basewindow;
      }
    }
    //添加节点
    function addNode(evt, nodeMenu, mousePosition, name) {
      if (consoleVisiable.value) {
        ChangeTag();
        console.log("添加节点", evt, nodeMenu);
        console.log("flowTool.value", flowTool.value);
        // let width = flowTool.value.$el.clientWidth;
        const index = list.index++;
        let nodeId = "node" + index;
        let left = evt.originalEvent.clientX;
        let top = evt.originalEvent.clientY;
        //居中
        left -= 300;
        top -= 120;
        if (isFirefox()) {
          console.log("INFIREFOX");
          left = mousePosition.left;
          top = mousePosition.top;
          //居中
          left -= 100;
          top -= 75;
        }

        let node = {
          id: "node" + index,
          wid: index,
          name: name,
          type: nodeMenu.type,
          left: left + "px",
          top: top + "px",
          ico: nodeMenu.ico,
          show: true,
        };
        list.windowList.push(buildWindow(node, index));
        // console.log(nodes.value);
        list.nodeList.push(node);
        INDEX.value++;
        // list = { 1: "1", 2: "2" };
        nextTick(() => {
          // 绘制添加的新节点
          itemRefs.value.forEach((item) => {
            for (let node of list.nodeList) {
              if (item.node.id == node.id) {
                item.nodes.style.left = node.left;
                item.nodes.style.top = node.top;
              }
            }
          });

          console.log(typeof node.top);
          try {
            allJsPlumb.jsPlumb.makeSource(
              nodeId,
              allJsPlumb.jsplumbSourceOptions
            );

            allJsPlumb.jsPlumb.makeTarget(
              nodeId,
              allJsPlumb.jsplumbTargetOptions
            );

            allJsPlumb.jsPlumb.draggable(nodeId, {
              containment: "parent",
            });
          } catch (e) {
            console.log(e);
          }
        });
      }
    }
    //删除节点
    function deleteNode(Node) {
      ChangeTag();
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
      ChangeTag();
      for (let cnt = 0; cnt < list.nodeList.length; cnt++) {
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
          } else if (node.type === "tag") {
            if (findLinefrom(window)) {
              window.tip =
                panel_txt.value.window.tag.tip + findLinefrom(window);
            } else {
              window.tip = "no connect";
            }
            console.log(window.tip);
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

    // function dataInfo() {
    //   flowInfoVisible.value = true;
    //   nextTick(() => {
    //     flowInfo.value.init();
    //     flowInfo.value.dataAll
    //       .then((res) => {
    //         // console.log("flowInfo.value.dataALL", res.data.rowjointdata);
    //         console.log("flowInfo.value.dataALL", res.lineList);
    //         dataFromBack.value = res.data.rowjointdata;
    //       })
    //       .catch((e) => {
    //         console.log(e);
    //       });
    //   });
    // }
    //获取初始画布信息
    function dataReload(data) {
      // easyFlowVisible.value = false;
      itemRefs.value = [];
      list.nodeList = [];
      list.lineList = [];
      list.windowList = [];
      list.index = 1;
      nextTick(() => {
        // 这里模拟后台获取数据、然后加载
        data = lodash.cloneDeep(data);
        // easyFlowVisible.value = true;
        console.log("data", data);
        console.log("list", list);
        // list = data;
        /*
         原先的list = data list是reactive类型 而data是对象
        直接赋值出现一堆bug
        list丢失响应式
         */
        list.lineList = data.lineList;
        list.nodeList = data.nodeList;
        list.windowList = data.windowList;
        list.index = data.index;
        nextTick(() => {
          allJsPlumb.jsPlumb = jsPlumb.getInstance();
          nextTick(() => {
            jsPlumbInit();
          });
        });
      });
    }
    function dataReloadA() {
      console.log("getDataA()", getDataA());
      // 每次添加新的ref前都要置空
      itemRefs.value = [];
      dataReload(getDataA());
    }
    function dataReloadB() {
      // 每次添加新的ref前都要置空
      itemRefs.value = [];
      dataReload(getDataB());
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
    //上传流程
    function uploadFlow() {
      let formdata = new FormData();
      formdata.append("name", editableTabsValue.value);
      formdata.append("operation", "execute");
      formdata.append("order", "1");
      console.log("?", list.windowList);
      for (let i = 0; i < $(".form").length; i++) {
        let formData = new FormData($(".form")[i]);
        // console.log("formData.get('file')", );
        formData.forEach((value, key) => {
          if (key != "file") {
            formdata.append("node[" + i + "][" + key + "]", value);
            console.log(i, key, ":", value);
          } else {
            if (value) {
              formdata.append("file[]", value);
            } else {
              formdata.append("file[]", "null");
            }
          }
          if (value == "mat" || value == "modelfiletype") {
            formdata.append("file[]", "null");
          }
        });
      }
      console.log("formData", formdata.getAll("file[]"));
      let datas = {};
      datas.lineList = list.lineList;
      datas.nodeList = list.nodeList;
      datas.name = editableTabsValue.value;
      datas.operation = "execute";
      datas.order = "2";
      $.ajax({
        type: "post",
        // url: urls,
        url: urls,
        data: formdata,
        traditional: true,
        cache: false,
        processData: false,
        contentType: false,
        success: (res) => {
          console.log(res);
          axios.post(urls, datas).then((res) => {
            console.log(res);
          });
        },
      });
    }
    function checkModel(window) {
      let formData = new FormData($("#form" + window.wid)[0]);
      console.log("formData", window.wid);
      formData.append("name", editableTabsValue.value);
      formData.append("operation", "trymodel");

      $.ajax({
        type: "post",
        url: urls,
        // url: urls,
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
      switchLan,
      editableTabs,
      editableTabsValue,
      addTab,
      deleteMeun,
      newTabdialogVisible,
      newtabinput,
      openAddtab,
      removeTab,
      fileInfo,
      easyFlowVisible,
      flowInfoVisible,
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
      dataReloadA,
      dataReloadB,
      dataEncodingType: ref(null),
      uploadFlow,
      checkModel,
      dataFromBack,
      addConsole,
      changeNodeName,
      changeTagReload,
      switchTabs,
      save,
      Tabs,
      consoleVisiable,
      fromCaddTab,
      panel_txt,
      Calendar,
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
  height: 600px;
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
.demo-tabs > .el-tabs__content {
  z-index: 2000;
  padding: 0px;
  background-color: rgb(251, 251, 251);
  color: rgb(251, 251, 251);
  font-size: 12px;
  font-weight: 600;
}
.el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 0 0px !important;
}
.jzbutton {
  display: flex;
  align-items: center;
  justify-self: center;
}
/* .el-tabs__item.is-active {
  color: grey !important;
} */
</style>
