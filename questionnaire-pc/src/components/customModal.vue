<template>
  <div class="popup">
    <transition name="overlay-fade">
      <div
        class="overlay"
        v-if="showModal"
        @touchmove.prevent
        @click="closeOnClickOverlay && close()"
      ></div>
    </transition>
    <div class="wrapper" v-if="showModal">
      <div class="tit flex-between">
        <div class="titL flex-center">
          <img :src="titleIcon" alt />
          {{title}}
        </div>
        <div class="titR flex-center" @click="close">
          <i class="iconfont icon-close" v-if="closeable"></i>
        </div>
      </div>
      <div v-if="!$slots.default" class="cont justify" v-html="content"></div>
      <slot></slot>
      <div class="btn" v-if="showConfirmBtn" @click="confirm()">{{btnText}}</div>
    </div>
  </div>
</template> 
<script>
const preventDefault = (event, isStopPropagation) => {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

const TIME_COUNT = 3;

export default {
  name: 'customModal',
  props: {
    closeable: Boolean,
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '温馨提示'
    },
    titleIcon: {
      type: String,
      default: require('../assets/img/icon3@2x.png')
    },
    btnText: {
      type: String,
      default: '确认'
    },
    content: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      showModal: false,
      showTimer: false,
      timer: null,
      timerCount: 0
    };
  },
  mounted () {
    this.$once("hook:beforeDestroy", () => {
      this.clearTimer();
      this.close();
    });
  },
  deactivated () {
    this.close();
  },
  methods: {
    preventTouchMove (event) {
      preventDefault(event, true);
    },
    startTimer () {
      if (!this.timer) {
        this.timerCount = TIME_COUNT;
        this.showTimer = true;
        this.timer = setInterval(() => {
          if (this.timerCount > 1 && this.timerCount <= TIME_COUNT) {
            this.timerCount--;
          } else {
            this.endTimer();
          }
        }, 1000);
      }
    },
    endTimer () {
      this.showTimer = false;
      this.clearTimer();
    },
    /**
     * @清除定时器
     */
    clearTimer () {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    toggleModal (type) {
      this.showModal = type;
      document.body.classList[type ? 'add' : 'remove']('overflow-hidden');
    },
    open () {
      this.toggleModal(true);
      this.$emit("open", { instance: this });
    },
    close () {
      if (this.showModal) {
        this.endTimer();
        this.toggleModal(false);
        this.$emit("close", { instance: this });
      }
    },
    confirm () {
      this.toggleModal(false);
      this.$emit("confirm", { instance: this });
    }
  }
};

</script>
<style lang="scss" scoped>
@import '@/style/var.scss';

// 弹窗
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9991;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.wrapper {
  width: 355px;
  padding: 36px 12px 18px;
  border-radius: 4px;
  position: fixed;
  max-height: 80vh;
  top: 50%;
  left: 50%;
  z-index: 9992;
  transform: translate3d(-50%, -50%, 0);
  overflow-y: auto;
  background-color: #fff;
  transition: transform 0.3s ease-out;
  -webkit-overflow-scrolling: touch;

  .tit {
    width: 100%;
    height: 36px;
    position: absolute;
    left: 0;
    top: 0;
    background: #eaeaea;
    .titL {
      font-size: 12px;
      font-weight: bold;
      color: #000000;
      padding-left: 10px;
      img {
        width: 18px;
        margin-right: 8px;
      }
    }
    .titR {
      width: 30px;
      height: 36px;
      .icon-close {
        font-size: 10px;
        color: #636363;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
      }
    }
  }

  .cont {
    padding-top: 16px;
    font-size: 14px;
    color: rgba(53, 53, 53, 1);
    line-height: 25px;
    overflow-y: auto;
    min-height: 100px;
    max-height: 400px;
    margin-bottom: 20px;
    white-space: pre-line;
  }

  .btn {
    width: 100%;
    height: 42px;
    line-height: 42px;
    color: #ffffff;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    background-color: $base-color;

    &:active {
      opacity: 0.7;
    }

    &.dis {
      background-color: #cecece;
    }
  }
}
</style>
