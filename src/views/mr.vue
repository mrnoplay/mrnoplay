<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div>
    <notify ref="notify"></notify>
    <iframe id="tongji" :src="tongjisrc" style="display:inline-block; width:0.5px; height:0.5px"></iframe>
    <b-btn
      variant="light"
      class="new close pointer upperright upperrightbtn"
      @click="exit"
      v-if="iselectron"
      style="-webkit-app-region: no-drag"
    ></b-btn>
    <div class="container">
      <div class="lockmode_enterpwd" v-if="lockmode_enterpwd" style="-webkit-app-region: no-drag">
        <span class="label settingslabel lockmode_enterpwd-btn">{{ $t("lockmode-entertoexit") }}</span>
        <div class="input-btn lockmode_enterpwd-btn">
          <b-btn variant="light" class="new submit-back settingbtn on" @click="lockmode_goback"></b-btn>
          <input
            type="password"
            required
            class="off settinginput lockmodeinput"
            v-model="lockmode_enterpwd_enter"
            @keyup.enter="lockmode_exit"
            :placeholder="$t('entertoexit')"
          />
          <b-btn variant="light" class="new submit settingbtn on" @click="lockmode_exit"></b-btn>
        </div>
        <div class="warnnotintegerfather warnlockmodefather" v-if="lockmode_fail">
          <div class="breathe-div"></div>
          <div class="warn warnnotinteger">{{ $t("lockmode_off_fail") }}</div>
        </div>
      </div>
      <div class="direct-shutdown" style="-webkit-app-region: no-drag" v-if="iselectron">
        <button class="shutdown" @click="_shutdown"></button>
      </div>
      <div class="go-shutdown" style="-webkit-app-region: no-drag" v-if="goshutdown">
        <button class="check-shutdown" @click="shutdown"></button>
      </div>
      <!------------>
      <!-- Today --->
      <!------------>
      <div id="tutorialnbsppart" v-if="ontoday"></div>
      <div id="behind-touch" style="-webkit-app-region: no-drag" @click="gotoday" v-if="!ontoday"></div>
      <div
        id="behind"
        style="-webkit-app-region: no-drag"
        @click="gotoday"
        v-if="!ontoday"
        v-tooltip="{
        content: $t('clicktoseetoday'),
        show: !haveread_today_tooltip,
        trigger: 'manual',
      }"
      ></div>
      <div id="main" v-if="ontoday">
        <div class="digitalboard border" style="-webkit-app-region: no-drag" v-if="!todayset">
          <div class="juniordigitalboard on">
            <div class="digitaltop">{{ $t("todayiwillplay") }}</div>
            <div class="digitalfather">
              <b-form-input
                id="playtime"
                class="digital"
                v-model="todaytime"
                :placeholder="$t('time')"
                type="tel"
                maxlength="4"
                required
                @keyup.enter.native="start"
              ></b-form-input>
              <span class="digital digitalnote">:00</span>
            </div>
          </div>
        </div>
        <div class="digitalboard border" style="-webkit-app-region: no-drag" v-if="todayset">
          <div class="juniordigitalboard on-notbtn" style="-webkit-app-region: no-drag">
            <div class="digitaltop">{{ $t("today") }}{{ $t("left") }}</div>
            <span class="bignumber bignumber-digital">{{ todaytimeleft }}</span>
            <span class="digital digitalnote minutenote">{{ $t('minute') }}</span>
          </div>
        </div>
        <div class="centralnbsp" v-if="!todayset"></div>
        <div class="warnfather warn settingwarn warnnotintegerfather" v-if="todaytime_isNAN">
          <div class="breathe-div"></div>
          <div class="warn warnnotinteger">{{ $t("enterinteger") }}</div>
        </div>
        <b-btn
          style="-webkit-app-region: no-drag"
          variant="light"
          class="new on largebtn startbtn todaybtn"
          @click="settoday"
          v-if="!todayset"
        >
          <div class="largebtn-innertext">{{ $t("submit") }}</div>
        </b-btn>
        <hr />
        <div class="statisticsfather">
          <div class="statistics">
            <div class="st_left">
              <div class="digitaltop st_digitaltop">
                {{ $t("st_finished") }}
                <span
                  style="-webkit-app-region: no-drag"
                  class="help"
                  v-tooltip="{
                    content: $t('st_help_finished'),
                    placement: 'top-end',
                  }"
                ></span>
              </div>
              <div class="bignumber">{{ st_finished }}</div>
            </div>
            <div class="st_right">
              <div class="digitaltop st_digitaltop">
                {{ $t("st_rpoint") }}
                <span
                  style="-webkit-app-region: no-drag"
                  class="help"
                  v-tooltip="{
                    content: $t('st_help_rpoint'),
                    placement: 'top-start',
                  }"
                ></span>
              </div>
              <div class="bignumber">{{ st_rp }}</div>
            </div>
          </div>
        </div>
      </div>
      <!----------->
      <!-- Main --->
      <!----------->
      <div id="main" v-if="!ontoday">
        <div class="digitalboard border" style="-webkit-app-region: no-drag">
          <div class="juniordigitalboard on">
            <div class="digitaltop">
              {{ $t("iwillplay") }}&nbsp;
              <dic class="optionsfather" @click="gooptions">
                <b-btn
                  variant="light"
                  class="new moreoption pointer"
                  v-if="!ismoreoption"
                ></b-btn>
                <b-btn
                  variant="light"
                  class="new moreoption-back pointer"
                  v-if="ismoreoption"
                ></b-btn>
                {{ $t('setoptions') }}
              </dic>
            </div>
            <div class="options" v-if="ismoreoption">
              <switcher
                :left="$t('rest')"
                :right="$t('work')"
                :default="default_workmode"
                @toleft="workmode_rest"
                @toright="workmode_work"
              ></switcher>
              <div class="digitalfather digitalfather-options">
                <b-form-input
                  id="playtime"
                  class="digital digital-options"
                  :placeholder="$t('whattodo')"
                  v-model="todo"
                ></b-form-input>
              </div>
            </div>
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
        <div class="warnfather warn settingwarn warnnotintegerfather" v-if="timeTOOLONG">
          <div class="breathe-div"></div>
          <div>
            <div class="warn warnnotinteger warnredeem" style="-webkit-app-region: no-drag">
              {{ $t("toolong") }}
              <span
                @click="redeem"
                class="redeem"
                style="-webkit-app-region: no-drag"
              >{{ $t("redeem_use") }}{{ redeem_rp }}{{ $t("redeem") }}</span>
            </div>
          </div>
        </div>
        <div class="warnfather warn settingwarn warnnotintegerfather" v-if="rpnotenough">
          <div class="breathe-div"></div>
          <div class="warn warnnotinteger">{{ $t("rpnotenough") }}</div>
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
      <div
        id="behind-down"
        style="-webkit-app-region: no-drag"
        @click="gomain"
        v-if="ontoday"
        v-tooltip="{
        content: $t('clicktoseemain'),
        show: !haveread_main_tooltip,
        trigger: 'manual',
        placement: 'bottom'
      }"
      ></div>
      <div
        id="behind-down-touch"
        style="-webkit-app-region: no-drag"
        @click="gomain"
        v-if="ontoday"
      ></div>
    </div>
  </div>
