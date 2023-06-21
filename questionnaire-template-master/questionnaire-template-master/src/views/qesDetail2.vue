<template>
  <div>
    <van-sticky>
      <v-header :is_save="!is_save==2"></v-header>
    </van-sticky>
    <van-swipe
      class="my-swipe"
      ref="qesSwipe"
      :touchable="false"
      initial-swipe="0"
      :loop="false"
      :show-indicators="false"
    >
      <van-swipe-item
        v-for="(a,i) in list"
        :key="a.id"
      >
        <div class="item">
          <!-- type  1单选，2判断，3多选，4填空,5简答,6文件（1图片，2视频，3音频）,7排序题，8矩阵量表，9NPS量表，10下拉,11矩阵选择,12矩阵填空,13自增填空,14量表题,15星级打分 -->
          <div class="quesItem">
            <p class="quesTitle">{{i+1}}、{{a.title}}</p>
            <!-- 1单选 -->
            <van-radio-group
              v-if="a.type==1"
              v-model="a.single_choice.answer"
            >
              <van-radio
                v-for="(b,j) in a.single_choice.titles"
                :key="j"
                :name="j+1"
                checked-color="#0065E0"
              >{{b}}</van-radio>
            </van-radio-group>

            <!-- 2判断 -->
            <van-radio-group
              v-if="a.type==2"
              v-model="a.judge.answer"
            >
              <van-radio
                v-for="(b,j) in a.judge.titles"
                :key="j"
                :name="j+1"
                checked-color="#0065E0"
              >{{b}}</van-radio>
            </van-radio-group>
            <!-- 3多选 -->
            <van-checkbox-group
              v-if="a.type==3"
              v-model="a.multiple_choice.answer"
            >
              <van-checkbox
                v-for="(b,j) in a.multiple_choice.titles"
                shape="square"
                :key="j"
                :name="j+1"
              >{{b}}</van-checkbox>
            </van-checkbox-group>

            <!-- 4填空 -->
            <div
              v-if="a.type==4"
              v-html="a.blanks.content"
            >
            </div>
            <!--5 简答 -->
            <van-field
              v-if="a.type==5"
              v-model="a.qa"
              rows="6"
              type="textarea"
              placeholder="请输入..."
            />
            <!-- 6文件上传 -->
            <div v-if="a.type==6">请下载app答题</div>
            <!-- 7排序题 -->
            <div
              v-if="a.type==7"
              class="sorts"
            >
              <div
                v-for="(b,j) in a.sorts"
                :key="b.id"
                class="sorts-item flex-between"
              >
                <p class="sorts-item__title">{{b.title}}</p>
                <div @click="sort(a.sorts,j)"> <span v-if="j>0">↑</span> <span v-if="j==0">↓</span> </div>
              </div>
            </div>
            <!-- 8矩阵量表 -->
            <ul
              v-if="a.type==8"
              class="scales"
            >
              <li
                v-for="(b,i) in a.scales"
                :key="i"
                class="scales-item"
              >
                <p class="scales-item__title">{{b.title}}</p>
                <van-rate
                  :count="b.maxScore"
                  v-model="b.score"
                />
              </li>
            </ul>

            <!-- 9NPS量表 -->
            <div v-if="a.type==9">
              <div class="flex-between">
                <p>{{a.nps.header}}</p>
                <p>{{a.nps.footer}}</p>
              </div>
              <ul class="flex-start nps">
                <li
                  :style="{background: b<=a.nps.answer?'#0065E0':'#fff'}"
                  v-for="b in +a.nps.maxScore"
                  :key="b"
                  @click="a.nps.answer=b"
                ></li>
              </ul>
            </div>
            <!-- 10 下拉测试 -->
            <div v-if="a.type==10">
              <select
                @change="seletedChoice(a)"
                v-model="a.pull_choice.answer"
                class="pull_choice"
              >
                <option
                  v-for="(b,j) in a.pull_choice.titles"
                  :key="j"
                  :value="j+1"
                >{{b}}</option>
              </select>
            </div>
            <!-- 11 矩阵选择 -->
            <div v-if="a.type==11">
              <div class="juzhenxuanze">
                <table>
                  <tr>
                    <td></td>
                    <td
                      v-for="(b,j) in a.ju_choice.rows"
                      :key="j"
                    >{{b}}</td>
                  </tr>
                  <tr
                    v-for="(b,j) in a.ju_choice.cols"
                    :key="j"
                  >
                    <td>{{b}}</td>
                    <td
                      v-for="(c,n) in a.ju_choice.answers[j]"
                      :key="n"
                    >
                      <input
                        type="checkbox"
                        @change="checkJzxe(a.ju_choice.answers[j],n)"
                      >
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <!-- 12 矩阵填空 -->
            <ul
              v-if="a.type==12"
              class="scales"
            >
              <li
                v-for="(b,j) in a.scale_fill"
                :key="j"
                class="scales-item flex-between"
              >
                <p class="scales-item__title">{{b.title}}</p>
                <input
                  style="width:50%"
                  class="juzhentk"
                  v-model="b.answer"
                  type="text"
                >
              </li>
            </ul>
            <!-- 13 自增表格 -->
            <div
              class="addTable"
              v-if="a.type==13"
            >
              <table>
                <tr>
                  <td
                    v-for="(b,j) in a.auto_grow.titles"
                    :key="j"
                  >{{b}}</td>
                </tr>
                <tr
                  v-for="(q,w) in a.auto_grow.answers"
                  :key="w"
                >
                  <td
                    v-for="(b,j) in a.auto_grow.answers[w]"
                    :key="j"
                  >
                    <input
                      type="text"
                      :data-i="i"
                      :data-row="w"
                      :data-col="j"
                      @input="zzbg($event)"
                    >
                  </td>
                </tr>
              </table>
              <div class="btns">
                <van-button
                  type="info"
                  icon="plus"
                  @click="addRow(a.auto_grow)"
                >添加行</van-button>
                <van-button
                  type="info"
                  icon="minus"
                  @click="deleteRow(a.auto_grow)"
                >删除行</van-button>
              </div>
            </div>
            <!-- 14 量表题 -->
            <div v-if="a.type==14">
              <div class="type14 flex-between">
                <p>{{a.scale_score.header}}</p>
                <van-radio-group v-model="a.scale_score.answer">
                  <van-radio
                    v-for="j in +a.scale_score.maxScore"
                    :key="j"
                    :name="j"
                  >{{j}}</van-radio>
                </van-radio-group>
                <p>{{a.scale_score.footer}}</p>
              </div>
            </div>
            <!-- 15 星级打分 -->
            <div v-if="a.type==15">
              <div class="flex-between">
                <p>{{a.star_score.header}}</p>
                <van-rate
                  color="#0065E0"
                  :count="+a.star_score.maxScore"
                  v-model="a.star_score.answer"
                />
                <p>{{a.star_score.footer}}</p>
              </div>
            </div>
          </div>
          <div class="quesFooter">
            <van-button
              type="primary"
              color="#176095"
              @click="prevQes(a,i)"
            >上一题</van-button>
            <van-button
              type="primary"
              v-if="i<list.length-1"
              color="#176095"
              @click="nextQes(a,i)"
            >下一题</van-button>
            <van-button
              v-if="i==list.length-1"
              @click="save"
              color="#176095"
              type="info"
            >提交</van-button>
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import { HTTP_Accurate, HTTP_AccurateSave } from "@/http/interface";
export default {
  data() {
    return {
      list: [],
      data: {},
      is_save: this.$route.query.status
    };
  },
  components: {
    vHeader,
  },
  mounted() {
    this.getData();
  },
  methods: {
    /* 获取题型 */
    getData() {
      HTTP_Accurate(this.$route.query.qid).then((res) => {
        let list = res.data.list;
        list.forEach((item, index) => {
          /* 4  填空 */
          if (item.type == 4) {
            item.blanks.content = item.blanks.content.replace(
              /<fill>/gi,
              `<input class="fill tk_${index}" type="text">`
            );
          }
          /* 8  矩阵量表 */
          if (item.type == 8) {
            item.scales.forEach((o) => {
              o.score = +o.score;
            });
          }
          /*11  矩阵选择 */
          if (item.type == 11) {
            item.ju_choice.answers = [];
            item.ju_choice.cols.forEach((o, m) => {
              item.ju_choice.answers.push([]);
              item.ju_choice.rows.forEach((n, k) => {
                item.ju_choice.answers[m].push(0);
              });
            });
          }
          /*13  自增表格 */
          if (item.type == 13) {
            let arr = [];
            item.auto_grow.titles.forEach((o, m) => {
              arr.push("");
            });
            item.auto_grow.answers.push(arr);
          }
          if (item.cate > 1) {
            if (item.wu) {
              let targetItem = list.find((o) => o.id == item.wu);
              targetItem.prevQes = item.id;
            }
          }
          if (item.sid) {
            let targetItem = list.find((o) => o.id == item.sid);
            targetItem.prevQes = item.id;
          }
        });
        this.list = list;
        this.data = res.data.data;
      });
    },
    /* 下拉测试 */
    seletedChoice(a) {
      let i = a.pull_choice.answer;
      if (a.you) {
        let youId = a.you[i - 1];
        if (youId) {
          let i = this.list.findIndex((o) => o.id == youId);
          this.$refs.qesSwipe.swipeTo(i);
        }
      }
    },
    /* 上一题 */
    prevQes(a, i) {
      if (a.prevQes) {
        let i = this.list.findIndex((o) => o.id == a.prevQes);
        this.$refs.qesSwipe.swipeTo(i);
      } else {
        this.$refs.qesSwipe.prev();
      }
    },
    /* 下一题 */
    nextQes(a, i) {
      /* 1 单选 */
      if (a.type == 1 && a.must == 1) {
        if (!a.single_choice.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 2 判断 */
      if (a.type == 2 && a.must == 1) {
        if (!a.judge.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 3 多选 */
      if (a.type == 3 && a.must == 1) {
        if (!a.multiple_choice.answer.length) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 4 填空题 */
      if (a.type == 4 && a.must == 1) {
        let arr = [];
        let arr_tk = document.querySelectorAll(".tk_" + i);
        arr_tk.forEach((o) => {
          arr.push(o.value);
        });
        a.blanks.answer = arr.join("&");
        if (!a.blanks.answer) {
          this.$toast("此题为必填类型，请完成答题");
        }
      }
      /* 5 简答 */
      if (a.type == 5 && a.must == 1) {
        if (!a.qa) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 9 NPS量表 */
      if (a.type == 9 && a.must == 1) {
        if (!a.nps.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 10 下拉 */
      if (a.type == 10 && a.must == 1) {
        if (!a.pull_choice.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 11 矩阵选择 */
      if (a.type == 11 && a.must == 1) {
        let arr = a.ju_choice.answer;
        for (let s = 0; s < arr.length; s++) {
          if (!arr[s].some((o) => o > 0)) {
            this.$toast("此题为必填类型，请完成答题");
            return false;
          }
        }
      }
      /* 12 矩阵填空 */
      if (a.type == 12 && a.must == 1) {
        let arr = a.scale_fill;
        if (!arr.some((o) => !!o.answer)) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 13 自增填空 */
      if (a.type == 13 && a.must == 1) {
        let arr = a.auto_grow.answers;
        for (let d = 0; d < arr.length; d++) {
          if (!arr[d].some((o) => !!o.answer)) {
            this.$toast("此题为必填类型，请完成答题");
            return false;
          }
        }
      }
      /* 14 量表题 */
      if (a.type == 14 && a.must == 1) {
        if (!a.scale_score.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      /* 15 星级打分 */
      if (a.type == 15 && a.must == 1) {
        if (!a.star_score.answer) {
          this.$toast("此题为必填类型，请完成答题");
          return false;
        }
      }
      if (a.wu) {
        let n = this.list.findIndex((o) => o.id == a.wu);
        this.$refs.qesSwipe.swipeTo(n);
      } else if (a.wu === 0) {
        this.$refs.qesSwipe.swipeTo(this.list.length - 1);
      } else if (a.you && a.you.length) {
        let targetItem = {};
        if (a.type == 1) {
          targetItem = this.list.find(
            (o) => o.id == a.you[a.single_choice.answer - 1]
          );
          targetItem.prevQes = a.id;
        }
        let k = this.list.findIndex((o) => o.id == targetItem.id);
        this.$refs.qesSwipe.swipeTo(k);
      } else {
        this.$refs.qesSwipe.next();
      }
    },
    /* 排序 */
    sort(list, i) {
      if (i == 0) {
        let cup = "";
        cup = list[i];
        list[i] = list[i + 1];
        list[i + 1] = cup;
      } else {
        let cup = "";
        cup = list[i];
        list[i] = list[i - 1];
        list[i - 1] = cup;
      }
      this.$forceUpdate();
    },
    /* 矩阵选择 */
    checkJzxe(a, n) {
      if (a[n] == 0) {
        a[n] = 1;
      } else {
        a[n] = 0;
      }
      this.$forceUpdate();
    },
    /* 自增填空输入 */
    zzbg(e) {
      let { i, col, row } = e.target.dataset;
      this.list[i].auto_grow.answers[row][col] = e.data;
    },
    /* 添加行 */
    addRow(a) {
      let arr = [];
      a.titles.forEach((o) => {
        arr.push("");
      });
      a.answers.push(arr);
    },
    /* 删除行 */
    deleteRow(a, w) {
      a.answers.pop();
    },
    /* 提交 */
    save() {
      let write = JSON.stringify(this.list);
      HTTP_AccurateSave(this.$route.query.qid, write).then((res) => {
        console.log(res);
        this.$dialog.alert({
          title: "提交成功",
          message: "问卷已经提交成功，返回列表重新答题！",
        }).then(() => {
          this.$router.replace("/home")
        });
      });
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
/deep/ .van-field__control {
  background-color: #e6e1e1;
  padding: 10px;
}
/deep/ .van-radio {
  margin-bottom: 10px;
}
/deep/ .van-field {
  padding: 0;
}
/* 矩阵选择 */
.juzhenxuanze {
  overflow: auto;
  td {
    width: 80px;
    height: 50px;
    font-size: 16px;
    text-align: center;
  }
}
.type14 {
  /deep/ .van-radio-group {
    display: flex;
    align-items: center;
    .van-radio {
      margin-bottom: 0;
      margin-right: 5px;
    }
  }
}
/* 排序 */
.sorts {
  &-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    &__ipt {
      width: 20px;
      height: 20px;
      border: 1px solid #333;
      margin-right: 10px;
      outline: none;
    }
  }
}
/* 填空 */
/deep/ .fill {
  border: none;
  border-bottom: 1px solid #333;
}
/* nps打分 */
.nps {
  width: 100%;
  flex-wrap: nowrap;
  margin-top: 10px;
  li {
    width: 100%;
    height: 20px;
    border: 1px solid #333;
  }
}
/* 矩阵量表 */
.scales {
  &-item {
    margin-bottom: 10px;
    &__title {
      margin-bottom: 10px;
    }
    select {
      width: 100px;
      height: 30px;
      border-radius: 4px;
      padding: 0 10px;
    }
    .juzhentk {
      width: 100%;
      height: 30px;
    }
  }
}
.addTable {
  td {
    width: 100px;
    text-align: center;
    height: 40px;
    input {
      width: 90px;
      height: 30px;
    }
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
/* 下拉测试 */
.pull_choice {
  width: 100%;
  height: 30px;
  padding: 0 10px;
  border-radius: 4px;
}
.quesFooter {
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>