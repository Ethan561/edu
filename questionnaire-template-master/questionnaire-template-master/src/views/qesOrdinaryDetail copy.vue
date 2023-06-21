<template>
  <div ref="Box" @scroll="divScroll">
    <van-sticky>
      <v-header :is_save="$route.query.status == 1" @saveQes="save(0)"></v-header>
    </van-sticky>
    <div class="desBox">
      <div class="desTitle">{{desData.title}}</div>
      <div class="desConent" v-html="desData.des"></div>
    </div>
    <van-sticky>
      <van-steps @click-step="stepJump" :active="active">
        <van-step v-for="a,i in stepList" :key="i">{{a.group}}</van-step>
      </van-steps>
    </van-sticky>
    <div class="qesList">
      <div v-for="(a, i) in list" :key="a.id" class="qesItem">
        <div v-if="a.explain" class="explain" v-html="a.explain"></div>
        <!-- type  1单选，2判断，3多选，4填空,5简答,6文件（1图片，2视频，3音频）,7排序题，8矩阵量表，9NPS量表，10下拉,11矩阵选择,12矩阵填空,13自增填空,14量表题,15星级打分 -->
        <div class="quesItem">
          <p class="quesTitle">{{ i + 1 }}、{{ a.title }}</p>
          <!-- 1单选 -->
          <van-radio-group
            v-if="a.type == 1"
            v-model="a.single_choice.answer"
            :direction="a.arrange == 1 ? 'horizontal' : 'vertical'"
            :disabled="qesStatus == 2"
          >
            <van-radio
              v-for="(b, j) in a.single_choice.titles"
              :key="j"
              :name="j + 1"
              checked-color="#0065E0"
            >{{ b }}</van-radio>
          </van-radio-group>

          <!-- 2判断 -->
          <van-radio-group
            :disabled="qesStatus == 2"
            :direction="a.arrange == 1 ? 'horizontal' : 'vertical'"
            v-if="a.type == 2"
            v-model="a.judge.answer"
          >
            <van-radio
              v-for="(b, j) in a.judge.titles"
              :key="j"
              :name="j + 1"
              checked-color="#0065E0"
            >{{ b }}</van-radio>
          </van-radio-group>
          <!-- 3多选 -->
          <van-checkbox-group
            :disabled="qesStatus == 2"
            v-if="a.type == 3"
            v-model="a.multiple_choice.answer"
            :direction="a.arrange == 1 ? 'horizontal' : 'vertical'"
          >
            <van-checkbox
              v-for="(b, j) in a.multiple_choice.titles"
              shape="square"
              :key="j"
              :name="j + 1"
            >{{ b }}</van-checkbox>
          </van-checkbox-group>

          <!-- 4填空 -->
          <div v-if="a.type == 4" v-html="a.blanks.h5content"></div>
          <!--5 简答 -->
          <van-field
            v-if="a.type == 5"
            v-model="a.qa"
            rows="6"
            :disabled="qesStatus == 2"
            type="textarea"
            :placeholder="a.notice"
            :maxlength="a.num"
            show-word-limit
          />
          <!-- 6文件上传 1图片，2视频，3音频 -->
          <!-- <div v-if="a.type==6">请下载app答题</div> -->
          <!-- :max-count="a.files.length" -->
          <div class="upload" v-if="a.type == 6">
            <div v-if="a.type==6">请下载app答题</div>
          </div>
          <!-- 7排序题 -->
          <div v-if="a.type == 7" class="sorts">
            <div v-for="(b, j) in a.sorts" :key="b.id" class="sorts-item">
              <p class="sorts-item__title">{{ b.title }}</p>
              <div class="sorts-btn" @click="sort(a.sorts, j)">
                <van-tag v-if="j > 0" type="primary" size="large">上移</van-tag>
                <van-tag v-if="j == 0" type="danger" size="large">下移</van-tag>
              </div>
            </div>
          </div>
          <!-- 8矩阵量表 -->
          <ul v-if="a.type == 8" class="scales">
            <li v-for="b, n in a.scales.rows" :key="b.id" class="scales-item flex-start">
              <p class="scales-item__title">{{ b }}</p>
              <!-- <van-rate color="#0065E0" :disabled="qesStatus == 2" :count="b.maxScore" v-model="b.score" /> -->
              <van-radio-group
                v-model="a.scales.answer[n]"
                direction="horizontal"
                :disabled="qesStatus == 2"
              >
                <van-radio
                  v-for="(c, j) in a.scales.cols"
                  :key="j"
                  :name="j + 1"
                  checked-color="#0065E0"
                >{{ c }}</van-radio>
              </van-radio-group>
            </li>
          </ul>

          <!-- 9NPS量表 -->
          <div class="nps" v-if="a.type == 9">
            <div style="margin-bottom:10px" class="flex-between">
              <p>{{ a.nps.header }}</p>
              <p>{{ a.nps.footer }}</p>
            </div>
            <ul class="flex-start">
              <li
                :style="{ background: b <= a.nps.answer ? qesStatus != 2 ? '#0065E0' : '#aaa' : '#fff' }"
                v-for="b in +Math.abs(a.nps.maxScore)"
                :key="b"
                @click="selectedNps(a, b)"
              ></li>
            </ul>
          </div>
          <!-- 10 下拉测试 -->
          <div v-if="a.type == 10">
            <select
              @change="seletedChoice(a)"
              :disabled="qesStatus == 2"
              v-model="a.pull_choice.answer"
              class="pull_choice"
            >
              <option v-for="(b, j) in a.pull_choice.titles" :key="j" :value="j + 1">{{ b }}</option>
            </select>
          </div>
          <!-- 11 矩阵选择 -->
          <div v-if="a.type == 11">
            <div class="juzhenxuanze">
              <table>
                <tr>
                  <td></td>
                  <td v-for="(b, j) in a.ju_choice.cols" :key="j">{{ b }}</td>
                </tr>
                <tr v-for="(b, j) in a.ju_choice.rows" :key="j">
                  <td>{{ b }}</td>
                  <td v-for="(c, n) in a.ju_choice.answer[j]" :key="n">
                    <input
                      :disabled="qesStatus == 2"
                      type="checkbox"
                      :checked="!!c"
                      @change="checkJzxe(a.ju_choice.answer[j], n)"
                    />
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <!-- 12 矩阵填空 -->
          <ul v-if="a.type == 12" class="scales">
            <li v-for="(b, j) in a.scale_fill" :key="j" class="scales-item flex-start">
              <p class="scales-item__title">{{ b.title }}</p>
              <input
                style="width:50%"
                class="juzhentk"
                :disabled="qesStatus == 2"
                v-model="b.answer"
                type="text"
              />
            </li>
          </ul>
          <!-- 13 自增表格 -->
          <div class="addTable" v-if="a.type == 13">
            <table>
              <tr>
                <td v-for="(b, j) in a.auto_grow.titles" :key="j">{{ b }}</td>
              </tr>
              <tr v-for="(q, w) in a.auto_grow.answers" :key="w">
                <td v-for="(b, j) in a.auto_grow.answers[w]" :key="j">
                  <input
                    type="text"
                    :disabled="qesStatus == 2"
                    :data-i="i"
                    :data-row="w"
                    :data-col="j"
                    :value="b"
                    @blur="zzbg($event)"
                  />
                </td>
              </tr>
            </table>
            <div v-if="qesStatus != 2" class="btns">
              <van-button type="info" icon="plus" @click="addRow(a.auto_grow)">添加行</van-button>
              <van-button type="info" icon="minus" @click="deleteRow(a.auto_grow)">删除行</van-button>
            </div>
          </div>
          <!-- 14 量表题 -->
          <div v-if="a.type == 14">
            <div class="type14 flex-start">
              <p>{{ a.scale_score.header }}</p>
              <van-radio-group
                style="margin:0 20px"
                :disabled="qesStatus == 2"
                v-model="a.scale_score.answer"
              >
                <van-radio v-for="j in +a.scale_score.maxScore" :key="j" :name="j">{{ j }}</van-radio>
              </van-radio-group>
              <p>{{ a.scale_score.footer }}</p>
            </div>
          </div>
          <!-- 15 星级打分 -->
          <div v-if="a.type == 15">
            <div class="flex-start">
              <p>{{ a.star_score.header }}</p>
              <van-rate
                style="margin:0 20px"
                color="#0065E0"
                :disabled="qesStatus == 2"
                :count="+a.star_score.maxScore"
                v-model="a.star_score.answer"
              />
              <p>{{ a.star_score.footer }}</p>
            </div>
          </div>
          <!-- 16 看图答题 -->
          <div v-if="a.type == 16">
            <img style="margin:0 auto 15px" :src="a.image_qa.img_url" alt />
            <van-field
              v-model="a.image_qa.answer"
              rows="6"
              :disabled="qesStatus == 2"
              type="textarea"
              placeholder="请输入答案"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="qesStatus != 2" class="quesFooter">
      <van-button @click="save(1)" color="#176095" type="info">提交</van-button>
    </div>
    <!-- 答题成功 -->
    <van-dialog
      v-model="show"
      title="提交成功"
      show-cancel-button
      @confirm="confirmDia"
      confirmButtonText="继续答题"
    >
      <img class="logo" src="~assets/logo.png" />
    </van-dialog>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import { HTTP_Accurate, HTTP_AccurateSave } from "@/http/interface";
