<i18n src="@/assets/lang.json"></i18n>
<template>
  <div>
    <!--
    <div id="planselectorcontainer" class="linediv">
      <div class="toptext btn"><b-btn variant="light" class="bfa topicon">Mr Noplay</b-btn></div>
      <div class="btn closewindowcontainer" style="-webkit-app-region: no-drag; -webkit-user-select: none">
        <b-btn variant="light" class="bfa topicon" v-b-modal.settingspanel><i class="fa fa-sliders-h"></i></b-btn>
        <a v-if="iselectron" class="btn bfa closewindow topicon btn-light" href="javascript:window.close()"><i class="fa fa-times"></i></a>
      </div>
    </div>
    <div id="undergradient" class="linediv"></div>
    -->
    <div class="container">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" loader="bars"></loading>
      <titlepart></titlepart>
      <div id="notifies" style="-webkit-app-region: no-drag">
        I'll play for <br>
        <b-form-input
          id="playtime"
          v-model="playtime"
          type="number"
          required
          @keyup.enter.native="start">
        </b-form-input>
        <b-popover target="playtime" :show.sync="timeNAN" triggers="" variant="danger" placement="bottom">
          Please Enter an Integer
        </b-popover>
        Minutes <br>
        <b-btn variant="light" class="bfa" @click="start">Go</b-btn>
      </div>
      <b-modal
        id="settingspanel"
        ok-only
        :title="$t('stitle')"
        ref="smodal"
        :ok-title="$t('close')">
        <b-row>
          <b-col sm="2" class="settingsleftbar"><small>{{ $t('slocale') }}</small></b-col>
          <b-col><b-btn @click="i18nchinese">中文</b-btn><b-btn @click="i18nenglish">English</b-btn></b-col>
        </b-row>
        <b-row>
          <b-col sm="2" class="settingsleftbar"><small>{{ $t('saboutbar') }}</small></b-col>
          <b-col>
            <small class="form-text text-muted" id="abouttext">
              {{ $t('sabout') }} {{ version }} <br> 
              {{ $t('proud') }} <br> 
              {{ $t('sauthor') }} <a class="text-muted-icon" href="https://github.com/scris" target="_blank"><i class="fab fa-github"></i></a>&nbsp;<a class="text-muted-icon" v-if="!isonios" href="mailto:slaaker@126.com" target="_blank"><i class="fa fa-envelope"></i></a> {{ $t('sothercontributor') }} <br>
              {{ $t('scontribute') }} <a class="text-muted-icon" href="https://github.com/scris/mrnoplay/" target="_blank"><i class="fab fa-github"></i></a>
            </small>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { Plugins } from '@capacitor/core';
  const { Storage } = Plugins;
  import timepicker from 'vue-ctk-date-time-picker';
  import '@/assets/vue-ctk-date-time-picker.css';
  import titlepart from '@/components/titlepart'
  var alarm = new Audio();
  var _this = null;
  alarm.src = require("@/assets/alarm.mp3");
  export default {
    name: 'mr',
    components: {
      loading,
      timepicker,
      titlepart,
    },
    data() {
      return {
        time: '00:00',
        loading: true,
        iselectron: false,
        isonios: false,
        lang: 'en',
        iffetch: 0,
        playtime: 5,
        timeNAN: false,
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
      },
      i18nchinese() {
        this.lang = 'cn';
      },
      i18nenglish() {
        this.lang = 'en';
      },
      start() {
        if((/(^[1-9]\d*$)/.test(this.playtime))) {
          this.storagesetjson('playtime', Number(this.playtime)).then(() => {
            this.$router.push('timing');
          });
        } else {
          this.timeNAN = true;
        }
      }
    }
  }
</script>
