<!-- 首页 -->
<template>
  <div class="home">
    <van-sticky>
      <v-header :is_save="false"></v-header>
    </van-sticky>
    <ul>
      <li v-for="a in quesList" :key="a.qid" @click="go(a)">
        <div
          :style="{'background-image':a.status==1?'url('+require('@/assets/status2.png')+')':'url('+require('@/assets/status1.png')+')'}"
          class="status"
        >
          <small>{{statusObj[a.status]}}</small>
        </div>
        <p class="title">{{a.title}}</p>
        <p class="time">{{a.start}}</p>
        <van-button
          :disabled="a.status==3||a.status==0"
          :color="a.status==0?'#aaa':''"
          class="btn"
          type="info"
          size="small"
        >{{statusTxt[a.status]}}</van-button>
      </li>
    </ul>
    <!-- 未到开始时间 -->
    <van-overlay :duration="0.2" :show="isShow">
      <div class="wrapper">
        <div class="block">
          <p class="p0 flex-center">
            <img class="tipimg" src="~assets/tip.png" alt srcset /> 提示
          </p>
          <p class="p3">当前问卷未到开始答题时间,请到答题时间再作答！</p>
          <div class="flex-center">
            <van-button
              @click="isShow = false"
              style="width:150px;"
              color="#176095"
              type="info"
            >确认</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import { HTTP_Index } from "@/http/interface";
export default {
  data() {
    return {
      isShow:false,
      quesList: [],
      statusObj:{
        0:'未开始',
        1:'进行中',
        2:'已完成',
        3:'已超时'
      },
      statusTxt:{
        0:'未开始',
        1:'去答题',
        2:'去查看',
        3:'已超时'
      }
    };
  },
  components: {
    vHeader,
  },
  mounted() {
    this.getHomeData();
  },
  methods: {
    getHomeData() {
      HTTP_Index().then(({ data }) => {
        this.quesList = data;
      });
    },
    go(a) {
      /* logic 问卷是否有逻辑1有，0没有做单页 */
      // if (a.status == 0) {
      //   this.isShow = true;
      // }
      if (a.status == 1) {
        this.$router.push({
          name: a.logic == 1 ? "qesDetail" : "qesOrdinaryDetail",
          query: {
            qid: a.qid,
            status: 1,
            title: a.title,
          },
        });
      } else if (a.status == 2) {
        this.$router.push({
          name: a.logic == 1 ? "qesDetail" : "qesOrdinaryDetail",
          query: {
            qid: a.qid,
            status: 2,
            title: a.title,
          },
        });
      } else if (a.status == 3) {
        this.$toast("超时未完成");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/style/var.scss";
.home {
  ul {
    padding: 10px;
    li {
      margin-bottom: 15px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
      padding: 20px;
      position: relative;
      .status {
        border-radius: 0 4px 0 0;
        position: absolute;
        right: 0;
        top: 0;
        color: #fff;
        width: 0;
        height: 0;
        width: 84px;
        height: 40px;
        text-align: end;
        padding: 4px 6px;
        background-repeat: no-repeat;
        background-size: center/100% 100%;
        small {
          white-space: nowrap;
        }
      }
      .title {
        font-size: 18px;
        margin-bottom: 10px;
        color: #222222;
      }
      .time {
        font-size: 14px;
        color: #494949;
        margin-bottom: 15px;
      }
      .btn {
        width: 120px;
        height: 40px;
        font-size: 16px;
        color: #fff;
        border-radius: 4px;
        display: block;
        margin: 0 auto;
      }
    }
  }
}
</style>