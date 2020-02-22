<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div class="titlepart" style="-webkit-app-region: no-drag">
    <div class="title new left">{{ $t("mrnoplay") }}</div>
    <div class="titlebtns" v-if="canabout">
      <b-btn variant="light" class="new about pointer" @click="about"></b-btn>
      <b-btn variant="light" class="new settings pointer" @click="settings"></b-btn>
      <b-btn variant="light" class="new exit pointer" @click="exit" v-if="iselectron"></b-btn>
    </div>
  </div>
</template>

<script>
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;
import notify from "@/components/linxf/notify";
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  ipc.on("closenotification", function(event, arg) {
    notify.methods.send({
      title: this.$t("unsupported"),
      id: 2,
      message: this.$t("properwaytoexit")
    });
  });
  ipc.on("toomanyapps", function(event, arg) {
    notify.methods.send({
      title: this.$t("unsupported"),
      id: 3,
      message: this.$t("1apprunning")
    });
  });
}
export default {
  name: "titlepart",
  props: ["canabout"],
  data() {
    return {
      iselectron: false,
      lang: "en"
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
    this.i18nsetlang();
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
  },
  methods: {
    about() {
      this.$router.push("about");
    },
    settings() {
      this.$router.push("settings");
    },
    exit() {
      ipc.send("exit");
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
