<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
    <notify ref="notify"></notify>
    <div class="container setting-container">
      <div class="setting-left" style="-webkit-app-region: no-drag">
        <div id="settingsnbsppart"></div>
        <b-btn
          variant="light"
          class="new on main-like settingbtn settingleftbtn hover-red"
          @click="goback"
        >
          <div class="back chromeheight"></div>
        </b-btn>
      </div>
      <div class="setting-center">
        <div id="settingsnbsppart"></div>
        <div id="setting-main" style="-webkit-app-region: no-drag">
          <!-- -------------- -->
          <!-- Start On Login -->
          <!-- -------------- -->
          <div v-if="iselectron && !default_lockmode" class="settingfield main-like">
            <span class="label settingslabel">{{ $t("startonlogin") }}</span>
            <br />
            <switcher
              :left="$t('turnoff')"
              :right="$t('turnon')"
              :default="default_startonlogin"
              @toleft="notstartonlogin"
              @toright="startonlogin"
            ></switcher>
          </div>
          <!-- -------- -->
          <!-- Language -->
          <!-- -------- -->
          <div class="settingfield main-like" v-if="!default_lockmode">
            <span class="label settingslabel">语言/Language</span>
            <switcher left="中文" right="English" :default="default_lang" @toleft="cn" @toright="en"></switcher>
          </div>
          <!-- ------ -->
          <!-- Update -->
          <!-- ------ -->
          <div v-if="iselectron && !default_lockmode" class="settingfield main-like">
            <span class="label settingslabel">{{ $t("update") }}</span>
            <br />
            <div>
              <a
                class="tutorial-a check-a"
                @click="check"
                v-if="!checking"
              >{{ $t("checkforupdate") }}</a>
              <span class="label" @click="check" v-if="checking">{{ $t("checking") }}</span>
            </div>
          </div>
          <!-- ------------ -->
          <!-- Default Time -->
          <!-- ------------ -->
          <div class="settingfield main-like" v-if="!default_lockmode">
            <span class="label settingslabel">{{ $t("defaulttime") }}</span>
            <div class="input-btn">
              <input
                type="tel"
                maxlength="4"
                required
                class="off settinginput"
                v-model="default_time"
                @keyup.enter="setdefault_time"
              />
              <b-btn variant="light" class="new submit settingbtn on" @click="setdefault_time"></b-btn>
            </div>
            <div class="warnfather warn settingwarn" v-if="timeNAN">
              <div class="breathe-div"></div>
              <div class="warn">{{ $t("enterinteger") }}</div>
            </div>
          </div>
          <!-- ------------- -->
          <!-- Theme Setting -->
          <!-- ------------- -->
          <div class="settingfield main-like" v-if="!default_lockmode">
            <span class="label settingslabel">{{ $t("theme") }}</span>
            <switcher
              :left="$t('colorful')"
              :right="$t('reality')"
              :default="default_theme"
              @toleft="theme_colorful"
              @toright="theme_reality"
            ></switcher>
            <div class="smallerlabelfather">
              <span class="label smallerlabel">{{ $t("theme-notice1") }}</span>
            </div>
            <div class="smallerlabelfather">
              <span class="label smallerlabel">{{ $t("theme-notice2") }}</span>
            </div>
            <div class="smallerlabelfather"></div>
          </div>
          <!-- --------- -->
          <!-- Lock Mode -->
          <!-- --------- -->
          <div class="settingfield main-like">
            <span class="label settingslabel" v-if="!default_lockmode">
              {{ $t("lockmode") }}
              <b>{{ $t("lockmode_off") }}</b>
            </span>
            <div class="input-btn notlockmode" v-if="!default_lockmode">
              <input
                type="password"
                required
                class="off settinginput"
                v-model="default_lockmode_on"
                @keyup.enter="setdefault_lockmode"
                :placeholder="$t('enterpassword')"
              />
              <div class="notlockmode_latterdiv">
                <input
                  type="password"
                  required
                  class="off settinginput"
                  v-model="default_lockmode_on_check"
                  @keyup.enter="setdefault_lockmode_on"
                  :placeholder="$t('enterpassword-reenter')"
                />

                <b-btn
                  variant="light"
                  class="new submit settingbtn on"
                  @click="setdefault_lockmode_on"
                  :placeholder="$t('enterpassword')"
                ></b-btn>
              </div>
            </div>
            <span class="label settingslabel" v-if="default_lockmode">
              {{ $t("lockmode") }}
              <b>{{ $t("lockmode_on") }}</b>
            </span>
            <div class="input-btn" v-if="default_lockmode">
              <input
                type="password"
                required
                class="off settinginput"
                v-model="default_lockmode_off"
                @keyup.enter="setdefault_lockmode_off"
              />
              <b-btn
                variant="light"
                class="new submit settingbtn on"
                @click="setdefault_lockmode_off"
              ></b-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
