<template>
  <div
    ref="Node"
    :style="(flowNodeContainer, sNode)"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
  >
    <div class="flow-node-header">
      <!--左上角的那个图标样式-->
      <i :class="nodeClass"></i>
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
    <div class="flow-node-body">
      {{ node.name }}
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, reactive } from "vue";
export default defineComponent({
  name: "node",
  props: { node: Object },
  setup(props, context) {
    // const flowNodeContainer = reactive();
    const mouseEnter = ref();
    const Node = ref(null);
    const sNode = reactive({
      position: "absolute",
      width: "200px",
      top: props.node.top,
      left: props.node.left,
    });
    const nodeClass = computed(() => {
      var nodeclass = {};
      nodeclass[props.node.ico] = true;
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
        props.node.left == Node.value.style.left &&
        props.node.top == Node.value.style.top
      ) {
        return;
      }
      sNode.left = Node.value.style.left;
      sNode.top = Node.value.style.top;
      context.emit("changeNodeSite", {
        nodeId: props.node.id,
        left: sNode.left,
        top: sNode.top,
      });

      // flowNodeContainer.top = Node.value.style.top;
      // flowNodeContainer.left = Node.value.style.left;
    }
    return {
      flowNodeContainer: {
        boxShadow: mouseEnter.value ? "#66a6e0 0px 0px 12px 0px" : "",
        backgroundColor: "transparent",
      },
      Node,
      sNode,
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