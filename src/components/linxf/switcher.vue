<i18n src="@/assets/json/lang.json"></i18n>
<template>
  <div class="select">
    {{ left }}
    <b-btn variant="light" :class="btnclass" @click="choose"></b-btn>
    {{ right }}
  </div>
</template>

<script>
export default {
  name: "switcher",
  props: ["left", "right", "default"],
  data() {
    return {
      iselectron: false,
      btnclass: "switch-off",
      side: '',
    };
  },
  watch: {
    async default (val) {
      this.side = val;
      if(val == false) {
        this.btnclass = "switch-off";
      } else {
        this.btnclass = 'switch-on';
      }
    },
  },
  mounted: function() {
    this.side = this.default;
    //左 off false 右 on true
    if(this.default == false) {
      this.btnclass = "switch-off";
    } else {
      this.btnclass = 'switch-on';
    }
    if (process.env.VUE_APP_LINXF == "electron") {
      this.iselectron = true;
    }
  },
  methods: {
    choose() {
      if(this.side == false) {
        this.toright();
        this.side = true;
        this.btnclass = 'switch-on';
      } else {
        this.toleft();
        this.side = false;
        this.btnclass = 'switch-off';
      }
    },
    toleft() {
      this.$emit('toleft');
    },
    toright() {
      this.$emit('toright');
    }
  }
};
</script>
