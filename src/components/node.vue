<template>
  <!-- <div
    ref="nodes"
    :style="[flowNodeContainer1, { top: node.top, left: node.left }]"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
  > -->
  <div
    ref="nodes"
    :style="flowNodeContainer1"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
  >
    <div class="flow-node-header">
      <!--左上角的那个图标样式-->

      <i class="el-icon-link flow-node-drag"></i>
      <!--鼠标移入到节点中时右上角的【编辑】、【删除】 按钮-->
      <div
        style="position: absolute; top: 0px; right: 0px; line-height: 25px"
        v-show="mouseEnter"
      >
        <a href="#" style="" @click="editNode"
          ><img src="@/assets/edit.png" /></a
        >&nbsp;
        <a href="#" style="" @click="deleteNode"
          ><img src="@/assets/delete.png"
        /></a>
        &nbsp;
      </div>
    </div>
    <!--节点的正文部分-->
    <div class="flow-node-body">{{ node.name }}</div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive } from "vue";
// import { CirclePlusFilled } from "@element-plus/icons";
export default defineComponent({
  name: "node",
  props: { node: Object },
  components: {},
  setup(props, context) {
    const flowNodeContainer1 = reactive({
      position: "absolute",
      width: "200px",
      // top: props.top,
      // left: props.left,
    });
    const mouseEnter = ref();
    const nodes = ref(null);

    const nodeClass = computed(() => {
      var nodeclass = {};
      // nodeclass[props.node.ico] = true;
      nodeclass["flow-node-drag"] = true;
      return nodeclass;
    });
    function deleteNode() {
      context.emit("deleteNode", props.node.id);
    }
    // 编辑节点
    function editNode() {
      context.emit("editNode", props.node.id);
    }
    // 鼠标进入
    function showDelete() {
      mouseEnter.value = true;
    }
    // 鼠标离开
    function hideDelete() {
      mouseEnter.value = false;
    }
    // 鼠标移动后抬起
    function changeNodeSite() {
      //   避免抖动;
      if (
        props.node.left == nodes.value.style.left &&
        props.node.top == nodes.value.style.top
      ) {
        return;
      }
      console.log("props.node.id", props.node.id);
      // flowNodeContainer1.left = nodes.value.style.left;
      // flowNodeContainer1.top = nodes.value.style.top;

      context.emit("changeNodeSite", {
        nodeId: props.node.id,
        left: nodes.value.style.left,
        top: nodes.value.style.top,
      });

      // flowNodeContainer.top = Node.value.style.top;
      // flowNodeContainer.left = Node.value.style.left;
    }
    return {
      flowNodeContainer: {
        boxShadow: mouseEnter.value ? "#66a6e0 0px 0px 12px 0px" : "",
        backgroundColor: "transparent",
      },
      flowNodeContainer1,
      nodes,
      nodeClass,
      deleteNode,
      editNode,
      showDelete,
      hideDelete,
      changeNodeSite,
      mouseEnter,
    };
  },
});
</script>
<style>
.flow-node-drag {
  width: 25px;
  height: 25px;
}

.flow-node-header {
  background-color: #66a6e0;
  height: 25px;
  cursor: pointer;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.flow-node-header a {
  text-decoration: none;
  line-height: 25px;
  vertical-align: middle;
}

.flow-node-header a img {
  line-height: 25px;
  vertical-align: middle;
  margin-bottom: 5px;
}

.flow-node-body {
  /*background-color: beige;*/
  background-color: white;
  text-align: center;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>