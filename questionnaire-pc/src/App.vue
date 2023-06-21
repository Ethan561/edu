<template>
  <div id="app">
    <div class="nonet" v-if="!network">网络中断，请检查网络连接</div>
    <!-- <transition :name="transitionName"> -->
      <router-view v-if="network" v-wechat-title="$route.meta.title" />
    <!-- </transition> -->
  </div>
</template>
<script>
import { addEvent, removeEvent } from "@/utils/common.js";
export default {
  name: "App",
  provide () {
    return {
      app: this
    };
  },
  data () {
    return {
      network: true, //默认有网
      lastClickTime: 0,
      count: 0
    };
  },
  created () {
  },
  mounted () {
    addEvent(window, "offline", () => {
      this.network = false;
    })
    addEvent(window, "online", () => {
      this.network = true;
    })
  },
  destroyed () {
    removeEvent(window, "offline")
    removeEvent(window, "online")
  },
};

</script>
<style lang="scss" scoped>
#app {
  overflow-y: auto;
  background: #F4F4F4;
  .nonet {
    padding-top: 200px;
    text-align: center;
    font-size: 16px;
  }
}
</style>
