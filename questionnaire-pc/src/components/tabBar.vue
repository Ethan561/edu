<template>
  <transition name="slid_up">
    <ul class="tabBar flex-between">
      <router-link
        tag="li"
        :to="{name:'home'}"
      >
        <span class="iconfont icon-shouye-shouye"></span>
        首页
      </router-link>
      <router-link
        tag="li"
        :to="{name:'user'}"
      >
        <span class="iconfont icon-wode"></span>
        我的
      </router-link>
    </ul>
  </transition>
</template>
<script>
export default {
  name: "tabBar",
  data() {
    return {
      routes: [],
    };
  },
  mounted() {
    // console.log(this.$router.options.routes.filer(o=>o.meta.nav));
  },
};
</script>
<style lang="scss" scoped>
@import "@/style/var.scss";
@import "@/style/mixin.scss";
.tabBar {
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #ffffff;
  box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
  padding-top: 8px;
  @include x-padding-bottom(10px);
  li {
    height: 30px;
    width: 100%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      margin-right: 10px;
    }
  }
  .router-link-active {
    color: $base-color;
  }
}
</style>
