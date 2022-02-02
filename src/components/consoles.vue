<template>
  <div
    class="page"
    @mouseup="mouseUp"
    :style="'height:' + lastH + 'px;cursor:' + mouseType + ';'"
    ref="conspage"
  >
    <div class="line" @mousedown="mouseDown" @mouseup="mouseUp"></div>
    <div class="tool">
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
      <div class="rightTool" @click="unfoldConsole" v-show="lastH <= 40">
        <el-icon size="bigSize"><caret-top /></el-icon>
      </div>
      <div class="rightTool" @click="foldConsole" v-show="lastH > 40">
        <el-icon size="bigSize"><caret-bottom /></el-icon>
      </div>
    </div>
    <div
      class="consolePanel"
      v-for="cons in consoleSet.consoleList"
      :key="cons.id"
    >
      <div v-show="cons.table">这是一个控制台{{ cons.id }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import VueDragResize from "vue-drag-resize";
import { CaretTop, CaretBottom, CloseBold } from "@element-plus/icons-vue";
export default defineComponent({
  name: "App",
  components: {
    VueDragResize,
    CaretTop,
    CaretBottom,
    CloseBold,
  },
  setup(props, context) {
    const table = ref(false);
    const mouseType = ref("default");
    let lastY = ref();
    let lastH = ref(40);
    let consoleSet = reactive({
      consoleList: [
        {
          id: 1,
          table: false,
        },
      ],
    });
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
      };
      list.push(cons);
    }
    function unfoldConsole() {
      lastH.value = 150;
    }
    function foldConsole() {
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
      tinySize: 10,
      bigSize: 20,
      mouseDown,
      mouseUp,
      showConsole,
      addConsoleList,
      deleteConsoleList,
      unfoldConsole,
      foldConsole,
      getID,
    };
  },
});
</script>
<style>
.page {
  width: 100%;
  background-color: #fff;
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
}
.tool {
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