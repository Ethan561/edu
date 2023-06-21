<template>
  <div class="item">
    <!-- type  1单选，2判断，3多选，4填空,5简答,6文件（1图片，2视频，3音频）,7排序题，8矩阵量表，9NPS量表，10下拉,11矩阵选择,12矩阵填空,13自增填空,14量表题,15星级打分 -->
    <div class="quesItem">
      <p class="quesTitle">{{idx+1}}、{{obj.title}}</p>
      <!-- 1单选 -->
      <van-radio-group v-model="obj.answer">
        <van-radio
          v-for="(a,i) in obj.single_choice.titles"
          :key="i"
          :name="i+1"
          checked-color="#0065E0"
        >{{a}}</van-radio>
      </van-radio-group>
    </div>
    <div class="quesFooter">
      <van-button
        type="primary"
        color="#176095"
        @click="prevQes"
      >上一题</van-button>
      <van-button
        type="primary"
        color="#176095"
        @click="nextQes"
      >下一题</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    idx: {
      type: String | Number,
      default: 0,
    },
  },
  methods: {
    prevQes() {
      this.$emit("prevQes");
    },
    nextQes() {
      this.$emit("nextQes");
    },
  },
};
</script>

<style lang="scss" scoped>
.quesTitle {
  margin-bottom: 20px;
  line-height: 1.2;
}
.item {
  margin: 10px;
}
.quesItem {
  padding: 20px;
  height: 350px;
  background: #fff;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
}
</style>