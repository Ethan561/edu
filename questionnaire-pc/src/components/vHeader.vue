<template>
  <div class="head flex-between">
    <div
      @click="$router.go(-1)"
      class="left"
    >
      <van-icon
        name="arrow-left"
      />
    </div>
    <div class="title">{{$route.meta.title||$route.query.title}}</div>
    <div class="right">
      <img
        v-if="is_save"
        @click="save"
        class="save"
        src="@/assets/save.png"
        alt=""
      >
      <!-- <img
        v-if="isUser"
        class="save"
        @click="logOut"
        src="@/assets/logout.png"
        alt=""
      > -->
    </div>
  </div>
</template>
<script>
import { Session } from "@/utils/common.js";
import { apiTokenKey } from "@/config";
import { HTTP_Logout } from "@/http/interface";
export default {
  props:{
    is_save:{
      type:Boolean,
      default:true
    }
  },
  data: function () {
    return {};
  },
  // computed: {
  //   isUser: function () {
  //     if (this.$route.name == "user") {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  // },
  mounted() {
    console.log();
  },
  methods: {
    logOut() {
      HTTP_Logout().then((res) => {
        this.$dialog
          .confirm({
            title: "退出登录",
            message: "确定退出登录吗？",
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
        Session.remove(apiTokenKey);
        this.$$route.replace("/");
      });
    },
    save(){
      this.$emit('saveQes') 
    }
  },
};
</script>

<style lang='scss' scoped>
.head {
  height: 50px;
  font-size: 18px;
  color: #fff;
  padding: 0 15px;
  background: linear-gradient(140deg, #42b0ff 0%, #0d5bc3 100%);
  .left {
    width: 80px;
    font-size: 20px;
  }
  .right {
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .save {
      width: 30px;
    }
  }
}
</style>