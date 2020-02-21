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
      <div id="timingnbsppart"></div>
      <div id="main">
        <div class="digitalboard border">
          <div class="juniordigitalboard on-notbtn" style="-webkit-app-region: no-drag">
            <div class="digitaltop">{{ $t("left") }}</div>
            <div class="digitalfather">
              <span class="digital">{{ displaytime }}</span>
            </div>
          </div>
        </div>
        <div class="warnfather" v-if="iselectron" style="-webkit-app-region: no-drag">
          <div class="breathe-div"></div>
          <div class="warn">{{ $t("firstsavefiles") }}</div>
        </div>
        <b-btn
          variant="light"
          class="new on largebtn"
          @click="stop"
          style="-webkit-app-region: no-drag"
        >
          <div class="largebtn-innertext">{{ $t("stop") }}</div>
        </b-btn>
        <div v-if="cancancel">
          <b-btn
            variant="light"
            class="new largebtn transparent cancelbtn"
            @click="cancel"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("cancel") }}</div>
          </b-btn>
          <small v-if="iselectron" class="new largebtn transparent small">{{ $t("cancel15s") }}</small>
          <small v-if="!iselectron" class="new largebtn transparent small">{{ $t("cancelweb") }}</small>
        </div>
      </div>
    </div>
    <notify ref="notify"></notify>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
const { Storage, Modals } = Plugins;
import titlepart from "@/components/titlepart";
import notify from "@/components/linxf/notify";
var alarm = new Audio();
var _this = null;
alarm.src = require("@/assets/music/alarm.mp3");
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
}
export default {
  name: "timing",
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
      lang: "cn",
      timing: false,
      playtime: 0,
      displaytime: "0:00",
      lefttime: 0,
      cancancel: true,
      halflock: true
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
      ipc.send("normal-screen");
    }
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang();
    this.storagesetjson("cannotify", true);
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
    this.isonios = this.isiOS(navigator.userAgent);
    _this = this;
    this.loading = false;
    this.timing = true;
    this.halflock = true;
    setInterval(this.interval, 1000);
    setTimeout(() => {
      this.cancancel = false;
    }, 15000);
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },
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
    tow(n) {
      return n >= 0 && n < 10 ? "0" + n : "" + n;
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
        if (retlang.value != null) _this.lang = retlang.value;
        else (_this.lang = "en"), _this.storagesetlang("en");
      } else (_this.lang = "en"), _this.storagesetlang("en");
      _this.$i18n.locale = _this.lang;
      if (keys.keys.indexOf("playtime") != -1) {
        const rettime = await Storage.get({ key: "playtime" });
        if (rettime.value != null) _this.playtime = rettime.value;
        else (_this.playtime = 5), _this.storagesetjsom("playtime", 5);
        _this.lefttime = 60 * _this.playtime;
        _this.displaytime = _this.playtime.toString() + ":00";
      }
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    stop() {
      this.cancel();
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("shutdown");
      }
    },
    cancel() {
      this.timing = false;
      this.storagesetjson("concentrated", true);
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("full-screen");
      }
      clearInterval(this.interval);
      this.$router.push("/");
    },
    interval() {
      if (this.timing == true && this.$router.currentRoute.path == "/timing") {
        this.lefttime--;
        this.displaytime =
          ((this.lefttime - (this.lefttime % 60)) / 60).toString() +
          ":" +
          this.tow(this.lefttime % 60).toString();
        if (this.lefttime <= 0) {
          this.timing = false;
          clearInterval(this.interval);
          this.$router.push("/over");
        }
        if (this.lefttime <= this.playtime * 30 && this.halflock) {
          this.halflock = false;
          this.storagesetjson("cannotify", true);
          this.$refs.notify.send({
            title: this.$t("half"),
            id: 10,
            message: this.$t("halftext")
          });
        }
      }
    },
    async popup(title, message) {
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("focus");
        let alertRet = await Modals.alert({
          title: title,
          message: message
        });
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
    settheme(name) {
      var fileref = document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      if (name == "reality") {
        var linkpath = require(`@/assets/css/reality.theme.css`);
        fileref.setAttribute("href", linkpath);
      } else {
        var linkpath = require(`@/assets/css/colorful.theme.css`);
        fileref.setAttribute("href", linkpath);
      }
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
  }
};
</script>
