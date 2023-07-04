<template>
  <div ref="Box">
    <div v-if="desBoxShow" class="desBox">
      <div v-if="desData.des" class="desConent" v-html="desData.des"></div>
      <div v-if="desData.des" class="flex-center">
        <van-button color="#176095" @click="desBoxShow = false" type="info"
          >开始答题</van-button
        >
      </div>
    </div>
    <van-sticky>
      <v-header
        :is_save="$route.query.status == 1"
        @saveQes="save(0)"
      ></v-header>
    </van-sticky>
    <van-sticky>
      <van-steps :active="active">
        <van-step v-for="(a, i) in list" :key="i"
          >第{{ arrNum[i] }}部分</van-step
        >
      </van-steps>
    </van-sticky>
    <van-swipe
      class="my-swipe"
      ref="qesSwipe"
      :touchable="false"
      initial-swipe="0"
      :loop="false"
      :show-indicators="false"
    >
      <van-swipe-item v-for="(b, j) in list" :key="j" class="qesList">
        <div v-for="(a, i) in b" :key="a.id" class="qesItem">
          <div v-if="a.explain" class="explain" v-html="a.explain"></div>
          <!-- type  1单选，2判断，3多选，4填空,5简答,6文件（1图片，2视频，3音频）,7排序题，8矩阵量表，9NPS量表，10下拉,11矩阵选择,12矩阵填空,13自增填空,14量表题,15星级打分 -->
          <div class="quesItem">
            <!-- <p class="quesTitle">{{ a.id }}、{{ a.title }}</p> -->
            <p v-if="a.type != 4" class="quesTitle">
              {{ a.id }}、{{ a.title }}
            </p>
            <p v-else class="quesTitle">{{ a.id }}、{{ a.blanks.content }}</p>

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
                >{{ b }}</van-radio
              >
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
                >{{ b }}</van-radio
              >
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
                >{{ b }}</van-checkbox
              >
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
            <div class="upload" v-if="a.type == 6">
              <div class="flex-start files">
                <div
                  class="files-item"
                  v-for="(item, index) in a.files"
                  :key="index"
                >
                  <van-icon
                    v-if="item.url"
                    @click="deleteItem(item, index)"
                    name="cross"
                  />
                  <van-image
                    v-if="item.url && item.type == 1"
                    width="100"
                    height="100"
                    :src="item.url"
                  />
                  <video
                    controls
                    v-if="item.url && item.type == 2"
                    :src="item.url"
                  ></video>
                  <audio
                    controls
                    v-if="item.url && item.type == 3"
                    :src="item.url"
                  ></audio>
                </div>
              </div>
              <van-uploader
                multiple
                :accept="
                  a.files[0].type == 1
                    ? 'image/*'
                    : a.files[0].type == 3
                    ? 'audio/*'
                    : 'video/*'
                "
                v-if="
                  !(
                    a.files.filter((o) => o.url != '').length >= a.files.length
                  ) && qesStatus != 2
                "
                :max-count="a.files.length"
                :after-read="afterRead(a)"
              >
                <van-button icon="plus" color="#176095" type="primary"
                  >上传文件</van-button
                >
              </van-uploader>
            </div>

            <!-- 7排序题 -->
            <div v-if="a.type == 7" class="sorts">
              <div v-for="(b, j) in a.sorts" :key="b.id" class="sorts-item">
                <p class="sorts-item__title">{{ b.title }}</p>
                <div @click="sort(a.sorts, j)">
                  <van-tag v-if="j > 0" type="primary" size="large"
                    >上移</van-tag
                  >
                  <van-tag v-if="j == 0" type="danger" size="large"
                    >下移</van-tag
                  >
                </div>
              </div>
            </div>
            <!-- 8矩阵量表 -->
            <ul v-if="a.type == 8" class="scales">
              <li
                v-for="(b, n) in a.scales.rows"
                :key="b.id"
                class="scales-item flex-start"
              >
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
                    >{{ c }}</van-radio
                  >
                </van-radio-group>
              </li>
            </ul>
            <!-- 9NPS量表 -->
            <div class="nps" v-if="a.type == 9">
              <div style="margin-bottom: 10px" class="flex-between">
                <p>{{ a.nps.header }}</p>
                <p>{{ a.nps.footer }}</p>
              </div>
              <ul class="flex-start">
                <li
                  :style="{
                    background:
                      b <= a.nps.answer
                        ? qesStatus != 2
                          ? '#0065E0'
                          : '#aaa'
                        : '#fff',
                  }"
                  v-for="b in +Math.abs(a.nps.maxScore)"
                  :key="b"
                  @click="selectedNps(a, b)"
                >{{b}}</li>
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
                <option
                  v-for="(b, j) in a.pull_choice.titles"
                  :key="j"
                  :value="j + 1"
                >
                  {{ b }}
                </option>
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
              <li
                v-for="(b, j) in a.scale_fill"
                :key="j"
                class="scales-item flex-start"
              >
                <p class="scales-item__title">{{ b.title }}</p>
                <input
                  style="width: 50%"
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
                <van-button type="info" icon="plus" @click="addRow(a.auto_grow)"
                  >添加行</van-button
                >
                <van-button
                  type="info"
                  icon="minus"
                  @click="deleteRow(a.auto_grow)"
                  >删除行</van-button
                >
              </div>
            </div>
            <!-- 14 量表题 -->
            <div v-if="a.type == 14">
              <div class="type14 flex-start">
                <p>{{ a.scale_score.header }}</p>
                <van-radio-group
                  style="margin: 0 20px"
                  :disabled="qesStatus == 2"
                  v-model="a.scale_score.answer"
                >
                  <van-radio
                    v-for="j in +a.scale_score.maxScore"
                    :key="j"
                    :name="j"
                    >{{ j }}</van-radio
                  >
                </van-radio-group>
                <p>{{ a.scale_score.footer }}</p>
              </div>
            </div>
            <!-- 15 星级打分 -->
            <div v-if="a.type == 15">
              <div class="flex-start">
                <p>{{ a.star_score.header }}</p>
                <van-rate
                  style="margin: 0 20px"
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
              <img style="margin: 0 auto 15px" :src="a.image_qa.img_url" alt />
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
        <!-- 切换分组 -->
        <div class="flex-center">
          <div style="margin-right: 30px">
            <van-button
              v-if="j > 0"
              color="#176095"
              @click="prevQes(j)"
              type="info"
              >上一部分</van-button
            >
          </div>
          <van-button
            v-if="list.length > 1 && j < list.length - 1"
            color="#176095"
            @click="nextQes(b, j + 1)"
            type="info"
            >下一部分</van-button
          >
          <van-button
            v-if="qesStatus != 2 && active == list.length - 1"
            @click="submitQes"
            color="#176095"
            type="info"
            >提交</van-button
          >
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 提示弹窗 -->
    <van-overlay :duration="0.2" :show="errorShow">
      <div class="wrapper">
        <div class="block">
          <p class="p0 flex-center">
            <img class="tipimg" src="~assets/tip.png" alt srcset /> 提示
          </p>
          <p class="p1">第{{ errorQes.id }}题:</p>
          <p class="p2">{{ errorQes.title }}</p>
          <p class="p3">为必填类型，请完成答题</p>
          <div class="flex-center">
            <van-button
              @click="errorShow = false"
              style="width: 150px"
              color="#176095"
              type="info"
              >确认</van-button
            >
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 是否提交问卷提示弹窗 -->
    <van-overlay :duration="0.2" :show="isSaveShow">
      <div class="wrapper">
        <div class="block">
          <p class="p0 flex-center">
            <img class="tipimg" src="~assets/tip.png" alt srcset /> 提示
          </p>
          <p class="p3">您已答题完毕，提交后不能修改。是否要确认提交？</p>
          <div class="flex-center">
            <van-button
              @click="isSaveShow = false"
              style="width: 150px; margin-right: 20px"
              plain
              color="#176095"
              type="info"
              >取消</van-button
            >
            <van-button
              @click="saveAll(1)"
              style="width: 150px"
              color="#176095"
              type="info"
              >确认</van-button
            >
          </div>
        </div>
      </div>
    </van-overlay>
    <!-- 答题成功 -->
    <van-overlay :duration="0.2" :show="isSaveSecussShow">
      <div class="wrapper">
        <div class="block">
          <img class="logo" src="~assets/logo.png" />
          <p class="p4">提交成功！谢谢您的合作与支持！</p>
          <div class="flex-center">
            <van-button
              @click="confirmDia"
              style="width: 150px"
              color="#176095"
              type="info"
              >关闭</van-button
            >
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import vHeader from "@/components/vHeader";
import {
  HTTP_Accurate,
  HTTP_AccurateSave,
  HTTP_AccurateSaveAll,
  HTTP_Uploads,
} from "@/http/interface";
import { isObjArr, flatten, datefmt } from "@/utils/common.js";
export default {
  data() {
    return {
      desBoxShow: true,
      active: 0,
      qesStatus: this.$route.query.status,
      list: [],
      desData: {},
      arrNum: ["一", "二", "三", "四", "五", "六", "七", "八"],
      stepList: [],
      show: false,
      timer: null,
      errorShow: false,
      errorQes: {},
      isSaveShow: false,
      isSaveSecussShow: false,
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
  methods: {
    /* 点击上一部分 */
    prevQes(index) {
      this.active = index - 1;
      this.$refs.qesSwipe.swipeTo(index - 1);
    },
    /* 点击下一部分 */
    nextQes(list, index) {
      if (this.checkAnswer(list)) {
        this.$refs.qesSwipe.swipeTo(index);
        this.active = index;
      }
    },
    /* 删除文件 */
    deleteItem(item) {
      if (this.qesStatus == 2) {
        return false;
      }
      item.url = "";
    },
    /* 获取上传的文件 */
    afterRead(item) {
      return (file) => {
        let n = 0;
        uploads();
        function uploads() {
          if (isObjArr(file) == "array") {
            HTTP_Uploads(file[n].file, item.files[n].type).then((res) => {
              item.files[n].url = res.data;
              n++;
              if (file.length > n) {
                uploads();
              }
              console.log(res, "文件路径2");
            });
          } else {
            HTTP_Uploads(file.file, item.files[n].type).then((res) => {
              let n = item.files.filter((o) => o.url);
              item.files[n.length].url = res.data;
              console.log(res, "文件路径1");
            });
          }
          return false;
        }
      };
    },

    /* 是否答题校验 */
    checkAnswer(list) {
      if (this.$route.query.status != 2) {
        for (let i = 0; i < list.length; i++) {
          let a = list[i];
          /* 1 单选 */
          if (a.type == 1 && a.must == 1) {
            if (!a.single_choice.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 2 判断 */
          if (a.type == 2 && a.must == 1) {
            if (!a.judge.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 3 多选 */
          if (a.type == 3 && a.must == 1) {
            if (!a.multiple_choice.answer.length) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 4 填空题 */
          if (a.type == 4 && a.must == 1) {
            let arr = [];
            let arr_tk = document.querySelectorAll(".tk_" + a.id);
            arr_tk.forEach((o) => {
              arr.push(o.value);
            });
            a.blanks.answer = arr.join("&");
            if (!a.blanks.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 5 简答 */
          if (a.type == 5 && a.must == 1) {
            if (!a.qa) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 6 文件上传 */
          if (a.type == 6 && a.must == 1) {
            if (!a.files.filter((o) => o.url).length) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 9 NPS量表 */
          if (a.type == 9 && a.must == 1) {
            if (!a.nps.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 10 下拉 */
          if (a.type == 10 && a.must == 1) {
            if (!a.pull_choice.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 11 矩阵选择 */
          if (a.type == 11 && a.must == 1) {
            let arr = a.ju_choice.answer;
            for (let s = 0; s < arr.length; s++) {
              if (!arr[s].some((o) => o > 0)) {
                this.errorQes = a;
                this.errorShow = true;
                return false;
              }
            }
          }
          /* 12 矩阵填空 */
          if (a.type == 12 && a.must == 1) {
            let arr = a.scale_fill;
            if (!arr.some((o) => !!o.answer)) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 13 自增填空 */
          if (a.type == 13 && a.must == 1) {
            let answers = a.auto_grow.answers;
            for (let d = 0; d < answers.length; d++) {
              if (!answers[d].some((o) => !!o)) {
                this.errorQes = a;
                this.errorShow = true;
                return false;
              }
            }
          }
          /* 14 量表题 */
          if (a.type == 14 && a.must == 1) {
            if (!a.scale_score.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 15 星级打分 */
          if (a.type == 15 && a.must == 1) {
            if (!a.star_score.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
          /* 16 看图答题 */
          if (a.type == 16 && a.must == 1) {
            if (!a.image_qa.answer) {
              this.errorQes = a;
              this.errorShow = true;
              return false;
            }
          }
        }
      }
      return true;
    },
    /* 获取题型 */
    getData() {
      HTTP_Accurate(this.$route.query.qid).then((res) => {
        // let res = mockjs;
        let list = res.data.list;
    
        list.forEach((listA, index) => {
          listA.forEach((item, index) => {
            console.log("list.forEach : -- ", item);
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
                    `<input class="fill tk_${item.id}" ${disabled} value="${ele}" type="text">`
                  );
                });
                item.blanks.h5content = abc;
              } else {
                item.blanks.answer = "";
                // item.blanks.h5content = item.blanks.content.replace(
                //   /<fill>/gi,
                //   `<input class="fill tk_${index}" type="text">`
                // );
                item.blanks.h5content =  `<input class="fill tk_${item.id}" type="text">`;
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
        });

        this.list = list;
        this.listCopy = list[0];
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
      let write = JSON.stringify(flatten(this.list));
      HTTP_AccurateSave(this.$route.query.qid, write, action).then((res) => {
        if (action == 1) {
          this.active = this.stepList.length - 1;
          this.show = true;
          this.isSaveShow = false;
          this.isSaveSecussShow = true;
        }
      });
    },

    saveAll(action) {
      let write = JSON.stringify(flatten(this.list));
      HTTP_AccurateSaveAll(this.$route.query.qid, write, action).then((res) => {
        if (action == 1) {
          this.active = this.stepList.length - 1;
          this.show = true;
          this.isSaveShow = false;
          this.isSaveSecussShow = true;
        }
      });
    },

    /* 点击提交问卷 */
    submitQes() {
      if (!this.checkAnswer(flatten(this.list))) {
        return false;
      }
      this.isSaveShow = true;
    },
    /* 提交完成 */
    // confirmDia() {
    //   this.show = false;
    //   this.$router.replace("/home");
    // },
    /* 提交完成 */
    confirmDia() {
      this.show = false;
      this.isSaveSecussShow = false;
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        console.log("是微信浏览器");
        setTimeout(function () {
          document.addEventListener(
            "WeixinJSBridgeReady",
            function () {
              this.WeixinJSBridge.call("closeWindow"); //安卓手机关闭代码
            },
            false
          );
          this.WeixinJSBridge.call("closeWindow"); //苹果手机关闭代码
        }, 300);
      } else {
        console.log("不是微信浏览器");
        window.opener = null;
        window.open("about:blank", "_top").close();
      }
      // this.$router.replace("/home");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-step--horizontal .van-step__title {
  font-size: 16px;
  font-weight: bold;
}
.Box {
  position: relative;
  height: 100%;
}
.logo {
  width: 110px;
  height: 110px;
  display: block;
  margin: 20px auto;
}
/deep/ .desBox {
  background: #fff;
  padding: 20px;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  overflow-y: auto;
  // .desConent {
  //   height: 50vh;
  //   overflow-y: auto;
  //   background: #000;
  // }
  // .desConent {
  //   > p:first-child {
  //     > span {
  //       font-size: 10px !important;
  //       line-height: 10px !important;
  //     }
  //   }
  // }
}
.quesTitle {
  margin-bottom: 20px;
  line-height: 1.2;
}

.qesList {
  padding: 10px;
  overflow-y: auto;
  .explain {
    padding: 20px;
    background: #fff;
    margin-bottom: 10px;
    border: 1px solid #0065e0;
  }
}
.my-swipe {
  height: calc(100% - 108px);
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
      width: 500px;
      line-height: 1.2;
      margin-right: 20px;
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
  position: relative;
  // width: 500px;
  flex-wrap: nowrap;
  margin-top: 10px;

  li {
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
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
  min-width: 400px;
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

/* 错误提示弹窗 */
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 300px;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .p0 {
    font-size: 16px;
    font-family: "宋体";
    font-weight: bold;
    margin-bottom: 15px;
    .tipimg {
      width: 30px;
      margin-right: 10px;
    }
  }
  .p1 {
    font-size: 14px;
    font-weight: bold;
  }
  .p2 {
    margin: 20px 0;
    line-height: 1.5;
  }
  .p3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .p4 {
    text-align: center;
    margin-bottom: 40px;
    font-weight: bold;
  }
}
/deep/ .van-dialog {
  border-radius: 6px;
}
</style>
