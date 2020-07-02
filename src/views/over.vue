<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
    <div class="container" v-if="this.use_old_interface || !this.iselectron">
      <div id="overnbsppart" v-if="!popuped"></div>
      <div class="popup" v-if="popuped" style="-webkit-app-region: no-drag">
        <div class="popupdecoration-left"></div>
        <div>
          <div class="popuptitle">{{ popuptitle }}</div>
          <div class="popupdesc">{{ popupdesc }}</div>
        </div>
        <div class="popupdecoration-right"></div>
      </div>
      <div id="popupnbsppart" v-if="popuped"></div>
      <div id="main" class="main-popup">
        <div class="notifyboard border">
          <div class="juniornotifyboard on-notbtn">
            <div class="digitaltop notifytop">{{ $t("notify") }}</div>
            <div class="notifyfather notifyfather-over">{{ $t("willpunish") }}</div>
          </div>
        </div>
        <div class="warnfathers">
          <div class="warnfather warnfather-over" v-if="iselectron">
            <div class="breathe-div"></div>
            <div class="warn warn-over">{{ $t("firstsavefiles") }}</div>
          </div>
          <b-alert
            v-model="punishstart"
            class="warnfather warnfather-over"
            style="z-index: 2000;"
            variant="danger"
          >
            <div class="breathe-div"></div>
            <div class="warn warn-over">{{ $t("punishstart") }}</div>
          </b-alert>
        </div>
        <b-btn
          variant="light"
          class="new on largebtn stopbtn"
          @click="cancel"
          style="-webkit-app-region: no-drag"
        >
          <div class="largebtn-innertext">{{ $t("over") }}</div>
        </b-btn>
        <div class="rptext-over">
          <small
            class="new largebtn-notbtn transparent small canceltext"
            v-if="controlrptext"
          >{{ $t('nowstop') }}{{ get_rp }}{{ $t('rp') }}</small>
          <small
            class="new largebtn-notbtn transparent small canceltext"
            v-if="!controlrptext"
          >{{ $t('nowexitillegally') }}{{ illegal_rp }}{{ $t('rp') }}</small>
        </div>
      </div>
    </div>
    <div class="container" v-if="!this.use_old_interface && this.iselectron">
      <div id="main" class="main-ontop">
        <div id="pause" v-if="ispausing">
          <button class="resume" @click="resume"></button>
        </div>
        <div class="digitalboard border">
          <div class="juniordigitalboard-ontop on-notbtn" style="-webkit-app-region: no-drag">
            <div class="digitalfather-ontop digitalfather-notinput-ontop">
              <span class="digital-ontop">{{ displaytime }}</span>
            </div> 
          </div>
        </div>
        <div id="main-ontop-right">
          <b-btn
            variant="light"
            class="new on largebtn-ontop stopbtn-ontop"
            @click="stop"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("stop") }}</div>
          </b-btn>
          <b-btn
            v-if="cancancel"
            variant="light"
            class="new largebtn-ontop transparent cancelbtn-ontop"
            @click="cancel"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("cancel") }}</div>
          </b-btn>
          <b-btn
            v-if="!cancancel"
            variant="light"
            class="new largebtn-ontop transparent cancelbtn-ontop"
            @click="pause"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("pause") }}</div>
          </b-btn>
          <b-btn
            variant="light"
            class="new on largebtn-ontop stopbtn-ontop"
            @click="moretime_goask"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("moretime") }}</div>
          </b-btn>
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
var tryparse = require("tryparse");
var alarm = new Audio();
var _this = null;
var ipc = null;
var i = 0;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  ipc.on("timingdone", function(event, arg) {
    this.timing = false;
  });
}
export default {
  name: "over",
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
      punishstart: false,
      st_finished: 0,
      st_rp: 20,
      get_rp: 1,
      illegal_rp: 10,
      controlrptext: true,
      popuped: false,
      popuptitle: "Title",
      popupdesc: "Description",
      use_old_interface: true,
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
    this.version = process.env.VUE_APP_VER;
    _this = this;
    this.i18nsetlang().then(() => {
      this.$refs.notify.send({
        title: this.$t("timeisup"),
        id: 8,
        message: this.$t("willpunish")
      });
    });
    this.storagesetjson("cannotify", true);
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
      setInterval(() => {
        this.controlrptext = !this.controlrptext;
      }, 5000);
    }
    this.isonios = this.isiOS(navigator.userAgent);
    this.loading = false;
    this.timing = true;
    alarm.src = require("@/assets/music/scarymusic/" +
      this.rand(1, 17) +
      ".mp3");
    setTimeout(this.timeout, 180000); //180000
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
      // --------
      // Language
      // --------
      if (keys.keys.indexOf("lang") != -1) {
        const retlang = await Storage.get({ key: "lang" });
        if (retlang.value != null) _this.lang = retlang.value;
        else (_this.lang = "en"), _this.storagesetlang("en");
      } else (_this.lang = "en"), _this.storagesetlang("en");
      _this.$i18n.locale = _this.lang;
      // --------------
      // Finished Times
      // --------------
      const ret_f = await Storage.get({ key: "finished" });
      if (
        tryparse.int(JSON.parse(ret_f.value)) != null ||
        tryparse.int(JSON.parse(ret_f.value)) == 0
      )
        this.st_finished = JSON.parse(ret_f.value);
      else this.st_finished = 0;
      // -------
      // R Point
      // -------
      const ret_r = await Storage.get({ key: "rp" });
      if (
        tryparse.int(JSON.parse(ret_r.value)) != null ||
        tryparse.int(JSON.parse(ret_r.value)) == 0
      )
        this.st_rp = tryparse.int(JSON.parse(ret_r.value));
      else this.st_rp = 20;
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    cancel() {
      this.storagesetjson("concentrated", true);
      this.storagesetjson("finished", this.st_finished + 1);
      this.storagesetjson("exit_type", "shutdown");
      this.storagesetjson("rp", this.st_rp + this.get_rp);
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("full-screen");
        ipc.send("shutdown");
        this.timing = false;
        clearInterval(this.interval);
        clearInterval(this.longinterval);
        clearInterval(this.shutdowninterval);
      } else {
        this.timing = false;
        clearInterval(this.interval);
        clearInterval(this.shutdowninterval);
        this.$router.push("/");
      }
    },
    interval() {
      if (this.timing == true && this.$router.currentRoute.path == "/over") {
        this.punishstart = true;
        this.$i18n.locale = _this.lang;
        _this.$refs.notify.send({
          title: _this.$t("stop"),
          id: 1,
          message: _this.$t("notifymessage." + _this.rand(1, 2))
        });
        alarm.play();
      } else {
        clearInterval(this.interval);
      }
    },
    longinterval() {
      this.popup(this.$t("morethan3"), this.$t("10willforce"));
    },
    shutdowninterval() {
      if (process.env.VUE_APP_LINXF == "electron") {
        this.$i18n.locale = this.lang;
        this.$refs.notify.send({
          title: this.$t("willforce"),
          id: 9,
          message: this.$t("willforce")
        });
        setTimeout(() => {
          this.storagesetjson("finished", this.st_finished + 1);
          this.storagesetjson("exit_type", "shutdown");
          this.storagesetjson("rp", this.st_rp + this.get_rp);
          this.$i18n.locale = this.lang;
          this.$refs.notify.send({
            title: this.$t("willforce"),
            id: 9,
            message: this.$t("willforce")
          });
          ipc.send("shutdown");
        }, 5000);
      }
    },
    timeout() {
      setInterval(this.interval, 2000);
      setInterval(this.longinterval, 140000); //140000
      setInterval(this.shutdowninterval, 420000);
      this.$i18n.locale = this.lang;
      this.popup(this.$t("now3"), this.$t("10willforce"));
    },
    rand(min, max) {
      return min + Math.round((max - min) * Math.random());
    },
    popup(title, message, timeout = 100000) {
      //135000
      this.popuped = true;
      this.popuptitle = title;
      this.popupdesc = message;
      setTimeout(() => {
        this.popuped = false;
      }, timeout);
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("focus");
        /*let alertRet = await Promise.race([
          Modals.alert({
            title: title,
            message: message
          }),
          popup_timeout(timeout),
        ]);*/
      }
    },
    async popup_timeout(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(`timeout ${ms}ms`));
        }, ms);
      });
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
        var linkpath = require(`@/assets/css/reality.theme.scss`);
        fileref.setAttribute("href", linkpath);
      } else {
        var linkpath = require(`@/assets/css/colorful.theme.scss`);
        fileref.setAttribute("href", linkpath);
      }
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
  }
};
</script>
