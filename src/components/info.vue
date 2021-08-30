<template>
  <el-dialog title="流程数据信息" v-model="dataBase.dialogVisible" width="70%">
    <div>{{ JSON.stringify(this.data, null, 4).toString() }}</div>
    <span class="dialog-footer"> </span>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, getCurrentInstance, onMounted } from "vue";
// import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
require("codemirror/mode/javascript/javascript.js");
export default defineComponent({
  name: "info",
  // components: {
  //   codemirror,
  // },
  props: {
    data: Object,
  },
  setup(props) {
    const dataBase = reactive({
      dialogVisible: false,
      options: {
        mode: { name: "javascript", json: true },
        lineNumbers: true,
      },
    });

    function init() {
      console.log("this.data", this.data);
      dataBase.dialogVisible = true;
      uploadData();
    }
    const { proxy } = getCurrentInstance(); // 获取上下文对象
    function uploadData() {
      proxy.$axios
        .post("/playlist/hot", JSON.stringify(props.data, null, 4)) // 网络请求
        .then((result) => {
          console.log(result);
        })
        .catch(() => {
          /* */
        });
    }

    return {
      uploadData,
      dataBase,
      init,
    };
  },
});
</script>