const { Storage, Modals } = Plugins;
import titlepart from "@/components/titlepart";
var alarm = new Audio();
var _this = null;
alarm.src = require("@/assets/music/alarm.mp3");
import notify from "@/components/linxf/notify";
import switcher from "@/components/linxf/switcher";
var ipc = null;
var md5 = require("md5");
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  ipc.on("updatefailed", function(event, arg) {
    this.checking = false;
    this.checked = true;
    this.checkedtext = "Failed";
    //this.popup(this.$t("updatefailed"), this.$t("updatefailedtext"));
  });
  ipc.on("updateok", function(event, arg) {
    this.checking = false;
    this.checked = true;
    this.checkedtext = "Found";
    //this.popup(this.$t("updateok"), this.$t("updateoktext"));
  });
  ipc.on("updateno", function(event, arg) {
    this.checking = false;
    this.checked = true;
    this.checkedtext = "No update";
    //this.popup(this.$t("updatefailed"), this.$t("noupdatetext"));
  });
}
export default {
  name: "settings",
  components: {
    loading,
    titlepart,
    notify,
    switcher
  },
  data() {
    return {
      time: "00:00",
      loading: true,
      iselectron: false,
      isonios: false,
      lang: "en",
      version: "1.0.0",
      checking: false,
      checked: false,
      checkedtext: "",
      // --------
      // Defaults
      // --------
      default_lang: false,
      default_startonlogin: false,
      default_theme: false,
      default_time: 5,
      default_lockmode: false,
      default_lockmode_on: "",
      default_lockmode_on_check: "",
      default_lockmode_off: "",
      // ------------
      // Defaults End
      // ------------
      timeNAN: false
    };
  },
  watch: {
    async lang(val) {
      this.storagesetlang(val);
      this.$i18n.locale = val;
    }
  },
  mounted: function() {
    this.checking = false;
    this.version = process.env.VUE_APP_VER;
    this.storagesetjson("cannotify", false);
    this.getdefault_lang();
    this.getdefault_startonlogin();
    this.getdefault_time();
    this.getdefault_theme();
    this.getdefault_lockmode();
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
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
    async getdefault_theme() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("theme") != -1) {
        const ret = await Storage.get({ key: "theme" });
        if (ret.value != null) {
          this.settheme(JSON.parse(ret.value));
          if (JSON.parse(ret.value) == "colorful") this.default_theme = false;
          else this.default_theme = true;
        } else
          this.storagesetjson("theme", "colorful"),
            this.settheme("colorful"),
            (this.default_theme = false);
      } else
        this.storagesetjson("theme", "colorful"),
          this.settheme("colorful"),
          (this.default_theme = false);
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
    async getdefault_lang() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lang") != -1) {
        const retlang = await Storage.get({ key: "lang" });
        if (retlang.value != null) this.lang = retlang.value;
        else (this.lang = "en"), this.storagesetlang("en");
      } else (this.lang = "en"), this.storagesetlang("en");
      this.$i18n.locale = this.lang;
      if (this.lang == "en") this.default_lang = true;
      else this.default_lang = false;
    },
    async getdefault_startonlogin() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("startonlogin") != -1) {
        const ret = await Storage.get({ key: "startonlogin" });
        if (ret.value != null) {
          if (ret.value == false || ret.value == "false")
            this.default_startonlogin = false;
          else this.default_startonlogin = true;
        } else
          (this.default_startonlogin = false),
            this.storagesetjson("startonlogin", false);
      } else
        (this.default_startonlogin = false),
          this.storagesetjson("startonlogin", false);
    },
    async getdefault_time() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("default_time") != -1) {
        const ret = await Storage.get({ key: "default_time" });
        if (ret.value != null) {
          this.default_time = Number(JSON.parse(ret.value));
        } else (this.default_time = 5), this.storagesetjson("default_time", 5);
      } else (this.default_time = 5), this.storagesetjson("default_time", 5);
    },
    async getdefault_lockmode() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lockmode") != -1) {
        const ret = await Storage.get({ key: "lockmode" });
        if (ret.value != null) {
          if (ret.value == false || ret.value == "false")
            this.default_lockmode = false;
          else this.default_lockmode = true;
        } else
          (this.default_lockmode = false),
            this.storagesetjson("lockmode", false);
      } else
        (this.default_lockmode = false), this.storagesetjson("lockmode", false);
    },
    goback() {
      this.timing = false;
      this.$router.push("/");
    },
    startonlogin() {
      this.storagesetjson("startonlogin", true);
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("startonlogin");
        this.$refs.notify.send({
          title: this.$t("success"),
          id: 4,
          message: this.$t("on-startonlogin")
        });
      }
    },
    notstartonlogin() {
      this.storagesetjson("startonlogin", false);
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("notstartonlogin");
        this.$refs.notify.send({
          title: this.$t("success"),
          id: 5,
          message: this.$t("off-startonlogin")
        });
      }
    },
    theme_colorful() {
      this.storagesetjson("theme", "colorful");
      this.$refs.notify.send({
        title: this.$t("success"),
        id: 11,
        message: this.$t("theme-ok")
      });
      window.location.reload();
    },
    theme_reality() {
      this.storagesetjson("theme", "reality");
      this.$refs.notify.send({
        title: this.$t("success"),
        id: 11,
        message: this.$t("theme-ok")
      });
      window.location.reload();
    },
    cn() {
      this.lang = "cn";
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("cn");
      }
      this.$refs.notify.send({
        title: "成功",
        id: 6,
        message: "已经切换到中文。"
      });
    },
    en() {
      this.lang = "en";
      if (process.env.VUE_APP_LINXF == "electron") {
        ipc.send("en");
      }
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
        ipc.send("focus");
        let alertRet = await Modals.alert({
          title: title,
          message: message
        });
      }
    },
    setdefault_time() {
      if (/(^[1-9]\d*$)/.test(this.default_time)) {
        this.timeNAN = false;
        this.storagesetjson("default_time", this.default_time);
        this.$refs.notify.send({
          title: this.$t("success"),
          id: 14,
          message: this.$t("defaulttimesuccess")
        });
      } else {
        this.timeNAN = true;
      }
    },
    setdefault_lockmode_on() {
      if (this.default_lockmode_on_check == this.default_lockmode_on) {
        this.storagesetjson("lockmode", true);
        this.default_lockmode = true;
        this.storagesetjson("lockmode_password", md5(this.default_lockmode_on));
        this.$refs.notify.send({
          title: this.$t("success"),
          id: 13,
          message: this.$t("lockmode_on_success")
        });
        if(this.iselectron) {
          ipc.send('turnlockon', md5(this.default_lockmode_on));
        }
        this.default_lockmode_on = "";
        this.default_lockmode_on_check = "";
      } else {
        this.$refs.notify.send({
          title: this.$t("fail"),
          id: 17,
          message: this.$t("lockmode_on_fail")
        });
      }
    },
    async setdefault_lockmode_off() {
      var original = "";
      const keys = await Storage.keys();
      if (keys.keys.indexOf("lockmode_password") != -1) {
        const ret = await Storage.get({ key: "lockmode_password" });
        if (ret.value != null) {
          original = JSON.parse(ret.value);
          if (original == md5(this.default_lockmode_off))
            this._to_set_setdefault_lockmode_off();
          else {
            this.$refs.notify.send({
              title: this.$t("fail"),
              id: 16,
              message: this.$t("lockmode_off_fail")
            });
          }
        } else this._to_set_setdefault_lockmode_off();
      } else this._to_set_setdefault_lockmode_off();
    },
    _to_set_setdefault_lockmode_off() {
      this.default_lockmode_off = "";
      this.default_lockmode = false;
      this.storagesetjson("lockmode", false);
      this.$refs.notify.send({
        title: this.$t("success"),
        id: 15,
        message: this.$t("lockmode_off_success")
      });
      if(this.iselectron) {
        ipc.send('turnlockoff');
      }
    }
  }
};
</script>
