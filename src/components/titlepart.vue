<template>
    <div>
        Mr.Noplay / 不玩家 <br>
        <div v-if="canabout">
            <b-btn variant="light" class="bfa" @click="about">关于</b-btn>
            <b-btn variant="light" class="bfa" @click="exit">退出</b-btn>
        </div>
    </div>
</template>

<script>
import notify from '@/components/linxf/notify';
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  ipc.on('closenotification', function (event, arg) {
    notify.methods.send({
      title: "不支持的操作",
      id: 2,
      message: "请在允许的时候，通过应用内的关闭按钮退出应用。",
    });
  })
}
export default {
    name: 'titlepart',
    props: ['canabout'],
    methods: {
        about() {
            this.$router.push('about');
        },
        exit() {
            ipc.send('exit');
        }
    }
}
</script>
