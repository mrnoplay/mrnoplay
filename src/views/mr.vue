<i18n src="@/assets/json/lang.json"></i18n>
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
      <div id="nbsppart"></div>
      <div id="main">
        <div class="digitalboard border" style="-webkit-app-region: no-drag">
          <div class="juniordigitalboard on">
            <div class="digitaltop">{{ $t("iwillplay") }}</div>
            <div class="digitalfather">
              <b-form-input
                id="playtime"
                class="digital"
                v-model="playtime"
                type="tel"
                maxlength="4"
                required
                @keyup.enter.native="start"
              ></b-form-input>
              <span class="digital digitalnote">:00</span>
            </div>
          </div>
        </div>
        <div class="centralnbsp"></div>
        <div class="warnfather warn settingwarn" v-if="timeNAN">
          <div class="breathe-div"></div>
          <div class="warn">{{ $t("enterinteger") }}</div>
        </div>
        <b-btn
          style="-webkit-app-region: no-drag"
          variant="light"
          class="new on largebtn"
          @click="start"
        >
          <div class="largebtn-innertext">{{ $t("start") }}</div>
        </b-btn>
        <titlepart :canabout="true"></titlepart>
      </div>
    </div>
    <notify ref="notify"></notify>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
import notify from "@/components/linxf/notify";
const { Storage } = Plugins;
import titlepart from "@/components/titlepart";
var alarm = new Audio();
var _this = null;
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
}
export default {
  name: "mr",
  components: {
    loading,
    titlepart,
    notify
  },
  data() {
    return {
      time: "00:00",
      loading: true,
      iselectron: false,
      isonios: false,
      lang: "en",
      iffetch: 0,
      playtime: 5,
      timeNAN: false,
      version: ""
    };
  },
  watch: {
    async lang(val) {
      this.storagesetlang(val);
      this.$i18n.locale = val;
    }
  },
  mounted: function() {
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
    _this = this;
    this.isonios = this.isiOS(navigator.userAgent);
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang();
    this.getplaytime();
    this.storagesetjson('cannotify', false);
    this.tutorial();
    this.loading = false;
    this.storagesetjson("concentrated", true);
    alarm.src = require("@/assets/music/scarymusic/" + this.rand(1, 17) + ".mp3");
    if (
      process.env.VUE_APP_LINXF != "android" &&
      process.env.VUE_APP_LINXF != "electron" &&
      window.Notification
    ) {
      if (Notification.permission === "granted") {
        //granted
      } else if (Notification.permission === "denied") {
        //denied
      } else {
        Notification.requestPermission().then(function(permission) {
          if (permission === "granted") {
            //granted
          } else if (permission === "denied") {
            //denied
          }
        });
      }
    }
  },
  beforeDestroy: function() {},
  methods: {
    isiPad(userAgent) {
      return userAgent.indexOf("iPad") > -1;
    },
    isiPhone(userAgent) {
      return userAgent.indexOf("iPhone") > -1;
    },
    isiOS(userAgent) {
      return this.isiPad(userAgent) || this.isiPhone(userAgent);
    },
    async storagesetlang(val) {
      await Storage.set({
        key: "lang",
        value: val
      });
    },
    async storagesetjson(key, val) {
      await Storage.set({
        key: key,
        value: JSON.stringify(val)
      });
    },
    async i18nsetlang() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lang") != -1) {
        const retlang = await Storage.get({ key: "lang" });
        if (retlang.value != null) this.lang = retlang.value;
        else (this.lang = "en"), this.storagesetlang("en");
      } else (_this.lang = "en"), this.storagesetlang("en");
      this.$i18n.locale = this.lang;
      if(iselectron) {
        if(this.lang == 'en') ipc.send('en');
        else ipc.send('cn');
      }
    },
    async getplaytime() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("defaulttime") != -1) {
        const ret = await Storage.get({ key: "defaulttime" });
        if (ret.value != null) {
          this.playtime = Number(JSON.parse(ret.value));
        } else (this.playtime = 5), this.storagesetjson("defaulttime", 5);
      } else (this.playtime = 5), this.storagesetjson("defaulttime", 5);
    },
    async tutorial() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("tutorial") == -1) {
        this.$router.push("tutorial");
      }
      _this.$i18n.locale = _this.lang;
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    start() {
      if (/(^[1-9]\d*$)/.test(this.playtime)) {
        this.storagesetjson("playtime", Number(this.playtime)).then(() => {
          this.storagesetjson("concentrated", false);
          this.$router.push("timing");
        });
      } else {
        this.timeNAN = true;
      }
    },
    rand(min, max) {
      return min + Math.round((max - min) * Math.random());
    }
  }
};
</script>
