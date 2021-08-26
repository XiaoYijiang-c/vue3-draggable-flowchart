<template>
  <el-dialog title="文件上传" :close-on-click-modal="false" v-model="visible">
    <div id="main" style="width: 600px; height: 400px">1234</div>
    <span class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button type="primary" icon="el-icon-check">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onUpdated,
  reactive,
  ref,
  getCurrentInstance,
} from "vue";
export default defineComponent({
  name: "chart",
  setup() {
    const dataBase = reactive({
      visible: false,
      node: {},
    });
    const { ctx } = getCurrentInstance();
    const myRef = ref(null);

    const initT = () => {
      const myChart = ctx.echarts.init(document.getElementById("mycharts"));
      console.log(myChart);
      myChart.setOption({
        title: {
          text: "本月数据统计",
        },
        tooltip: {},
        legend: {
          data: ["任务数量"],
        },
        xAxis: {
          data: ["javascript", "vue", "ts", "react", "nginx"],
        },
        yAxis: {},
        series: [
          {
            name: "任务数量",
            type: "bar",
            data: [5, 20, 36, 10, 10],
          },
        ],
      });
    };
    function init() {
      dataBase.visible = true;
    }
    onUpdated(() => {
      initT();
    });
    return {
      myRef,
      init,
    };
  },
});
</script>