</template>

<script>
import loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { Plugins } from "@capacitor/core";
import notify from "@/components/linxf/notify";
import titlepart from "@/components/titlepart";
import switcher from "@/components/linxf/switcher";
const { Storage } = Plugins;
var _this = null;
var ipc = null;
var md5 = require("md5");
var tryparse = require("tryparse");
if (process.env.VUE_APP_LINXF == "electron") {
  ipc = window.require("electron").ipcRenderer;
}
export default {
  name: "mr",
  components: {
    loading,
    titlepart,
    notify,
    switcher,
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
      timeTOOLONG: false,
      version: "",
      lockmode: false,
      lockmode_password: "",
      lockmode_enterpwd: false,
      lockmode_enterpwd_enter: "",
      lockmode_fail: false,
      tongjisrc: "",
      ontoday: false,
      haveread_today_tooltip: true,
      haveread_main_tooltip: true,
      todayset: false,
      todaytimeleft: 0,
      todaytime: undefined,
      todaytime_isNAN: false,
      todaydate: new Date(),
      todaydate_parsed: "todaytime002000",
      st_rp: 20,
      st_finished: 0,
      rpnotenough: false,
      redeem_rp: 0,
      st_rp_illegal: 0,
      exit_type: "initial",
      goshutdown: false,
      ismoreoption: false,
      todo: "",
      default_workmode: false,
      workmode: false,
    };
  },
  watch: {
    async lang(val) {
      this.storagesetlang(val);
      this.$i18n.locale = val;
    },
  },
  mounted: function () {
    //this.clear_dangerous();
    if (process.env.VUE_APP_LINXF == "electron") {
      ipc.on("update_onstart", (event, arg) => {
        this.$refs.notify.send({
          title: this.$t("foundupdate_title"),
          id: 15,
          message: this.$t("foundupdate") + arg,
        });
      });
      ipc.on("crashback", () => {
        this.exit_type = "crash";
        this.storagesetjson("exit_type", "crash");
      });
      this.iselectron = true;
      if (process.platform == "win32")
        this.tongjisrc = "https://mrnoplay-tongji.now.sh/index-win.html";
      else this.tongjisrc = "https://mrnoplay-tongji.now.sh/index-mac.html";
    } else {
      this.tongjisrc = "https://mrnoplay-tongji.now.sh/index-web.html";
    }
    _this = this;
    this.todaydate_parsed =
      "todaytime" +
      this.todaydate.getDate() +
      this.todaydate.getMonth() +
      this.todaydate.getFullYear();
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
    this.gettooltipdata();
    this.gettodaydata();
    this.getrp().then(() => {
      if (this.exit_type == "illegal" && this.iselectron) {
        this.st_rp -= 10;
        this.storagesetjson("rp", this.st_rp);
        this.$refs.notify.send({
          title: this.$t("illegal"),
          id: 17,
          message: this.$t("illegaltext"),
        });
      }
      this.exit_type = "illegal";
      this.storagesetjson("exit_type", "illegal");
    });
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
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            //granted
          } else if (permission === "denied") {
            //denied
          }
        });
      }
    }
    this.storagesetjson("workmode", false);
  },
  beforeDestroy: function () {},
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
        value: val,
      });
    },
    async storagesetjson(key, val) {
      await Storage.set({
        key: key,
        value: JSON.stringify(val),
      });
    },
    async gettodaydata() {
      const keys = await Storage.keys();
      if (keys.keys.indexOf(this.todaydate_parsed) != -1) {
        const ret_ttl = await Storage.get({ key: this.todaydate_parsed });
        if (JSON.parse(ret_ttl.value) != null) {
          this.todayset = true;
          this.todaytimeleft = JSON.parse(ret_ttl.value);
        }
      } else {
        this.todayset = false;
      }
    },
    async gettooltipdata() {
      const ret_t = await Storage.get({ key: "haveread_today_tooltip" });
      this.haveread_today_tooltip = JSON.parse(ret_t.value);
      const ret_m = await Storage.get({ key: "haveread_main_tooltip" });
      this.haveread_main_tooltip = JSON.parse(ret_m.value);
    },
    async getrp() {
      const ret_r = await Storage.get({ key: "rp" });
      if (
        tryparse.int(JSON.parse(ret_r.value)) != null ||
        tryparse.int(JSON.parse(ret_r.value)) == 0
      )
        this.st_rp = tryparse.int(JSON.parse(ret_r.value));
      else this.st_rp = 20;
      const ret_f = await Storage.get({ key: "finished" });
      if (
        tryparse.int(JSON.parse(ret_f.value)) != null ||
        tryparse.int(JSON.parse(ret_f.value)) == 0
      )
        this.st_finished = JSON.parse(ret_f.value);
      else this.st_finished = 0;
      const ret_et = await Storage.get({ key: "exit_type" });
      this.exit_type = JSON.parse(ret_et.value);
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
      if (/(^[1-9]\d*$)/.test(this.playtime) || this.playtime == 0.05) {
        if (this.todayset) {
          if (this.todaytimeleft >= this.playtime) {
            this.todaytimeleft -= this.playtime;
            this.storagesetjson(this.todaydate_parsed, this.todaytimeleft);
            this.storagesetjson("lastcost_time", this.playtime);
            this.start_func();
          } else {
            this.timeTOOLONG = true;
            this.redeem_rp = Math.round(
              (this.playtime - this.todaytimeleft) / 4
            );
            if (this.redeem_rp == 0) this.redeem_rp++;
          }
        } else {
          this.start_func();
        }
      } else {
        this.timeNAN = true;
      }
    },
    start_func() {
      this.storagesetjson("lastcost_rp", this.redeem_rp);
      this.storagesetjson("whattodo", this.whattodo);
      this.timeTOOLONG = false;
      this.storagesetjson("playtime", Number(this.playtime)).then(() => {
        this.storagesetjson("concentrated", false);
        this.$router.push("timing");
      });
    },
    rand(min, max) {
      return min + Math.round((max - min) * Math.random());
    },
    exit() {
      if (this.iselectron) {
        if (this.todayset) {
          this.$refs.notify.send({
            title: this.$t("cannotexit"),
            id: 19,
            message: this.$t("cannotexittext"),
          });
        } else if (this.lockmode) {
          this.lockmode_enterpwd = true;
        } else {
          this.storagesetjson("exit_type", "exit");
          ipc.send("exit-preventdefault");
        }
      }
    },
    lockmode_exit() {
      if (this.iselectron) {
        if (this.lockmode_password == md5(this.lockmode_enterpwd_enter)) {
          this.storagesetjson("exit_type", "exit");
          this.lockmode_fail = false;
          this.lockmode_enterpwd = false;
          ipc.send("exit");
        } else {
          this.lockmode_fail = true;
        }
      }
    },
    lockmode_goback() {
      this.lockmode_enterpwd = false;
    },
    gotoday() {
      this.ontoday = true;
      this.haveread_today_tooltip = true;
      this.storagesetjson("haveread_today_tooltip", true);
    },
    gomain() {
      this.ontoday = false;
      this.haveread_main_tooltip = true;
      this.storagesetjson("haveread_main_tooltip", true);
    },
    settoday() {
      if (/(^[1-9]\d*$)/.test(this.todaytime)) {
        this.todayset = true;
        this.todaytimeleft = this.todaytime;
        this.todaytime_isNAN = false;
        this.storagesetjson(this.todaydate_parsed, this.todaytime);
      } else {
        this.todaytime_isNAN = true;
      }
    },
    redeem() {
      if (this.st_rp >= this.redeem_rp) {
        this.st_rp -= this.redeem_rp;
        this.storagesetjson("rp", this.st_rp);
        this.storagesetjson("lastcost_time", this.todaytimeleft);
        this.storagesetjson(this.todaydate_parsed, 0);
        this.rpnotenough = false;
        this.start_func();
      } else {
        this.rpnotenough = true;
      }
    },
    _shutdown() {
      this.goshutdown = !this.goshutdown;
    },
    shutdown() {
      if (this.iselectron) {
        this.storagesetjson("exit_type", "direct-shutdown");
        ipc.send("shutdown");
      }
    },
    async clear_dangerous() {
      await Storage.clear();
    },
    gooptions() {
      this.ismoreoption = !this.ismoreoption;
    },
    workmode_work() {
      this.workmode = true;
      this.storagesetjson("workmode", true);
    },
    workmode_rest() {
      this.workmode = false;
      this.storagesetjson("workmode", false);
    },
  },
};
</script>
