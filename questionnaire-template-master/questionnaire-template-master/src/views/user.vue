<!-- 我的 -->
<template>
  <div class="user">
    <div class="box1 flex-start">
      <img
        src="@/assets/avater.png"
        alt=""
      >
      <div class="box1-user">
        <p>姓名：{{userinfo.nickname}}</p>
        <p>学号：{{userinfo.username}}</p>
      </div>
    </div>
    <div class="box2">
      <div class="box2-top flex-between">
        <div class="box2-top__item">
          <p>您待完成的问卷</p>
          <p class="num">{{userinfo.undone}}份</p>
        </div>
        <div class="box2-top__item">
          <p>您已完成的问卷</p>
          <p class="num">{{userinfo.done}}份</p>
        </div>
      </div>
      <ul class="list">
        <li>
          <img
            src="@/assets/wenjuan.png"
            alt=""
          >
          <p>待答问卷</p>
        </li>
        <li>
          <img
            src="@/assets/yidawenjuan.png"
            alt=""
          >
          <p>已答问卷</p>
        </li>
        <li @click="goReport">
          <img
            src="@/assets/baogao.png"
            alt=""
          >
          <p>我的报告</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { HTTP_Userinfo } from "@/http/interface";
export default {
  data() {
    return {
      userinfo: {},
    };
  },

  mounted() {
    this.getuserInfo();
  },

  methods: {
    getuserInfo() {
      HTTP_Userinfo().then((res) => {
        this.userinfo = res.data;
      });
    },
    goReport() {
      this.$router.push({
        name: "myRepot",
        query: {
          url: this.userinfo.report,
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.user {
  padding: 15px;
  background: #f8f8f8;
  color: #585858;
  .box1 {
    margin-bottom: 30px;
    font-size: 16px;
    img {
      margin-right: 10px;
    }
    &-user {
      height: 83px;
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      font-size: 16px;
      color: #585858;
    }
  }
  .box2 {
    width: 344px;
    height: 401px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px #e3e3e3;
    border-radius: 8px 8px 0px 0px;
    &-top {
      padding: 25px 10px;
      &__item {
        width: 146px;
        height: 107px;
        background: #2581de;
        border-radius: 8px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .num {
          font-size: 30px;
        }
      }
    }
  }
  .list {
    padding: 0 25px;
    li {
      height: 45px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #cdcdcd;
      font-size: 16px;
      color: #222222;
      img {
        width: 25px;
        margin-right: 11px;
      }
    }
  }
}
</style>