export default {
  data() {
    return {
      active: 0,
      qesStatus: this.$route.query.status,
      list: [],
      desData: {},
      stepList: [],
      show: false,
      timer: null,
    };
  },
  components: {
    vHeader,
  },
  mounted() {
    this.getData();
    this.timer = setInterval(() => {
      this.save(0);
    }, 60000);
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
  watch: {
    list: {
      handler: function (val) {
        this.save(0);
      },
      deep: true,
    },
  },
  methods: {
    divScroll(e) {
      let toTop = this.$refs.Box.scrollTop;
      let step = document.querySelectorAll(".explain");
      //楼层导航图标点亮控制
      step.forEach((floor, index) => {
        //检查各楼层顶端距离视窗顶端距离，如果满足条件则修改楼层图标
        if (floor.offsetTop - 100 <= toTop) {
          this.active = index;
        }
      });
    },
    /* 获取题型 */
    getData() {
      HTTP_Accurate(this.$route.query.qid).then((res) => {
        // let res = mockjs;
        let list = res.data.list;
        list.forEach((item, index) => {
          /* 4  填空 */
          if (item.type == 4) {
            let arr = item.blanks.answer.split("&");
            if (arr.length && arr.some((o) => o != "")) {
              let abc = "";
              abc = item.blanks.content;
              let disabled = this.qesStatus == 1 ? "" : "disabled";
              arr.forEach((ele, elei) => {
                abc = abc.replace(
                  /<fill>/,
                  `<input class="fill tk_${index}" ${disabled} value="${ele}" type="text">`
                );
              });
              item.blanks.h5content = abc;
            } else {
              item.blanks.answer = "";
              item.blanks.h5content = item.blanks.content.replace(
                /<fill>/gi,
                `<input class="fill tk_${index}" type="text">`
              );
            }
          }
          /* 8  矩阵打分 */
          if (item.type == 8) {
            if (!item.scales.answer.length) {
              item.scales.rows.forEach((o) => {
                item.scales.answer.push(0);
              });
            }
          }
          /*11  矩阵选择 */
          if (item.type == 11) {
            if (!item.ju_choice.answer.length) {
              item.ju_choice.answer = [];
              item.ju_choice.rows.forEach((o, m) => {
                item.ju_choice.answer.push([]);
                item.ju_choice.cols.forEach((n, k) => {
                  item.ju_choice.answer[m].push(0);
                });
              });
            }
          }
          /*13  自增表格 */
          if (item.type == 13) {
            if (item.auto_grow.answers && !item.auto_grow.answers.length) {
              item.auto_grow.answers = [];
              let arr = [];
              item.auto_grow.titles.forEach((o, m) => {
                arr.push("");
              });
              item.auto_grow.answers.push(arr);
            }
          }
        });
        this.list = list;
        this.stepList = list.filter((o) => o.group);
        this.stepList.push({
          group: "成功",
        });
        this.desData = res.data.data;
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
    /* 步骤条 */
    stepJump(index) {
      let step = document.querySelectorAll(".explain");
      let dom = step[index];
      if (dom) {
        this.$refs.Box.scrollTop = dom.offsetTop - 60;
        // dom.scrollIntoView({
        //   behavior:"smooth"
        // })
      }
    },
    /* 排序 */
    sort(list, i) {
      if (this.qesStatus == 2) {
        return false;
      }
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
    /* nps选择 */
    selectedNps(a, b) {
      if (this.qesStatus == 2) {
        return false;
      }
      a.nps.answer = b;
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
      this.list[i].auto_grow.answers[row][col] = e.target.value;
      this.$forceUpdate();
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
    save(action) {
      let write = JSON.stringify(this.list);
      HTTP_AccurateSave(this.$route.query.qid, write, action).then((res) => {
        if (action == 1) {
          this.active = this.stepList.length - 1;
          this.show = true;
        }
      });
    },
    /* 继续答题 */
    confirmDia() {
      this.show = false;
      this.$router.replace("/home");
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  margin: 20px auto;
}
.desBox {
  background: #fff;
  padding: 20px;
  .desTitle {
    margin-bottom: 10px;
    text-align: center;
    position: relative;
    font-weight: bold;
    font-size: 18px;
    .dtk {
      position: absolute;
      top: 0;
      right: 10px;
    }
  }
}
.quesTitle {
  margin-bottom: 20px;
  line-height: 1.2;
}

.qesList {
  padding: 10px;
  .explain {
    padding: 20px;
    background: #fff;
    margin-bottom: 10px;
    border: 1px solid #0065e0;
  }
}

.quesItem {
  padding: 20px;
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
  input {
    width: 20px;
    height: 20px;
  }
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
    &__title {
      line-height: 1.2;
      margin-right: 20px;
    }
  }
  &-btn {
    flex-shrink: 0;
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
  padding-top: 10px;

  &-item {
    margin-bottom: 10px;

    &__title {
      margin-bottom: 10px;
      margin-right: 15px;
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
    .van-button {
      margin-right: 30px;
    }
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
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
}

.files {
  &-item {
    position: relative;
    margin-right: 15px;
  }

  /deep/ .van-image {
    margin-right: 15px;
  }
}

.van-icon-cross {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
  font-size: 20px;
}
</style>
