<template>
  <div class="lost">
    <!-- <img src="~img/404.png"> -->
    <h1>抱歉，您访问的页面丢失。</h1>
  </div>
</template>
<script>
export default {
  name: 'lost',
  data() {
    return {

    }
  }
}

</script>
<style lang="scss" scoped>
.lost {
  padding-top: 150px;
  text-align: center;

  img {
    width: 250px;
    height: auto;
    margin: 0 auto;
  }

  h1 {
    font-size: 18px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
}

</style>
