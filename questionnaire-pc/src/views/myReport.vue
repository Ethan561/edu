<template>
  <div class="wrap">
    <iframe :src="url" @load="success" frameborder="0"></iframe>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return {
      name: "fullView",
      url: "",
    };
  },
  created: function () {
    this.url = this.$route.query.url;
    this.$toast.loading({
      mask: true,
      message: "loading...",
      duration: 0,
    });
  },
  computed: {
    ...mapState({
      museumId: (state) => state.museumObj.museumId,
      museumTitle: (state) => state.museumObj.museumTitle,
    }),
  },
  methods: {
    success() {
      this.$toast('加载成功');
    },
  },
};
</script>

<style lang="scss" scoped>
iframe {
  width: 100vw;
  height: 100vh;
}
</style>
