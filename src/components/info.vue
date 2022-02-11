<template>
  <div></div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance } from "vue";
// import $ from "jquery";
import { ElMessageBox } from "element-plus";

export default defineComponent({
  name: "info",

  props: {
    data: Object,
  },
  setup(props) {
    const open = (tip) => {
      ElMessageBox.alert("流程上传" + tip, "流程上传" + tip, {
        confirmButtonText: "确定",
      });
    };
    const dataAll = ref(null);
    //const [data, setData] = useState(null)

    function init() {
      dataAll.value = uploadData();

      console.log("111", dataAll.value.then);
    }
    const { proxy } = getCurrentInstance();
    async function uploadData() {
      var newDatas = Object.assign({}, props.data);
      delete newDatas.windowList;
      var response = await proxy.$axios
        .post("http://182.92.194.235:8000/users/register", newDatas) // 网络请求
        .then((res) => {
          if (res) open("成功");
          return res;
        })
        .catch((e) => {
          if (e) open("失败");
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