<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
    <notify ref="notify"></notify>
    <div class="container" style="-webkit-app-region: no-drag">
      <div id="nbsppart"></div>
      <div id="main">
        <div class="notifyboard border">
          <div class="juniornotifyboard on-notbtn">
            <div class="donatefather">
              <b-btn class="new on patreonfather" @click="patreon">
                <img src="@/assets/img/patreon.png" class="patreon" />
              </b-btn>
              <b-btn class="new on patreonfather" @click="wechat">
                <img src="@/assets/img/viawechat.png" class="patreon" />
              </b-btn>
              <img src="@/assets/img/wechat.jpg" class="wechat" v-if="showwechat" />
              <div class="authorinfo" v-if="showwechat">（请在留言写明捐赠者信息以便在 README 显示）</div>
            </div>
          </div>
        </div>
        <b-btn variant="light" class="new on largebtn" @click="goback">
          <div class="largebtn-innertext">{{ $t("back") }}</div>
        </b-btn>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
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
  name: "donate",
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
      isweb: false,
      lang: "en",
      version: "1.0.0",
      todaydate: new Date(),
      todaydate_parsed: "todaytime002000",
      showwechat: false
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
    this.i18nsetlang();
    this.storagesetjson("cannotify", false);
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
    if (
      process.env.VUE_APP_LINXF == "web" ||
      process.env.NODE_ENV == "development"
    ) {
      this.isweb = true;
    }
    this.isonios = this.isiOS(navigator.userAgent);
    _this = this;
    this.loading = false;
    this.timing = true;
    this.todaydate_parsed =
      "todaytime" +
      this.todaydate.getDate() +
      this.todaydate.getMonth() +
      this.todaydate.getFullYear();
    this.gettodaydata();
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
    async gettodaydata() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf(this.todaydate_parsed) != -1) {
        const ret_ttl = await Storage.get({ key: this.todaydate_parsed });
        if (JSON.parse(ret_ttl.value) != null) {
          this.todayset = true;
        }
      } else {
        this.todayset = false;
      }
    },
    i18nchinese() {
      this.lang = "cn";
    },
    i18nenglish() {
      this.lang = "en";
    },
    patreon() {
      if (this.iselectron) {
        if (this.todayset) {
          this.$refs.notify.send({
            title: this.$t("cannotrun"),
            id: 24,
            message: this.$t("cannotpatreon")
          });
        } else {
          ipc.send("patreon");
        }
      } else {
        window.open("https://www.patreon.com/bePatron?u=38415237", "_blank");
      }
    },
    wechat() {
      this.showwechat = true;
    },
    goback() {
      this.timing = false;
      this.$router.push("/about");
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
