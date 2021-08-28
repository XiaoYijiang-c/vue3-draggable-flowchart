<template>
  <el-dialog title="流程数据信息" v-model="dataBase.dialogVisible" width="70%">
    <div>{{ JSON.stringify(this.data, null, 4).toString() }}</div>
    <span class="dialog-footer"> </span>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive } from "vue";
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
  setup() {
    const dataBase = reactive({
      dialogVisible: false,
      options: {
        mode: { name: "javascript", json: true },
        lineNumbers: true,
      },
    });
    // function flowData() {
    //   console.log("this.data", this.data);
    //   return JSON.stringify(this.data, null, 4).toString();
    // }
    function init() {
      console.log("this.data", this.data);
      dataBase.dialogVisible = true;
    }
    return {
      // flowData,
      dataBase,
      init,
    };
  },
});
</script>