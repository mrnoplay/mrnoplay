<i18n src="@/assets/lang.json"></i18n>
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
                maxLength="4"
                required
                @keyup.enter.native="start"
              ></b-form-input>
              <span class="digital digitalnote">:00</span>
            </div>
          </div>
        </div>
        <b-popover
          target="playtime"
          :show.sync="timeNAN"
          triggers
          placement="bottom"
        ><div class="warnfather warn">{{ $t("enterinteger") }}</div></b-popover>
        <br /> 
        <b-btn style="-webkit-app-region: no-drag" variant="light" class="new on largebtn" @click="start"><div class="largebtn-innertext">{{ $t("start") }}</div></b-btn>
        <titlepart :canabout="true"></titlepart>
      </div>
      <b-modal
        id="settingspanel"
        ok-only
        :title="$t('stitle')"
        ref="smodal"
        :ok-title="$t('close')"
      >
        <b-row>
          <b-col sm="2" class="settingsleftbar">
            <small>{{ $t('slocale') }}</small>
          </b-col>
          <b-col>
            <b-btn @click="i18nchinese">中文</b-btn>
            <b-btn @click="i18nenglish">English</b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="2" class="settingsleftbar">
            <small>{{ $t('saboutbar') }}</small>
          </b-col>
          <b-col>
            <small class="form-text text-muted" id="abouttext">
              {{ $t('sabout') }} {{ version }}
              <br />
              {{ $t('proud') }}
              <br />
              {{ $t('sauthor') }}
              <a
                class="text-muted-icon"
                href="https://github.com/scris"
                target="_blank"
              >
                <i class="fab fa-github"></i>
              </a>&nbsp;
              <a
                class="text-muted-icon"
                v-if="!isonios"
                href="mailto:slaaker@126.com"
                target="_blank"
              >
                <i class="fa fa-envelope"></i>
              </a>
              {{ $t('sothercontributor') }}
              <br />
              {{ $t('scontribute') }}
              <a
                class="text-muted-icon"
                href="https://github.com/scris/mrnoplay/"
                target="_blank"
              >
                <i class="fab fa-github"></i>
              </a>
            </small>
          </b-col>
        </b-row>
      </b-modal>
    </div>
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
var ipc = null;
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer; //use window.require instead of require
}
export default {
  name: "mr",
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
    this.version = process.env.VUE_APP_VER;
    this.i18nsetlang();
    this.tutorial();
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
    this.isonios = this.isiOS(navigator.userAgent);
    _this = this;
    this.loading = false;
    this.storagesetjson("concentrated", true);
    alarm.src = require("@/assets/scarymusic/" + this.rand(1, 17) + ".mp3");
    if (process.env.VUE_APP_LINXF != "android" && process.env.VUE_APP_LINXF != "electron" && window.Notification) {
      if(Notification.permission === 'granted'){
        //granted
      }else if(Notification.permission === 'denied'){
        //denied
      }else{
        Notification.requestPermission().then(function(permission) {
          if(permission === 'granted'){
            //granted
          }else if(permission === 'denied'){
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
        if (retlang.value != null) _this.lang = retlang.value;
        else (_this.lang = "en"), _this.storagesetlang("en");
      } else (_this.lang = "en"), _this.storagesetlang("en");
      _this.$i18n.locale = _this.lang;
    },
    async tutorial() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf("tutorial") == -1) {
        if(this.iselectron) {
          ipc.send('startonlogin');
        }
        this.storagesetjson('tutorial', 'ed');
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
          if (process.env.VUE_APP_LINXF == "electron") {
            ipc.send("normal-screen");
          }
          this.$router.push("timing");
        });
      } else {
        this.timeNAN = true;
      }
    },
    rand(min, max) {
      return min + Math.round((max - min) * Math.random());
    },
  }
};
</script>
