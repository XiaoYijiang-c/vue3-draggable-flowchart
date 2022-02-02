<template>
  <div style="background-color: #66a6e0" ref="tool">
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
    </el-menu>
  </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "tool",
  components: {
    draggable,
  },
  setup(props, context) {
    var mousePosition = reactive({
      left: -1,
      top: -1,
    });
    const dataBase = reactive({
      draggableOptions: {
        preventOnFilter: false,
      },
      defaultOpeneds: ["group0", "group1"],
      menuList: [
        {
          type: "group",
          name: "上传文件",
          ico: "el-icon-video-play",
          children: [
            {
              type: "txt",
              name: "上传纯序列文件",
              ico: "el-icon-time",
            },
            {
              type: "csv",
              name: "上传CSV文件",
              ico: "el-icon-odometer",
            },
            {
              type: "zdy",
              name: "上传自定义模型",
              ico: "el-icon-odometer",
            },
            {
              type: "other",
              name: "上传第三方数据",
              ico: "el-icon-time",
            },
          ],
        },
        {
          type: "group",
          name: "数据转换",
          ico: "el-icon-video-pause",
          children: [
            {
              type: "list",
              name: "Data Table",
              ico: "el-icon-caret-right",
            },
            {
              type: "mat",
              name: "矩阵",
              ico: "el-icon-shopping-cart-full",
            },
          ],
        },
        {
          type: "group",
          name: "矩阵拼接",
          ico: "el-icon-video-play",
          children: [
            {
              type: "col",
              name: "列拼接",
              ico: "el-icon-time",
            },
            {
              type: "row",
              name: "行拼接",
              ico: "el-icon-odometer",
            },
          ],
        },
      ],
      nodeMenu: {},
    });
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
    return {
      move,
      addNode,
      dataBase,
      getMenu,
    };
  },
});
</script>
<style>
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

li {
  width: 100%;
}
</style>