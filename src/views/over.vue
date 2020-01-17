<i18n src="@/assets/lang.json"></i18n>
<template>
  <div>
    <!--
    <div id="planselectorcontainer" class="linediv">
      <div class="toptext btn"><b-btn variant="light" class="bfa topicon">Mr Noplay</b-btn></div>
      <div class="btn closewindowcontainer" style="-webkit-app-region: no-drag; -webkit-user-select: none">
        <b-btn variant="light" class="bfa topicon" v-b-modal.settingspanel><i class="fa fa-sliders-h"></i></b-btn>
        <a v-if="iselectron" class="btn bfa closewindow topicon btn-light" href="javascript:window.close()"><i class="fa fa-times"></i></a>
      </div>
    </div>
    <div id="undergradient" class="linediv"></div>
    -->
    <div class="container">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" loader="bars"></loading>
      <titlepart :canabout="false"></titlepart>
      <div id="notifies" style="-webkit-app-region: no-drag">
        时间结束。<br>
        3分钟内停止，否则将被惩罚。
        （停止后，电脑将在1分钟内关闭，请先保存好自己的资料）
        <br>
        <b-alert
          v-model="punishstart"
          class="position-fixed fixed-bottom m-0 rounded-0"
          style="z-index: 2000;"
          variant="danger"
          dismissible>
          惩罚现在开始。
        </b-alert>
        <b-btn variant="light" class="bfa" @click="cancel">结束</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { Plugins } from '@capacitor/core';
  const { Storage } = Plugins;
  import timepicker from 'vue-ctk-date-time-picker';
  import '@/assets/vue-ctk-date-time-picker.css';
  import titlepart from '@/components/titlepart';
  import notify from '@/components/linxf/notify';
  var alarm = new Audio();
  var _this = null;
  var ipc = null;
  if (process.env.VUE_APP_LINXF == "electron") {
    ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  }
  ipc.on('timingdone', function (event, arg) {
   this.timing = false;
  })
  export default {
    name: 'over',
    components: {
      loading,
      timepicker,
      titlepart,
    },
    data() {
      return {
        time: '00:00',
        loading: true,
        iselectron: false,
        isonios: false,
        lang: 'cn',
        timing: false,
        playtime: 0,
        displaytime: "0:00",
        lefttime: 0,
        punishstart: false,
        notifymessage: [
          '开始工作啦',
          '工作时间开始',
        ],
      };
    },
    watch: {
      async lang (val) {
        this.storagesetlang(val);
        this.$i18n.locale = val;
      },
    },
    mounted: function() {
      this.version = process.env.VUE_APP_VER;
      this.i18nsetlang();
      if(process.env.VUE_APP_LINXF == 'electron') {
        this.iselectron = true;
      }
      this.isonios = this.isiOS(navigator.userAgent);
      _this = this;
      this.loading = false;
      this.timing = true;
      alarm.src = require("@/assets/scarymusic/"+this.rand(1,17)+".mp3");
      setTimeout(this.timeout, 1000);//180000
    },
    beforeDestroy: function() {

    },
    methods: {
      isiPad (userAgent) {
        return (userAgent.indexOf("iPad") > -1);
      },
      isiPhone (userAgent) {
        return (userAgent.indexOf("iPhone") > -1);
      },
      isiOS (userAgent) {
        return this.isiPad(userAgent) || this.isiPhone(userAgent);
      },
      async storagesetlang(val) {
        await Storage.set({
          key: 'lang',
          value: val
        });
      },
      async storagesetjson(key,val) {
        await Storage.set({
          key: key,
          value: JSON.stringify(val)
        });
      },
      async i18nsetlang() {
        const keys = await Storage.keys();
        if(keys.keys.indexOf('lang') != -1) {
          const retlang = await Storage.get({ key:'lang' });
          if(retlang.value != null) _this.lang = retlang.value;
          else _this.lang = 'en', _this.storagesetlang('en');
        } else _this.lang = 'en', _this.storagesetlang('en');
        _this.$i18n.locale = _this.lang;
      },
      i18nchinese() {
        this.lang = 'cn';
      },
      i18nenglish() {
        this.lang = 'en';
      },
      cancel() {
        this.storagesetjson('concentrated', true);
        if (process.env.VUE_APP_LINXF == "electron") {
          ipc.send('full-screen');
          ipc.send('shutdown');
        } else {
          this.timing = false;
        }
        this.$router.push('/');
      },
      interval() {
        if(this.timing == true) {
          this.punishstart = true;
          notify.methods.send({
            title: "现在停止",
            id: 1,
            message: this.notifymessage[this.rand(0,this.notifymessage.length)]
          });
          alarm.play();
        }
      },
      timeout() {
        setInterval(this.interval, 2000);
      },
      rand(min,max) {
        return (min + Math.round((max - min) * Math.random()));
      },
    }
  }
</script>
