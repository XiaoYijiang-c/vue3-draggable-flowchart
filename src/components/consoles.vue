<template>
  <div
    class="page"
    @mouseup="mouseUp"
    :style="'height:' + lastH + 'px;cursor:' + mouseType + ';'"
    ref="conspage"
  >
    <div class="line" @mousedown="mouseDown" @mouseup="mouseUp"></div>
    <div class="tool_console">
      <span
        class="consoleList"
        v-for="cons in consoleSet.consoleList"
        :key="cons.id"
      >
        <div class="cons">
          <el-button type="text" @click="showConsole(cons)"
            >Console{{ cons.id }}</el-button
          >
          <div class="deleteIcon" @click="deleteConsoleList(cons)">
            <el-icon size="tinySize"><close-bold /></el-icon>
          </div>
        </div>
      </span>
      <span style="float: right">
        <el-button type="text" @click="open" style="margin-right: 10px"
          >打开</el-button
        >
        <el-button
          type="text"
          @click="copyConsole"
          style="margin-right: 10px"
          >{{ txt.copy }}</el-button
        >

        <div class="rightTool" @click="unfoldConsole" v-show="lastH <= 40">
          <el-icon size="bigSize"><caret-top /></el-icon>
        </div>
        <div class="rightTool" @click="foldConsole" v-show="lastH > 40">
          <el-icon size="bigSize"><caret-bottom /></el-icon>
        </div>
      </span>
    </div>
    <div
      class="consolePanel"
      v-for="cons in consoleSet.consoleList"
      :key="cons.id"
    >
      <div
        v-show="cons.table"
        class="consolePanelData"
        id="consolePanelData"
        :style="'height:' + (lastH - 40) + 'px;'"
      >
        <div v-for="sp in cons.consoleData" :key="sp">
          {{ sp }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { get_chinese } from "./js/Chinese";
import { get_English } from "./js/English";
import { defineComponent, reactive, ref, watch } from "vue";
import { CaretTop, CaretBottom, CloseBold } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import $ from "jquery";
export default defineComponent({
  name: "App",
  components: {
    CaretTop,
    CaretBottom,
    CloseBold,
  },
  props: { editableTabsValue: String },
  setup(props) {
    let txt = ref({});
    let notif = ref("");
    txt.value = get_chinese().consoles;
    function switch_status(status) {
      if (status) {
        txt.value = get_English().consoles;
      } else {
        txt.value = get_chinese().consoles;
      }
    }
    const table = ref(false);
    const mouseType = ref("default");
    let lastY = ref();
    let lastH = ref(40);
    let consoleData = ref(["1", "1"]);
    let consoleSet = reactive({
      consoleList: [
        {
          id: 1,
          table: false,
          consoleData: ref(["1", "1"]),
        },
      ],
    });
    console.log(consoleSet.consoleList[0]);
    let console_update = null;

    watch(table, (newVal, oldVal) => {
      console.log("11111", newVal, oldVal);

      if (newVal) {
        console.log(props);

        console_update = setInterval(() => {
          let data = {
            name: props.editableTabsValue,
            consoleID: null,
          };
          for (let sp of consoleSet.consoleList) {
            if (sp.table) {
              data.consoleID = sp.id;
              break;
            }
          }
          axios.post("http://127.0.0.1:5001", data).then((res) => {
            // item.consoleData = res.data.result;
            for (let item of consoleSet.consoleList) {
              if (item.table) {
                item.consoleData = res.data.result;
                break;
              }
            }
            let showContent = $(".consolePanelData");
            showContent[0].scrollTop = showContent[0].scrollHeight;
            if (res.data.finish == "finish") {
              clearInterval(console_update);
              axios
                .post("http://127.0.0.1:5000", {
                  responseType: "arraybuffer",
                  operation: "getsave",
                  ...data,
                })
                .then((res) => {
                  console.log("res.data", res.data);
                  let result = res.data.result;

                  for (let st of result) {
                    // let str = st.url;
                    notif.value +=
                      "<li>" +
                      st.name +
                      ":<a href='" +
                      st.url +
                      "'  target='_blank' >" +
                      st.name +
                      "</a>" +
                      "</li>";
                  }
                  open();
                });
            }
            console.log("consoleData.value", consoleData.value, res);
          });
        }, 5000);
      } else {
        console.log("clear");
        clearInterval(console_update);
      }
    });
    function open() {
      ElNotification({
        title: "Finish",
        dangerouslyUseHTMLString: true,
        message: "<ul>" + notif.value + "</ul>",
        position: "bottom-right",
        duration: 0,
      });
    }
    function openWindow(url) {
      let urls = window.URL.createObjectURL("http://10.133.60.229:8080" + url);
      console.log("urls", urls);
      window.open(urls, "_blank");
    }
    function copyConsole() {
      const clipboardObj = navigator.clipboard;
      let data = "";
      for (let item of consoleSet.consoleList) {
        if (item.table) {
          for (let sp of item.consoleData) {
            data += sp;
            data += "\n";
          }
        }
      }
      if (data) {
        clipboardObj.writeText(data).then(() => {
          ElNotification({
            title: "Success",
            message: "复制成功:" + data,
            type: "success",
          });
        });
      } else {
        ElNotification({
          title: "Warning",
          message: "未打开任何控制台",
          type: "warning",
        });
      }
    }
    function getID() {
      for (let Console of consoleSet.consoleList) {
        if (Console.table == true) return Console.id;
      }
    }
    function mouseDown(event) {
      document.addEventListener("mousemove", mouseMove);
      lastY.value = event.screenY;
      mouseType.value = "n-resize";
      // document.getElementsByClassName("page")[0].style.cursor = "n-resize";
    }
    function mouseMove(e) {
      if (lastH.value > 40) {
        lastH.value += lastY.value - e.screenY;
      }
      lastY.value = e.screenY;
    }
    function mouseUp() {
      if (lastH.value <= 0) {
        lastH.value = 0;
      }
      lastY.value = 0;
      document.removeEventListener("mousemove", mouseMove);
      document.onmousemove = null;
      document.onmouseup = null;
      mouseType.value = "default";
    }
    function showConsole(cons) {
      let list = consoleSet.consoleList;
      for (let cnt = 0; cnt < list.length; cnt++) {
        if (list[cnt].id == cons.id) {
          if (list[cnt].table == true) {
            list[cnt].table = false;
          } else list[cnt].table = true;
        } else {
          list[cnt].table = false;
        }
      }
      if (cons.table && lastH.value == 0) {
        lastH.value += 50;
      }
    }
    function addConsoleList() {
      let list = consoleSet.consoleList;
      let id = 1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
          id++;
        }
      }
      let cons = {
        id: id,
        table: false,
        consoleData: [],
      };
      list.push(cons);
    }
    function unfoldConsole() {
      table.value = true;
      lastH.value = 150;
    }
    function foldConsole() {
      table.value = false;
      lastH.value = 40;
    }
    function deleteConsoleList(cons) {
      console.log(cons.id + 1);
      let list = consoleSet.consoleList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == cons.id) {
          list.splice(i, 1);
        }
      }
      // delete consoleSet.consoleList[Number(cons.id)];
    }
    return {
      table,
      lastY,
      lastH,
      consoleSet,
      mouseType,
      consoleData,
      tinySize: 10,
      bigSize: 20,
      txt,
      switch_status,
      open,
      openWindow,
      mouseDown,
      mouseUp,
      showConsole,
      addConsoleList,
      deleteConsoleList,
      unfoldConsole,
      foldConsole,
      getID,
      copyConsole,
    };
  },
});
</script>
<style>
.page {
  width: 100%;
  background-color: #fff;
}
.consolePanelData {
  overflow-y: auto;
  overflow-x: hidden;
}
li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.line {
  width: 100%;
  height: 5px;
  background-color: #fff;
}
.line:hover {
  background-color: rgb(0, 0, 0);
  cursor: n-resize;
}
.contralList {
  height: 50px;
}
.cons {
  display: -webkit-inline-box;
  padding-left: 15px;
  padding-right: 20px;
}
.consolePanel {
  padding-left: 30px;
  background-color: rgb(231, 231, 231);
}
.tool_console {
  height: 40px;
  width: 100%;
}
.leftTool {
  float: left;
}
.rightTool {
  float: right;
  width: 30px;
  margin-top: 6px;
  margin-right: 20px;
}
.deleteIcon {
  float: right;
}
</style>