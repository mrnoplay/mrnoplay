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
      <div id="tutorialnbsppart"></div>
      <div id="main" style="-webkit-app-region: no-drag">
        <div class="select">中文<b-btn variant="light" :class="switchlang" @click="selectlang"></b-btn>English</div>
        <div class="tutorialboard border">
            <div class="on-notbtn tutorial">
              <div v-if="page == 1">
                <img src="@/assets/tutorial-game.png" id="gameicon-page1-page6"/>
                <div class="pagetitle">{{ $t('tut.1.1') }}</div>
                <div class="pagetext">{{ $t('tut.1.2') }}</div>
              </div>
              <div v-if="page == 2">
                <img src="@/assets/tutorial-start-en.png" id="gameicon" v-if="lang == 'en'"/>
                <img src="@/assets/tutorial-start-cn.png" id="gameicon" v-if="lang == 'cn'"/>
                <div class="pagetitle">{{ $t('tut.2.1') }}</div>
                <div class="pagetext">{{ $t('tut.2.2') }}</div>
              </div>
              <div v-if="page == 3">
                <img src="@/assets/tutorial-stop-en.png" id="gameicon" v-if="lang == 'en'"/>
                <img src="@/assets/tutorial-stop-cn.png" id="gameicon" v-if="lang == 'cn'"/>
                <div class="pagetitle">{{ $t('tut.3.1') }}</div>
                <div class="pagetext">{{ $t('tut.3.2') }}<span class="red">{{ $t('tut.3.3') }}</span>{{ $t('tut.3.4') }}</div>
              </div>
              <div v-if="page == 4">
                <img src="@/assets/tutorial-over-en.png" id="gameicon" v-if="lang == 'en'"/>
                <img src="@/assets/tutorial-over-cn.png" id="gameicon" v-if="lang == 'cn'"/>
                <div class="pagetitle">{{ $t('tut.4.1') }}</div>
                <div class="pagetext">{{ $t('tut.4.2') }}<span class="red">{{ $t('tut.4.3') }}</span>{{ $t('tut.4.4') }}</div>
              </div>
              <div v-if="page == 5">
                <img src="@/assets/tutorial-wintray.png" id="gameicon-page1-page6"/>&nbsp;&nbsp;<img src="@/assets/tutorial-mactray.png" id="gameicon-page1-page6"/>
                <div class="pagetitle">{{ $t('tut.5.1') }}</div>
                <div class="pagetext">{{ $t('tut.5.2') }}</div>
                <br>
                <small v-if="!startonlogin && iselectron" class="new largebtn-notbtn transparent small red tutorial-a" @click="settings">{{ $t("tostartonlogin") }}<br>{{ $t("tostartonlogin-2") }}</small>
              </div>
            </div>
          </div>
        <b-btn variant="light" class="new on largebtn" @click="next" style="-webkit-app-region: no-drag"><div class="largebtn-innertext">{{ nexttext }}</div></b-btn>
        <div>
          <b-btn variant="light" class="new largebtn transparent cancelbtn" @click="goback" style="-webkit-app-region: no-drag"><div class="largebtn-innertext">{{ $t('skip') }}</div></b-btn>
          <small class="new largebtn-notbtn transparent small">{{ $t("canopenlater") }}</small>
        </div>
        </div>
      </div>
      <notify ref="notify"></notify>
    </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
  import notify from "@/components/linxf/notify";
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { Plugins } from '@capacitor/core';
  const { Storage } = Plugins;
  import titlepart from '@/components/titlepart'
  var alarm = new Audio();
  var _this = null;
  alarm.src = require("@/assets/alarm.mp3");
  var ipc = null;
  if (process.env.VUE_APP_LINXF == "electron") {
    ipc = window.require("electron").ipcRenderer; //use window.require instead of require
  }
  export default {
    name: 'tutorial',
    components: {
      loading,
      titlepart,
      notify
    },
    data() {
      return {
        time: '00:00',
        loading: true,
        iselectron: false,
        isonios: false,
        lang: 'en',
        version: '1.0.0',
        page: 1,
        nexttext: '下一页',
        switchlang: 'switch-on',
        firsttime: false,
        startonlogin: true,
      };
    },
    watch: {
      async lang (val) {
        this.storagesetlang(val);
        this.$i18n.locale = val;
      },
    },
    mounted: function() {
      this.checkiffirst();
      this.version = process.env.VUE_APP_VER;
      this.storagesetjson('cannotify', false);
      this.i18nsetlang();
      this.isonios = this.isiOS(navigator.userAgent);
      _this = this;
      this.loading = false;
      this.timing = true;
      this.page = 1;
      if(process.env.VUE_APP_LINXF == 'electron') {
        this.iselectron = true;
        ipc.send('full-screen');
      }
    },
    beforeDestroy: function() {

    },
    methods: {
      async checkiffirst() {
        const keys = await Storage.keys();
        if (keys.keys.indexOf("tutorial") == -1) {
          this.firsttime = true;
          this.storagesetjson('tutorial', 'ed');
        }
        if (keys.keys.indexOf("startonlogin") != -1) {
          const ret = await Storage.get({ key:'startonlogin' });
          if(ret.value == "false") this.startonlogin = false;
        } else {
          this.startonlogin = false;
        }
      },
      isiPad (userAgent) {
        return (userAgent.indexOf("iPad") > -1);
      },
      isiPhone (userAgent) {
        return (userAgent.indexOf("iPhone") > -1);
      },
      isiOS (userAgent) {
        return this.isiPad(userAgent) || this.isiPhone(userAgent);
      },
      async storagesetlang(val) {
        await Storage.set({
          key: 'lang',
          value: val
        });
      },
      async storagesetjson(key,val) {
        await Storage.set({
          key: key,
          value: JSON.stringify(val)
        });
      },
      async i18nsetlang() {
        const keys = await Storage.keys();
        if(keys.keys.indexOf('lang') != -1) {
          const retlang = await Storage.get({ key:'lang' });
          if(retlang.value != null) _this.lang = retlang.value;
          else _this.lang = 'en', _this.storagesetlang('en');
        } else _this.lang = 'en', _this.storagesetlang('en');
        _this.$i18n.locale = _this.lang;
        this.nexttext = this.$t("next");
        if (this.lang == 'en') this.switchlang = 'switch-on';
        else this.switchlang = 'switch-off';
      },
      i18nchinese() {
        this.lang = 'cn';
        if(this.iselectron) {
          ipc.send('cn');
        }
      },
      i18nenglish() {
        this.lang = 'en';
        if(this.iselectron) {
          ipc.send('en');
        }
      },
      goback() {
        this.timing = false;
        this.$router.push('/');
      },
      settings() {
        this.timing = false;
        this.$router.push('settings');
      },
      next() {
        if (this.page < 4) {
          this.page ++;
        } else if (this.page == 4) {
          this.page ++;
          this.nexttext = this.$t("over");
        } else {
          this.goback();
        }
      },
      selectlang() {
        if (this.lang == 'en') {
          this.switchlang = 'switch-off';
          this.refreshnexttext('cn');
          this.cn();
        } else {
          this.switchlang = 'switch-on';
          this.refreshnexttext('en');
          this.en();
        }
      },
      cn() {
        this.i18nchinese();
        this.$refs.notify.send({
          title: "成功",
          id: 6,
          message: "已经切换到中文。"
        });
      },
      en() {
        this.i18nenglish();
        this.$refs.notify.send({
          title: "Success",
          id: 7,
          message: "Language is set to English."
        });
      },
      refreshnexttext(rlang) {
        if(rlang == 'cn') {
          if (this.page < 5) {
            this.nexttext = '下一页';
          } else {
            this.nexttext = '结束';
          }
        } else {
          if (this.page < 5) {
            this.nexttext = 'Next';
          } else {
            this.nexttext = 'Over';
          }
        }
      },
    }
  }
</script>
