<template>
  <div class="layout">
    <router-view class="root" />
    <!-- <tab-bar></tab-bar> -->
  </div>
</template>
<script>
// import tabBar from "@/components/tabBar";
// import vHeader from "@/components/vHeader";
export default {
  data() {
    return {};
  },
  // components: {
  //   tabBar,
  //   vHeader,
  // },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.layout {
  height: 100%;
  background: #F4F4F4;
}
.root {
  height: 100%;
  overflow-y: auto;
  // padding: 10px;
  // @include calc-h(50px);
}
</style>
