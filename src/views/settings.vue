<i18n src="@/assets/lang.json"></i18n>
<template>
  <div>
    <notify ref="notify"></notify>
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
    <div class="container setting-container">
      <div class="setting-left" style="-webkit-app-region: no-drag">
        <div id="settingsnbsppart"></div>
        <b-btn variant="light" class="new on main-like settingbtn settingleftbtn hover-red" @click="goback">
          <div class="back chromeheight"></div>
        </b-btn>
      </div>
      <div class="setting-center">
        <div id="settingsnbsppart"></div>
        <div id="setting-main" style="-webkit-app-region: no-drag">
          <div v-if="iselectron" class="settingfield main-like">
            <b class="label">{{ $t("startonlogin") }}</b><br>
            <div class="select">{{ $t("turnoff") }}<b-btn variant="light" :class="switchstartonlogin" @click="selectstartonlogin"></b-btn>{{ $t("turnon") }}</div>
          </div>
          <div class="settingfield main-like">
            <b class="label">语言/Language</b>
            <div class="select">中文<b-btn variant="light" :class="switchlang" @click="selectlang"></b-btn>English</div>
          </div>
          <div v-if="iselectron" class="settingfield main-like">
            <b class="label">{{ $t("update") }}</b><br>
            <div>
              <a class="tutorial-a" @click="check" v-if="!checking">{{ $t("checkforupdate") }}</a>
              <span class="label" @click="check" v-if="checking">{{ $t("checking") }}</span>
            </div>
          </div>
          <div class="settingfield  main-like">
            <b class="label">{{ $t("defaulttime") }}</b>
            <div class="input-btn">
              <input type="tel" maxLength="4" required class="off settinginput" v-model="defaulttime" @keyup.enter="setdefaulttime"/>
              <b-btn variant="light" class="new submit settingbtn on" @click="setdefaulttime"></b-btn>
            </div>
            <div class="warnfather warn settingwarn" v-if="timeNAN">
              <div class="breathe-div"></div>
              <div class="warn">{{ $t("enterinteger") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { Plugins } from '@capacitor/core';
  const { Storage, Modals } = Plugins;
  import titlepart from '@/components/titlepart'
  var alarm = new Audio();
  var _this = null;
  alarm.src = require("@/assets/alarm.mp3");
  import notify from "@/components/linxf/notify";
  var ipc = null;
  if (process.env.VUE_APP_LINXF == "electron") {
    ipc = window.require("electron").ipcRenderer; //use window.require instead of require
    ipc.on("updatefailed", function(event, arg) {
      this.checking = false;
      this.checked = true;
      this.checkedtext = 'Failed';
      //this.popup(this.$t("updatefailed"), this.$t("updatefailedtext"));
    });
    ipc.on("updateok", function(event, arg) {
      this.checking = false;
      this.checked = true;
      this.checkedtext = 'Found';
      //this.popup(this.$t("updateok"), this.$t("updateoktext"));
    });
    ipc.on("updateno", function(event, arg) {
      this.checking = false;
      this.checked = true;
      this.checkedtext = 'No update';
      //this.popup(this.$t("updatefailed"), this.$t("noupdatetext"));
    });
  }
  export default {
    name: 'settings',
    components: {
      loading,
      titlepart,
      notify,
    },
    data() {
      return {
        time: '00:00',
        loading: true,
        iselectron: false,
        isonios: false,
        lang: 'en',
        version: '1.0.0',
        switchstartonlogin: 'switch-off',
        switchlang: 'switch-on',
        checking: false,
        checked: false,
        checkedtext: '',
        defaulttime: 5,
        timeNAN: false,
      };
    },
    watch: {
      async lang (val) {
        this.storagesetlang(val);
        this.$i18n.locale = val;
      },
    },
    mounted: function() {
      this.checking = false;
      this.version = process.env.VUE_APP_VER;
      this.storagesetjson('cannotify', false);
      this.i18nsetlang();
      this.setstartonloginselect();
      this.getdefaulttime();
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
          if(retlang.value != null) this.lang = retlang.value;
          else this.lang = 'en', this.storagesetlang('en');
        } else this.lang = 'en', this.storagesetlang('en');
        this.$i18n.locale = this.lang;
        if (this.lang == 'en') this.switchlang = 'switch-on';
        else this.switchlang = 'switch-off';
      },
      async setstartonloginselect() {
        const keys = await Storage.keys();
        if(keys.keys.indexOf('startonlogin') != -1) {
          const ret = await Storage.get({ key:'startonlogin' });
          if(ret.value != null) {
            if (ret.value == false || ret.value == "false") this.switchstartonlogin = 'switch-off';
            else this.switchstartonlogin = 'switch-on';
          }
          else this.switchstartonlogin = 'switch-off', this.storagesetjson('startonlogin',false);
        } else this.switchstartonlogin = 'switch-off', this.storagesetjson('startonlogin',false);
      },
      async getdefaulttime() {
        const keys = await Storage.keys();
        if(keys.keys.indexOf('defaulttime') != -1) {
          const ret = await Storage.get({ key:'defaulttime' });
          if(ret.value != null) {
            this.defaulttime = Number(JSON.parse(ret.value));
          }
          else this.defaulttime = 5, this.storagesetjson('defaulttime',5);
        } else this.defaulttime = 5, this.storagesetjson('defaulttime',5);
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
          this.$refs.notify.send({
            title: this.$t("success"),
            id: 4,
            message: this.$t("on-startonlogin")
          });
        }
      },
      notstartonlogin() {
        if(process.env.VUE_APP_LINXF == 'electron') {
          ipc.send("notstartonlogin");
          this.$refs.notify.send({
            title: this.$t("success"),
            id: 5,
            message: this.$t("off-startonlogin")
          });
        }
      },
      selectstartonlogin() {
        if(this.switchstartonlogin == 'switch-on') {
          this.switchstartonlogin = 'switch-off';
          this.storagesetjson('startonlogin',false);
          this.notstartonlogin();
        } else {
          this.switchstartonlogin = 'switch-on';
          this.storagesetjson('startonlogin',true);
          this.startonlogin();
        }
      },
      selectlang() {
        if (this.lang == 'en') {
          this.cn();
          this.switchlang = 'switch-off';
        } else {
          this.en();
          this.switchlang = 'switch-on';
        }
      },
      cn() {
        this.i18nchinese();
        this.$refs.notify.send({
          title: "成功",
          id: 6,
          message: "已经切换到中文。"
        });
      },
      en() {
        this.i18nenglish();
        this.$refs.notify.send({
          title: "Success",
          id: 7,
          message: "Language is set to English."
        });
      },
      check() {
        if (process.env.VUE_APP_LINXF == "electron") {
          ipc.send("checkupdate");
          this.checking = true;
        }
      },
      async popup(title, message) {
        if (process.env.VUE_APP_LINXF == "electron") {
          ipc.send('focus');
          let alertRet = await Modals.alert({
            title: title,
            message: message,
          });
        }
      },
      setdefaulttime() {
        if (/(^[1-9]\d*$)/.test(this.defaulttime)) {
          this.timeNAN = false;
          this.storagesetjson('defaulttime', this.defaulttime);
          this.$refs.notify.send({
            title: this.$t("success"),
            id: 5,
            message: this.$t("defaulttimesuccess")
          });
        } else {
          this.timeNAN = true;
        }
      },
    }
  }
</script>
