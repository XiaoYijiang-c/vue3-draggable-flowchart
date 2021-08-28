<template>
  <el-dialog title="文件上传" :close-on-click-modal="false" :model-value="win">
    <el-form :model="node" ref="dataForm" label-width="80px" id="upload">
      <el-form-item label="名称">
        <el-radio v-model="dataEncodingType" label="dict">dict</el-radio>
        <el-radio v-model="dataEncodingType" label="oneHot">oneHot</el-radio>
      </el-form-item>
      <el-form-item label="文件上传">
        <input
          type="file"
          name="file"
          accept=".txt"
          id="file"
          @change="fileInfo(getFileContent)"
        />
        <div>{{ FILE.fileContent }}</div>
        <input type="hidden" name="nodeID" :value="node" />
      </el-form-item>
    </el-form>
    <!-- slot='footer' -->
    <span class="dialog-footer">
      <el-button @click="change" icon="el-icon-close">取消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="change"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import $ from "jquery";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "node_from",

  setup() {
    const FILE = reactive({
      file: {},
      fileName: "",
      fileContent: "",
    });
    function init() {}

    function uploadFile() {
      var formData = new FormData($("#upload")[0]);
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      //   const xhr = new XMLHttpRequest();
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:8081",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function () {
          // let jsonData = JSON.parse(data);
          // console.log("jsonData.tag", jsonData.tag);
        },
      });
    }
    function fileInfo(callback) {
      // 获取input标签选择的文件,并选择第一条
      let resultFile = document.getElementById("file").files[0];
      // 如果文件存在
      console.log("fileeeeeeeeeeee");
      if (resultFile) {
        // 获取文件信息
        FILE.file = resultFile;
        // 获取文件名
        FILE.fileName = resultFile.name;

        // 使用 FileReader 来读取文件
        let reader = new FileReader();

        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(resultFile, "UTF-8");

        // 读取文件,会触发 onload 异步事件,可使用回调函数 来获取最终的值.
        reader.onload = function (e) {
          let fileContent = e.target.result;

          // 若为回调函数,则触发回调事件
          if (callback && typeof callback === "function") {
            callback(fileContent);
          }
        };
      }
      console.log(FILE.fileName);
    }
    function getFileContent(fileContent) {
      FILE.fileContent = fileContent;
    }
    return {
      dataBase,
      node,
      dataEncodingType: ref(null),
      FILE,
      uploadFile,
      init,

      fileInfo,
      getFileContent,
    };
  },
});
</script>