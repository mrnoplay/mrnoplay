<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
      style="display:inline-block; width:0.5px; height:0.5px"
    ></iframe>
    <div class="container">
      <div id="nbsppart"></div>
      <div class="lockmode-enterpwd" v-if="lockmode_enterpwd"></div>
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
        <div class="warnfather warn settingwarn warnnotintegerfather" v-if="timeNAN">
          <div class="breathe-div"></div>
          <div class="warn warnnotinteger">{{ $t("enterinteger") }}</div>
        </div>
        <b-btn
          style="-webkit-app-region: no-drag"
          variant="light"
          class="new on largebtn startbtn"
          @click="start"
        >
          <div class="largebtn-innertext">{{ $t("start") }}</div>
        </b-btn>
        <titlepart :canabout="true" @exit="exit"></titlepart>
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
      version: "",
      lockmode: false,
      lockmode_password: "",
      lockmode_enterpwd: false,
      tongjisrc: '',
    };
  },
  watch: {
    async lang(val) {
      this.storagesetlang(val);
      this.$i18n.locale = val;
    }
  },
  mounted: function() {
    this.gettheme();
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
      if(process.platform == 'win32') this.tongjisrc = 'https://mrnoplay-tongji.now.sh/index-win.html';
      else this.tongjisrc = 'https://mrnoplay-tongji.now.sh/index-mac.html';
    } else {
      this.tongjisrc = 'https://mrnoplay-tongji.now.sh/index-web.html';
    }
    _this = this;
    this.isonios = this.isiOS(navigator.userAgent);
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang();
    this.getplaytime();
    this.storagesetjson("cannotify", false);
    this.tutorial();
    this.loading = false;
    this.storagesetjson("concentrated", true);
    this.getlockmode();
    this.getlockmode_pwd();
    alarm.src = require("@/assets/music/scarymusic/" +
      this.rand(1, 17) +
      ".mp3");
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
      } else (this.lang = "en"), this.storagesetlang("en");
      this.$i18n.locale = this.lang;
      if (this.iselectron) {
        if (this.lang == "en") ipc.send("en");
        else ipc.send("cn");
      }
    },
    async gettheme() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("theme") != -1) {
        const ret = await Storage.get({ key: "theme" });
        if (ret.value != null) this.settheme(JSON.parse(ret.value));
        else
          this.storagesetjson("theme", "colorful"), this.settheme("colorful");
      } else
        this.storagesetjson("theme", "colorful"), this.settheme("colorful");
    },
    async getlockmode() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lockmode") != -1) {
        const ret = await Storage.get({ key: "lockmode" });
        if (ret.value != null) this.lockmode = JSON.parse(ret.value);
        else this.storagesetjson("lockmode", false), (this.lockmode = false);
      } else this.storagesetjson("lockmode", false), (this.lockmode = false);
    },
    async getlockmode_pwd() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lockmode_password") != -1) {
        const ret = await Storage.get({ key: "lockmode_password" });
        if (ret.value != null) this.lockmode_password = JSON.parse(ret.value);
        else
          this.storagesetjson("lockmode_password", ""),
            (this.lockmode_password = "");
      } else
        this.storagesetjson("lockmode_password", ""),
          (this.lockmode_password = "");
    },
    settheme(name) {
      var fileref = document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      if (name == "reality") {
        var linkpath = require(`@/assets/css/reality.theme.scss`);
        fileref.setAttribute("href", linkpath);
      } else {
        var linkpath = require(`@/assets/css/colorful.theme.scss`);
        fileref.setAttribute("href", linkpath);
      }
      document.getElementsByTagName("head")[0].appendChild(fileref);
    },
    async getplaytime() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("default_time") != -1) {
        const ret = await Storage.get({ key: "default_time" });
        if (ret.value != null) {
          this.playtime = Number(JSON.parse(ret.value));
        } else (this.playtime = 5), this.storagesetjson("default_time", 5);
      } else (this.playtime = 5), this.storagesetjson("default_time", 5);
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
    },
    exit() {
      if (this.iselectron) {
        if (this.lockmode) {
          this.lockmode_enterpwd = true;
        } else {
          ipc.send("exit");
        }
      }
    }
  }
};
</script>
