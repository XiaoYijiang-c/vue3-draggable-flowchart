<template>
  <div></div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";

import { ElMessageBox } from "element-plus";

export default defineComponent({
  name: "info",

  props: {
    data: Object,
  },
  setup(props) {
    const open = () => {
      ElMessageBox.alert("流程上传成功", "流程上传成功", {
        confirmButtonText: "确定",
      });
    };
    const dataAll = ref(null);
    function init() {
      uploadData();
      open();
    }
    const { proxy } = getCurrentInstance(); // 获取上下文对象
    function uploadData() {
      var newDatas = Object.assign({}, props.data);
      delete newDatas.windowList;
      var newData = JSON.stringify(newDatas, null, 4);

      console.log("newDatas:", newDatas);
      proxy.$axios
        .post("/", newDatas) // 网络请求
        .then((result) => {
          dataAll.value = result;
        })
        .catch(() => {
          /* */
        });
    }

    return {
      uploadData,
      init,
      dataAll,
    };
  },
});
</script>