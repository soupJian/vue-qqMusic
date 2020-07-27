<template>
    <div class="progress-bar">
      <div class="inner" ref="inner" @click="progressClick">
        <!-- 进度条 -->
        <div class="progress" ref="progress"></div>
        <!-- prevent阻止拖到浏览器 -->
        <div class="btn" ref="btn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend="progressTouchEnd">
        </div>
      </div>
    </div>
</template>

<script>
// 按钮小圆球的宽度
export default {
    data() {
      return {
        touchStatus: false, // 拖动状态
        newPrecent: 0
      }
    },
    props: {
      precent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      // 获取进度条宽度
      innerWidth() {
        return this.$refs.inner.clientWidth
      },
      rect() {
        return this.$refs.inner.getBoundingClientRect().left
      }
    },
    methods:{
      // 设置宽度以及便宜量
      offset(precent) {
        const progressWidth = this.innerWidth * precent
        const btnLeft = (this.innerWidth - 16) * precent
        this.$refs.progress.style.width = `${progressWidth}px`
        this.$refs.btn.style.left = `${btnLeft}px`
      },
      triggerPercent() {
          const precent = this.$refs.progress.clientWidth / this.innerWidth
          this.$emit('precentChange',precent)
      },
      progressTouchStart() {
        this.touchStatus = true
      },
      // 手指滑动
      progressTouchMove(e) {
        if(this.touchStatus) {
            // 手指滑动的距离
            let touchX = e.touches[0].clientX - this.rect
            if(touchX > this.innerWidth) touchX = this.innerWidth
            if(touchX < 0) touchX = 0
            this.newPrecent = touchX / this.innerWidth
            this.offset(this.newPrecent)
        }
      },
      // 手指滑动结束
      progressTouchEnd() {
        // 手指离开取消事件
        this.touchStatus = false
        this.triggerPercent()
      },
      // 点击进度条
      progressClick(e) {
        // 进度条相对屏幕的距离
        // 偏移的距离
        const offsetWidth = e.pageX - this.rect
        const precent = offsetWidth / this.innerWidth
        this.offset(precent)
        this.triggerPercent()
      }
    },
    watch: {
      precent() {
        if(this.precent >= 0 && !this.touchStatus) {
          this.offset(this.precent)
        }
      }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .btn
        position: absolute
        top -6px
        left 0
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>