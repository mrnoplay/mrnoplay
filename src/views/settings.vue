<i18n src="@/assets/lang.json"></i18n>
<template>
  <div>
    <!--
    <div id="planselectorcontainer" class="linediv">
      <div class="toptext btn"><b-btn variant="light" class="new on topicon">Mr Noplay</b-btn></div>
      <div class="btn closewindowcontainer" style="-webkit-app-region: no-drag; -webkit-user-select: none">
        <b-btn variant="light" class="new on topicon" v-b-modal.settingspanel><i class="fa fa-sliders-h"></i></b-btn>
        <a v-if="iselectron" class="btn new on closewindow topicon btn-light" href="javascript:window.close()"><i class="fa fa-times"></i></a>
      </div>
    </div>
    <div id="undergradient" class="linediv"></div>
    -->
    <div class="container">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" loader="bars"></loading>
      <titlepart :canabout="false"></titlepart>
      <div id="notifies" style="-webkit-app-region: no-drag">
        <div v-if="iselectron">
          开机自启 <b-btn variant="light" class="new on" @click="startonlogin">开启</b-btn><b-btn variant="light" class="new on" @click="notstartonlogin">关闭</b-btn><br>
        </div>
        <div>
          语言/Language (暂未启用英文) <b-btn variant="light" class="new on" @click="cn">简体中文</b-btn><b-btn variant="light" class="new on" @click="en">English</b-btn><br>
        </div>
        <b-btn variant="light" class="new on" @click="goback">返回</b-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { Plugins } from '@capacitor/core';
  const { Storage } = Plugins;
  import titlepart from '@/components/titlepart'
  var alarm = new Audio();
  var _this = null;
  alarm.src = require("@/assets/alarm.mp3");
  import notify from "@/components/linxf/notify";
  var ipc = null;
  if (process.env.VUE_APP_LINXF == "electron") {
    ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  }
  export default {
    name: 'settings',
    components: {
      loading,
      titlepart,
    },
    data() {
      return {
        time: '00:00',
        loading: true,
        iselectron: false,
        isonios: false,
        lang: 'en',
        version: '1.0.0',
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
      setTimeout(this.interval, 3000);
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
      goback() {
        this.timing = false;
        this.$router.push('/');
      },
      startonlogin() {
        if(process.env.VUE_APP_LINXF == 'electron') {
          ipc.send("startonlogin");
          notify.methods.send({
            title: "成功",
            id: 4,
            message: "已经设置为开机自启。"
          });
        }
      },
      notstartonlogin() {
        if(process.env.VUE_APP_LINXF == 'electron') {
          ipc.send("notstartonlogin");
          notify.methods.send({
            title: "成功",
            id: 5,
            message: "已经取消开机自启。"
          });
        }
      },
      cn() {
        i18nchinese();
        notify.methods.send({
          title: "成功",
          id: 6,
          message: "已经切换到中文。"
        });
      },
      en() {
        i18nenglish();
        notify.methods.send({
          title: "Success",
          id: 7,
          message: "Language is set to English."
        });
      },
    }
  }
</script>
