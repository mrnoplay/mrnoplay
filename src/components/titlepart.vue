<template>
  <div>
    Mr.Noplay / 不玩家
    <br />
    <div v-if="canabout">
      <b-btn variant="light" class="bfa titleicon" @click="about">关于</b-btn>
      <b-btn variant="light" class="bfa titleicon" @click="exit" v-if="iselectron">退出</b-btn>
    </div>
  </div>
</template>

<script>
import notify from "@/components/linxf/notify";
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  ipc.on("closenotification", function(event, arg) {
    notify.methods.send({
      title: "不支持的操作",
      id: 2,
      message: "请在允许的时候，通过应用内的关闭按钮退出应用。"
    });
  });
  ipc.on("toomanyapps", function(event, arg) {
    notify.methods.send({
      title: "不支持的操作",
      id: 3,
      message: "当前只允许运行一个Mr Noplay程序。"
    });
  });
}
export default {
  name: "titlepart",
  props: ["canabout"],
  data() {
    return {
      iselectron: false
    };
  },
  mounted: function() {
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
  },
  methods: {
    about() {
      this.$router.push("about");
    },
    exit() {
      ipc.send("exit");
    }
  }
};
</script>
