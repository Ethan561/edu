<!-- 登录 -->
<template>
  <div class="login">
    <div class="des">
      <p class="p1">2023年普通中小学</p>
      <p class="p2">活力评价项目</p>
    </div>
    <div class="login-from">
      <div class="login-from__item">
        <van-field
          v-model="username"
          name="学号"
          label="学号"
          placeholder="请输入您的学号"
          :left-icon="require('../assets/user.png')"
          :rules="[{ required: true, message: '请输入您的学号' }]"
        />
      </div>
      <div class="login-from__item">
        <van-field
          v-model="password"
          name="姓名"
          label="姓名"
          placeholder="请输入您的姓名"
          :left-icon="require('../assets/paw.png')"
          :rules="[{ required: true, message: '请输入您的姓名' }]"
        />
      </div>

      <div class="login-from__item code">
        <van-field
          v-model="code"
          name="验证码"
          label="验证码"
          placeholder="输入验证码"
          :left-icon="require('../assets/code.png')"
          :rules="[{ required: true, message: '输入验证码' }]"
        />
        <img :src="codeImg" @click="getCpt" class="code" alt />
      </div>
      <div style="margin: 16px;">
        <van-button block type="info" @click="cptCheck">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { generateUUID, Session } from "@/utils/common.js";
import { baseCptUrl, apiTokenKey } from "@/config";
import { HTTP_CptCheck, HTTP_UserLogin } from "@/http/interface";
export default {
  data() {
    return {
      username: "",
      password: "",
      code: "",
      codeImg: "",
      device_uuid: generateUUID(),
    };
  },
  mounted() {
    this.getCpt();
  },
  methods: {
    login() {
      let { username, password, code, device_uuid } = this;
      HTTP_UserLogin(username, password, code, device_uuid).then(({ data }) => {
        Session.set(apiTokenKey, data);
        this.$router.push({ path: "/home" });
      });
    },
    getCpt() {
      let url = `/api/cpt/show?p=a&device_uuid=${
        this.device_uuid
      }&randmod=${Math.random()}`;
      this.codeImg = url;
    },
    cptCheck() {
      let { code, device_uuid } = this;
      HTTP_CptCheck(device_uuid, code).then((res) => {
        this.login();
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.login {
  height: 100vh;
  background: #fff url(~assets/banner.jpg) no-repeat left top;
  background-size: 100%;
  position: relative;
  .des {
    font-size: 22px;
    color: #fff;
    position: absolute;
    left: 10%;
    top: 10%;
    line-height: 1.5;
  }
}
.login-from {
  width: 80%;
  position: absolute;
  left: 10%;
  top: 40%;
  // background: rgba(0, 0, 0, 0.5);
  &__item {
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #eee;
  }
  .code {
    img {
      width: 100px;
    }
  }
}
</style>