<template>
  <div></div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
import $ from "jquery";
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
    const { proxy } = getCurrentInstance();
    async function uploadData() {
      var newDatas = Object.assign({}, props.data);
      console.log("props.data", props.data.lineList);
      var newDatas = {
        lineList: props.data.lineList,
        nodeList: props.data.nodeList,
      };
      delete newDatas.windowList;
      console.log("newDatas:", newDatas);
      // var response = await proxy.$axios
      //   .post("/register", newDatas) // 网络请求
      //   .then((res) => {
      //     return res;
      //   })
      //   .catch(() => {
      //     /* */
      //   });
      var response = await $.ajax({
        type: "post",
        // url: "http://127.0.0.1:5000",
        url: "http://182.92.194.235:8000/users/register",
        data: newDatas,
        dataType: "text",
        success: (res) => {
          return res;
        },
      });
      console.log(response);
      return response;
    }

    // async function uploadData() {
    //   var newDatas = Object.assign({}, props.data);
    //   delete newDatas.windowList;

    //   console.log("newDatas:", newDatas);
    //   var response = await proxy.$axios
    //     .post("http://127.0.0.1:5000", newDatas) // 网络请求
    //     .then((res) => {
    //       return res;
    //     })
    //     .catch(() => {
    //       /* */
    //     });
    //   return response;
    // }

    return {
      uploadData,
      init,
      dataAll,
    };
  },
});
</script>