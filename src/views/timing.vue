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
        剩余 {{ displaytime }}
        <br>
        <b-btn variant="light" class="new on" @click="cancel">取消</b-btn>
        <br>
        <b-btn variant="light" class="new on" @click="cancel">结束</b-btn>
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
  import titlepart from '@/components/titlepart'
  var alarm = new Audio();
  var _this = null;
  alarm.src = require("@/assets/alarm.mp3");
  var ipc = null;
  if (process.env.VUE_APP_LINXF == "electron") {
    ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  }
  export default {
    name: 'timing',
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
      setInterval(this.interval,1000);
    },
    beforeDestroy: function() {
        clearInterval(this.interval);
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
      tow (n) {
          return n >= 0 && n < 10 ? '0' + n : '' + n;
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
        if(keys.keys.indexOf('playtime') != -1) {
          const rettime = await Storage.get({ key:'playtime' });
          if(rettime.value != null) _this.playtime = rettime.value;
          else _this.playtime = 5, _this.storagesetjsom('playtime', 5);
          _this.lefttime = 60 * _this.playtime;
          _this.displaytime = _this.playtime.toString() + ":00";
        }
      },
      i18nchinese() {
        this.lang = 'cn';
      },
      i18nenglish() {
        this.lang = 'en';
      },
      cancel() {
        this.timing = false;
        this.storagesetjson('concentrated', true);
        if (process.env.VUE_APP_LINXF == "electron") {
          ipc.send('full-screen');
        }
        this.$router.push('/');
      },
      interval() {
        if(this.timing == true) {
            this.lefttime --;
            this.displaytime = ((this.lefttime - this.lefttime % 60) / 60).toString() + ":" + (this.tow(this.lefttime % 60)).toString();
            if(this.lefttime <= 0) {
                this.timing = false;
                clearInterval(this.interval);
                this.$router.push("/over");
            }
        }
      }
    }
  }
</script>
