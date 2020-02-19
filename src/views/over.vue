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
        <div class="notifyboard border">
          <div class="juniornotifyboard on-notbtn">
            <div class="digitaltop notifytop">{{ $t("notify") }}</div>
            <div class="notifyfather">{{ $t("willpunish") }}</div>
          </div>
        </div>
        <div class="warnfathers">
          <div class="warnfather" v-if="iselectron">
            <div class="breathe-div"></div>
            <div class="warn">{{ $t("firstsavefiles") }}</div>
          </div>
          <b-alert v-model="punishstart" class="warnfather" style="z-index: 2000;" variant="danger">
            <div class="breathe-div"></div>
            <div class="warn">{{ $t("punishstart") }}</div>
          </b-alert>
        </div>
        <b-btn
          variant="light"
          class="new on largebtn"
          @click="cancel"
          style="-webkit-app-region: no-drag"
        >
          <div class="largebtn-innertext">{{ $t("over") }}</div>
        </b-btn>
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
var ipc = null;
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
    };
  },
  watch: {
    async lang(val) {
      this.storagesetlang(val);
      this.$i18n.locale = val;
    }
  },
  mounted: function() {
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang().then(() => {
      this.$refs.notify.send({
        title: this.$t("timeisup"),
        id: 8,
        message: this.$t("willpunish")
      });
    });
    this.storagesetjson('cannotify', true);
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
    this.isonios = this.isiOS(navigator.userAgent);
    _this = this;
    this.loading = false;
    this.timing = true;
    alarm.src = require("@/assets/music/scarymusic/" + this.rand(1, 17) + ".mp3");
    setTimeout(this.timeout, 180000);
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
        if (retlang.value != null) _this.lang = retlang.value;
        else (_this.lang = "en"), _this.storagesetlang("en");
      } else (_this.lang = "en"), _this.storagesetlang("en");
      _this.$i18n.locale = _this.lang;
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    cancel() {
      this.storagesetjson("concentrated", true);
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
      }
      this.$router.push("/");
    },
    interval() {
      if (this.timing == true && this.$router.currentRoute.path == "/over") {
        this.punishstart = true;
        this.$i18n.locale = _this.lang;
        _this.$refs.notify.send({
          title: _this.$t("stop"),
          id: 1,
          message: _this.$t("notifymessage."+_this.rand(1,2)),
        });
        alarm.play();
      } else {
        clearInterval(this.interval);
      }
    },
    longinterval() {
      this.popup(this.$t("morethan3"),this.$t("10willforce"));
    },
    shutdowninterval() {
      if (process.env.VUE_APP_LINXF == "electron") {
        this.$i18n.locale = this.lang;
        this.$refs.notify.send({
          title: this.$t("willforce"),
          id: 9,
          message: this.$t("willforce"),
        });
        setTimeout(() => {
          this.$i18n.locale = this.lang;
          this.$refs.notify.send({
            title: this.$t("willforce"),
            id: 9,
            message: this.$t("willforce"),
          });
          ipc.send("shutdown");
        }, 5000);
      }
    },
    timeout() {
      setInterval(this.interval, 2000);
      setInterval(this.longinterval, 140000);
      setInterval(this.shutdowninterval, 420000);
      this.$i18n.locale = this.lang;
      this.popup(this.$t("now3"), this.$t("10willforce"));
    },
    rand(min, max) {
      return min + Math.round((max - min) * Math.random());
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
  }
};
</script>
