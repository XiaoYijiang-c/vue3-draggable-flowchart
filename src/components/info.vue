<template>
  <div></div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";

import { ElMessageBox } from "element-plus";
import { useState } from "vue";

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
    //const [data, setData] = useState(null)

    function init() {
      dataAll.value = uploadData();
      open();
      console.log("111", dataAll.value.then);
    }
    const { proxy } = getCurrentInstance(); // 获取上下文对象
    async function uploadData() {
      var newDatas = Object.assign({}, props.data);
      delete newDatas.windowList;

      console.log("newDatas:", newDatas);
      var response = await proxy.$axios
        .post("/register", newDatas) // 网络请求
        .then((res) => {
          return res;
        })
        .catch(() => {
          /* */
        });
      return response;
    }

    return {
      uploadData,
      init,
      dataAll,
    };
  },
});
</script>