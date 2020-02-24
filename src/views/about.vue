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
    <div class="container" style="-webkit-app-region: no-drag">
      <div id="nbsppart"></div>
      <div id="main">
        <div class="notifyboard border">
          <div class="juniornotifyboard on-notbtn">
            <div class="digitaltop notifytop">{{ $t("about") }}</div>
            <div class="notifyfather notifyfather-about" style="-webkit-app-region: no-drag">{{ $t("abouttext") }}</div>
          </div>
        </div>
        <b-btn variant="light" class="new on largebtn" @click="goback">
          <div class="largebtn-innertext">{{ $t("back") }}</div>
        </b-btn>
        <br />
        <div>
          <!-- Remove When in Competition -->
          <div class="authorinfo">Copyright &copy; 2019-2020 {{ $t("tianze") }}.</div>
          <div class="authorinfo">
            <a class="tutorial-a" @click="github">Github</a> @scris
          </div>
          <div class="authorinfo">{{ $t("scrisproduct") }}</div>
        </div>
        <div class="authorinfo">{{ $t("version") }} {{ version }}</div>
        <div class="authorinfo">
          <a class="tutorial-a" @click="tutorial">{{ $t("tutorial") }}</a>&nbsp;
          <a class="tutorial-a" @click="website">{{ $t("website") }}</a>&nbsp;
          <a class="tutorial-a" @click="feedback">{{ $t("feedback") }}</a>
        </div>
      </div>
    </div>
    <br />
    <div class="authorinfo red weblimited" v-if="isweb">{{ $t("webversion.1") }}</div>
    <div class="authorinfo red weblimited" v-if="isweb">{{ $t("webversion.2") }}</div>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
import titlepart from "@/components/titlepart";
var alarm = new Audio();
var _this = null;
alarm.src = require("@/assets/music/alarm.mp3");
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
}
export default {
  name: "about",
  components: {
    loading,
    titlepart
  },
  data() {
    return {
      time: "00:00",
      loading: true,
      iselectron: false,
      isonios: false,
      isweb: false,
      lang: "en",
      version: "1.0.0"
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
    setTimeout(this.interval, 3000);
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
    goback() {
      this.timing = false;
      this.$router.push("/");
    },
    tutorial() {
      this.$router.push("tutorial");
    },
    github() {
      if (this.iselectron) {
        ipc.send("github");
      } else {
        window.open("https://github.com/scris/mrnoplay/", "_blank");
      }
    },
    website() {
      if (this.iselectron) {
        ipc.send("website");
      } else {
        window.open("https://mrnoplay.scris.top/", "_blank");
      }
    },
    feedback() {
      if (this.iselectron) {
        if (this.lang == "cn") ipc.send("feedback-cn");
        else ipc.send("feedback-en");
      } else {
        if (this.lang == "cn")
          window.open("https://support.qq.com/products/127085?", "_blank");
        else window.open("mailto:tianze@scris.top");
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
    }
  }
};
</script>
