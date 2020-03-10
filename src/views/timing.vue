<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
    <div class="container">
      <div id="timingnbsppart"></div>
      <div id="timingcancelnbsppart" v-if="!cancancel"></div>
      <div id="pause" v-if="ispausing">
        <button class="resume" @click="resume"></button>
      </div>
      <div id="main">
        <div class="digitalboard border">
          <div class="juniordigitalboard on-notbtn" style="-webkit-app-region: no-drag">
            <div class="digitaltop">{{ $t("left") }}</div>
            <div class="digitalfather digitalfather-notinput">
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
          class="new on largebtn stopbtn"
          @click="stop"
          style="-webkit-app-region: no-drag"
        >
          <div class="largebtn-innertext">{{ $t("stop") }}</div>
        </b-btn>
        <div v-if="cancancel" class="canceltextfather">
          <b-btn
            variant="light"
            class="new largebtn transparent cancelbtn"
            @click="cancel"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("cancel") }}</div>
          </b-btn>
          <small
            v-if="iselectron"
            class="new largebtn-notbtn transparent small canceltext"
          >{{ $t("cancel15s") }}</small>
          <small
            v-if="!iselectron"
            class="new largebtn-notbtn transparent small canceltext"
          >{{ $t("cancelweb") }}</small>
        </div>
        <div v-if="!cancancel" class="canceltextfather">
          <b-btn
            variant="light"
            class="new largebtn transparent cancelbtn"
            @click="pause"
            style="-webkit-app-region: no-drag"
          >
            <div class="largebtn-innertext">{{ $t("pause") }}</div>
          </b-btn>
        </div>
        <div>
          <small class="new largebtn-notbtn transparent small canceltext" v-if="controlrptext">
            {{ $t('nowstop') }}{{ get_rp }}{{ $t('rp') }}
          </small>
          <small class="new largebtn-notbtn transparent small canceltext" v-if="!controlrptext">
            {{ $t('nowexitillegally') }}{{ illegal_rp }}{{ $t('rp') }}
          </small>
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
var tryparse = require("tryparse");
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
      halflock: true,
      first_shutdown: false,
      st_rp: 20,
      st_finished: 0,
      lastcost_rp: 0,
      lastcost_time: 0,
      todayset: false,
      todaydate: new Date(),
      todaydate_parsed: "todaytime002000",
      get_rp: 3,
      illegal_rp: 10,
      controlrptext: true,
      ispausing: false,
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
    this.todaydate_parsed =
      "todaytime" +
      this.todaydate.getDate() +
      this.todaydate.getMonth() +
      this.todaydate.getFullYear();
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang();
    this.storagesetjson("cannotify", true);
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
      setInterval(() => {
        this.controlrptext = !this.controlrptext;
      }, 5000);
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
    if(this.ispausing && this.iselectron) {
      ipc.send('full-screen');
    }
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
      // --------
      // Language
      // --------
      if (keys.keys.indexOf("lang") != -1) {
        const retlang = await Storage.get({ key: "lang" });
        if (retlang.value != null) _this.lang = retlang.value;
        else (_this.lang = "en"), _this.storagesetlang("en");
      } else (_this.lang = "en"), _this.storagesetlang("en");
      _this.$i18n.locale = _this.lang;
      // ---------
      // Play Time
      // ---------
      if (keys.keys.indexOf("playtime") != -1) {
        const rettime = await Storage.get({ key: "playtime" });
        if (rettime.value != null) _this.playtime = rettime.value;
        else (_this.playtime = 5), _this.storagesetjsom("playtime", 5);
        _this.lefttime = 60 * _this.playtime;
        _this.displaytime = _this.playtime.toString() + ":00";
      }
      // ----------------
      // First - Shutdown
      // ----------------
      if (keys.keys.indexOf("first-shutdown") != -1) {
        const ret = await Storage.get({ key: "first-shutdown" });
        if (ret.value != null) {
          if (JSON.parse(ret.value) != "not-first") {
            this.first_shutdown = true;
          }
        } else this.first_shutdown = true;
      } else this.first_shutdown = true;
      // --------------
      // Last - Cost RP
      // --------------
      const ret_r = await Storage.get({ key: "rp" });
      if (
        tryparse.int(JSON.parse(ret_r.value)) != null ||
        tryparse.int(JSON.parse(ret_r.value)) == 0
      )
        this.st_rp = tryparse.int(JSON.parse(ret_r.value));
      else this.st_rp = 20;
      const ret_l = await Storage.get({ key: "lastcost_rp" });
      if (
        tryparse.int(JSON.parse(ret_l.value)) != null ||
        tryparse.int(JSON.parse(ret_l.value)) == 0
      )
        this.lastcost_rp = tryparse.int(JSON.parse(ret_l.value));
      else this.lastcost_rp = 0;
      // ---------------
      // Today Time Left
      // ---------------
      if (keys.keys.indexOf(this.todaydate_parsed) != -1) {
        const ret_ttl = await Storage.get({ key: this.todaydate_parsed });
        if (JSON.parse(ret_ttl.value) != null) {
          this.todayset = true;
          this.todaytimeleft = JSON.parse(ret_ttl.value);
        }
      }
      const ret_lt = await Storage.get({ key: "lastcost_time" });
      if (
        tryparse.int(JSON.parse(ret_lt.value)) != null ||
        tryparse.int(JSON.parse(ret_lt.value)) == 0
      )
        this.lastcost_time = tryparse.int(JSON.parse(ret_lt.value));
      else this.lastcost_time = 0;
      // -------------
      // Finished Time
      // -------------
      const ret_f = await Storage.get({ key: "finished" });
      if (
        tryparse.int(JSON.parse(ret_f.value)) != null ||
        tryparse.int(JSON.parse(ret_f.value)) == 0
      )
        this.st_finished = JSON.parse(ret_f.value);
      else this.st_finished = 0;
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    stop() {
      if (this.first_shutdown && this.iselectron) {
        this.storagesetjson("first-shutdown", "not-first");
        this.first_shutdown = false;
        this.first_shutdown_confirm();
      } else {
        this.storagesetjson("rp", this.st_rp + this.get_rp);
        this.storagesetjson('exit_type', 'shutdown');
        this.storagesetjson("finished", this.st_finished + 1);
        if (process.env.VUE_APP_LINXF == "electron") {
          ipc.send("shutdown");
        } else {
          this.$router.push("/");
        }
      }
    },
    async first_shutdown_confirm() {
      let confirmRet = await Modals.confirm({
        title: this.$t("confirm-shutdown"),
        message: this.$t("confirm-shutdown-text")
      });
      if (confirmRet.value) {
        this.storagesetjson("finished", this.st_finished + 1);
        this.storagesetjson('exit_type', 'shutdown');
        this.storagesetjson("rp", this.st_rp + this.get_rp);
        ipc.send("shutdown");
      }
    },
    cancel() {
      this.timing = false;
      this.storagesetjson("concentrated", true);
      this.storagesetjson('exit_type', 'cancel');
      if (this.todayset) {
        this.storagesetjson("rp", this.st_rp + this.lastcost_rp);
        this.storagesetjson(
          this.todaydate_parsed,
          this.todaytimeleft + this.lastcost_time
        );
        this.storagesetjson("lastcost_rp", 0);
      }
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
        var linkpath = require(`@/assets/css/reality.theme.scss`);
        fileref.setAttribute("href", linkpath);
      } else {
        var linkpath = require(`@/assets/css/colorful.theme.scss`);
        fileref.setAttribute("href", linkpath);
      }
      document.getElementsByTagName("head")[0].appendChild(fileref);
    },
    pause() {
      this.ispausing = true;
      this.timing = false;
      if (this.iselectron) {
        ipc.send('full-screen');
      }
    },
    resume() {
      this.ispausing = false;
      this.timing = true;
      if (this.iselectron) {
        ipc.send('normal-screen');
      }
    }
  }
};
</script>
