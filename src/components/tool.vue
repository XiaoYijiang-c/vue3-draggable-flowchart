<template>
  <div ref="tool" class="tool">
    <div>
      <el-menu :default-openeds="dataBase.defaultOpeneds">
        <el-submenu
          v-for="(menu, index) in dataBase.menuList"
          :index="menu.type + index"
          :key="menu.type + index"
        >
          <template #title>
            <i :class="menu.ico"></i>
            <span>{{ menu.name }}</span>
          </template>
          <!--一级菜单名称、不可拖拽 -->

          <!--一级菜单子菜单、可拖拽菜单-->
          <el-menu-item-group>
            <draggable
              @end="addNode"
              @choose="move"
              :list="menu.children"
              item-key="name"
              :options="dataBase.draggableOptions"
            >
              <template #item="{ element }">
                <el-menu-item
                  :index="element.type"
                  :key="element.type"
                  :type="element.type"
                >
                  <i :class="element.ico"></i>{{ element.name }}
                </el-menu-item>
              </template>
            </draggable>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu
          v-for="(menu, index) in tabsList.menuList"
          :index="menu.type + index + 3"
          :key="menu.type + index"
          v-model="menu.name"
        >
          <template #title>
            <span>{{ menu.name }}</span>
          </template>
          <el-menu-item
            v-for="(item, index) in menu.children"
            :key="item.type + index"
            :index="item.type + index"
            @click="click1(item.name)"
            @contextmenu.prevent="deleteMeun(item.name)"
            >{{ item.name }}</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import draggable from "vuedraggable";
import { ElMessageBox } from "element-plus";
import axios from "axios";
import { get_chinese } from "./js/Chinese";
import { get_English } from "./js/English";
export default defineComponent({
  name: "tool",
  components: {
    draggable,
  },
  setup(props, context) {
    let urls = "http://182.92.194.235:8000/users/register";
    // let urls = "http://127.0.0.1:5000";

    let txt = ref({});
    txt.value = get_chinese().tool;
    var mousePosition = reactive({
      left: -1,
      top: -1,
    });
    function switch_status(status) {
      if (status) {
        console.log("switch_lan", txt.value);
        txt.value = get_English().tool;
      } else {
        console.log("switch_lan", txt.value);

        txt.value = get_chinese().tool;
      }
    }

    const dataBase = {
      draggableOptions: {
        preventOnFilter: false,
      },
      defaultOpeneds: ["group0"],
      menuList: reactive([
        {
          type: "group",
          name: txt.value.f_name.upload_file,
          ico: "el-icon-video-play",
          children: [
            {
              type: "txt",
              name: txt.value.c_name.txt,
              ico: "el-icon-time",
            },
            {
              type: "csv",
              name: txt.value.c_name.csv,
              ico: "el-icon-odometer",
            },
            {
              type: "zdy",
              name: txt.value.c_name.zdy,
              ico: "el-icon-odometer",
            },
          ],
        },
        {
          type: "group",
          name: txt.value.f_name.data_change,
          ico: "el-icon-video-pause",
          children: [
            {
              type: "list",
              name: txt.value.c_name.data_table,
              ico: "el-icon-caret-right",
            },
            {
              type: "mat",
              name: txt.value.c_name.mat,
              ico: "el-icon-shopping-cart-full",
            },
          ],
        },
        {
          type: "group",
          name: txt.value.f_name.mat_build,
          ico: "el-icon-video-play",
          children: [
            {
              type: "col",
              name: txt.value.c_name.col,
              ico: "el-icon-time",
            },
            {
              type: "row",
              name: txt.value.c_name.row,
              ico: "el-icon-odometer",
            },
          ],
        },
      ]),
      nodeMenu: {},
    };
    const tabsList = reactive({
      draggableOptions: {
        preventOnFilter: false,
      },
      defaultOpeneds: ["group0"],
      menuList: [
        {
          name: txt.value.f_name.tab_list,
          type: "group",
          children: [],
        },
      ],
    });

    console.log(dataBase, tabsList);
    function addTabs(name) {
      let Tab = {
        type: "tab",
        name: name,
      };
      tabsList.menuList[0].children.push(Tab);
    }
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX;
        mousePosition.top = event.clientY - 50;
        event.preventDefault();
        event.stopPropagation();
      };
    }
    function getMenu(type) {
      for (var i = 0; i < dataBase.menuList.length; i++) {
        let children = dataBase.menuList[i].children;
        for (var j = 0; j < children.length; j++) {
          let son = children[j];
          if (son.type === type) {
            return son;
          }
        }
      }
    }
    function move(evt) {
      var attrs = evt.item.attributes;
      console.log("attrs", attrs.type.nodeValue);
      dataBase.nodeMenu = getMenu(attrs.type.nodeValue);
    }
    function addNode(evt) {
      console.log("InFirefox", mousePosition);
      context.emit("addNode", evt, dataBase.nodeMenu, mousePosition);
    }
    function isFirefox() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    }
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    function click1(name) {
      console.log("111", name);
      context.emit("fromCaddTab", name);
    }
    function deleteMeun(name) {
      ElMessageBox.confirm("是否删除" + name + "？")
        .then(() => {
          let data = {
            name: name,
            operation: "delproject",
          };
          axios
            .post(urls, data)
            .then(() => {
              console.log("axios");
              let list = tabsList.menuList[0].children;
              for (let i in tabsList.menuList[0].children) {
                if (list[i].name == name) {
                  list.splice(i, 1);
                  console.log("list", list);
                }
              }
              context.emit("removeTab", name);
            })
            .catch(() => {});
        })
        .catch(() => {
          // catch
        });
    }
    return {
      addTabs,
      move,
      addNode,
      dataBase,
      tabsList,
      getMenu,
      handleOpen,
      handleClose,
      click1,
      deleteMeun,
      switch_status,
    };
  },
});
</script>
<style>
.tool {
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  /* position: relative; */
}
.flow-tool-menu {
  background-color: #eeeeee;
  cursor: pointer;
  padding-left: 5px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #979797;
}

.flow-tool-submenu {
  background-color: white;
  padding-left: 20px;
  cursor: pointer;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  border-bottom: 1px solid #d3d3d3;
}
.el-submenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 180px !important;
}
.upmeun {
  height: 500px;
}
li {
  width: 100%;
}
</style>