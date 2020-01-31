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
      <div id="main">
        <div class="tutorialboard border">
            <div class="on-notbtn tutorial">
              <div v-if="page == 1">
                <img src="@/assets/tutorial.1.games.png" id="gameicon"/>
                <div id="wholemorning">你曾说就玩5分钟</div>
                <div id="wholemorning">结果一上午没了</div>
                <div id="wholemorning">你需要掌控时间</div>
                <div id="wholemorning">你需要<span id="wholemorning-mrnoplay">不玩家</span></div>
              </div>
              <div v-if="page == 2">
                <img src="@/assets/game.png" id="gameicon"/>
                <div id="wholemorning">玩着玩着就会停不下来<br>但最开始还是对时间有预算的<br>设置好时间，点击开始按钮<br>在旅途的最开始<br>就给自己一个明确的时间限度</div>
              </div>
              <div v-if="page == 3">
                <img src="@/assets/game.png" id="gameicon"/>
                <div id="wholemorning">开始以后在电脑版<br>点击"停止"就会自动关机<br>防止时间不受控制<br>当然，在15秒内<br>允许点击“取消”改变计划</div>
              </div>
              <div v-if="page == 4">
                <img src="@/assets/game.png" id="gameicon"/>
                <div id="wholemorning">预定的时间结束后<br>进入超时阶段<br>3分钟还未主动停止的<br>将接受恼人声音<br>和弹窗、通知等惩罚</div>
              </div>
              <div v-if="page == 5">
                <img src="@/assets/game.png" id="gameicon"/>
                <div id="wholemorning">10分钟还未结束的<br>将在提示以后强制关机<br>请合理安排使用时间哦</div>
              </div>
              
              <div v-if="page == 6">
                <img src="@/assets/game.png" id="gameicon"/>
                <div id="wholemorning">1. 支持中英双语言<br>2. 支持开机自启<br>3.通过状态栏查看应用</div>
              </div>
            </div>
          </div>
        <b-btn variant="light" class="new on largebtn" @click="next" style="-webkit-app-region: no-drag"><div class="largebtn-innertext">{{ nexttext }}</div></b-btn>
        <div>
          <b-btn variant="light" class="new largebtn transparent cancelbtn" @click="goback" style="-webkit-app-region: no-drag"><div class="largebtn-innertext">{{ $t("skip") }}</div></b-btn>
          <small class="new largebtn transparent small">{{ $t("canopenlater") }}</small>
        </div>
        </div>
      </div>
    </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
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
      };
    },
    watch: {
      async lang (val) {
        this.storagesetlang(val);
        this.$i18n.locale = val;
      },
    },
    mounted: function() {
      this.version = process.env.VUE_APP_VER;
      this.i18nsetlang();
      if(process.env.VUE_APP_LINXF == 'electron') {
        this.iselectron = true;
      }
      this.isonios = this.isiOS(navigator.userAgent);
      _this = this;
      this.loading = false;
      this.timing = true;
      this.page = 1;
    },
    beforeDestroy: function() {

    },
    methods: {
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
      },
      i18nchinese() {
        this.lang = 'cn';
      },
      i18nenglish() {
        this.lang = 'en';
      },
      goback() {
        this.timing = false;
        this.$router.push('/');
      },
      next() {
        if (this.page < 5) {
          this.page ++;
        } else if (this.page == 5) {
          this.page ++;
          this.nexttext = this.$t("over");
        } else {
          this.goback();
        }
      },
    }
  }
</script>
