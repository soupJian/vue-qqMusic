<template>
    <div class="music-list">
        <div class="detail-header" :style="opacityStyle" v-show="showTitle">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="title"></h1>
        </div>
        <scroll :list="songs" class="song-scroll" ref="scroll"
                :probeType="probeType" :listenScroll="listenScroll"
                @scroll="scroll">
            <div>
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                    <span class="title">{{title}}</span>
                 </div>
                <div class="bg-image" :style="bgStyle" ref="bgImage"></div>
                <div class="song-list">
                    <div class="text">
                        <p @click="random"><span class="icon-play"></span>随机播放全部</p>
                        <p @click="toggleFavorite">
                            <span>
                                <i :class="getFavoriteIcon()"></i>
                            </span>
                            <span>{{this.$store.state.value}}</span>
                        </p>
                    </div>
                    <MusicItem :songs="songs"></MusicItem>
                </div>
            </div>
        </scroll>
        <!-- 懒加载 -->
        <div class="loading-container" v-show="songs == undefined || songs.length ==0">
            <loading></loading>
         </div>
    </div>
</template>
<script>
import Scroll from '../base/Scroll'
import loading from '../base/Load'
import MusicItem from './MusicItem'
import { playListMixin } from '../../common/js/mixin'
import { listMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin, listMixin ], // 组件同名方法可以覆盖mixin方法
    components: {
        Scroll,
        loading,
        MusicItem
    },
    props: ['bgImage','title','songs'],
    data() {
        return {
            showTitle: false,
            probeType: 3,
            listenScroll: true,
            scrollY: 0,
            opacityStyle: {
              opacity: 0
            }
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            // list是个vue components，.$el取元素
            this.$refs.scroll.$el.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        back() {
            this.$router.back()
        },
        scroll(pos) {
            if(pos.y > 0) return        
            this.scrollY = Math.abs(pos.y);
            if (this.scrollY > 40) {
                let opacity = this.scrollY / 263
                opacity = opacity > 1 ? 1 : opacity
                this.opacityStyle = { opacity }
                this.showTitle = true
            } else {
                this.showTitle = false
            }
        },
        // 点击歌曲进行播放
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.songs) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.songs) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
        },
        // 点击实现随机播放
        random() {
            let index = Math.floor(Math.random() * this.songs.length)
            this.$store.commit('setMode', 2) // 设置随机播放
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.songs) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.songs) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
        }
    },
    computed: {
        // 计算背景图
        bgStyle() {
            return `background-image:url(${this.bgImage});`
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .detail-header
    position fixed
    display flex
    align-items center
    padding 0 6px
    width 100%
    height 40px
    background $color-highlight-background
    z-index 55
    .back 
      z-index: 50
      .icon-back
        font-size: $font-size-large-x
        color $color-theme
    .title
      z-index: 40
      padding-left 6px
      flex 1
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      font-size: $font-size-large
      color: $color-text
  .song-scroll
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    // overflow: hidden
    background: $color-background
    .back
      position absolute
      padding 0 6px
      top 10px
      display flex
      align-items center
      height 20px
      width 100%
      .icon-back
        font-size: $font-size-large-x
        color: $color-theme
      .title 
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        margin-left 5px
    .bg-image
      width: 100%
      height: 0
      padding-bottom 70%
      background-size: cover
    .song-list
      padding 20px 30px 0 30px
      .text
        height 20px
        padding-bottom 10px 
        display flex
        justify-content space-between
        span 
          margin-right 6px
          line-height 20px
          white-space nowrap
          text-overflow ellipsis
          overflow hidden
          .icon-favorite
            color $color-sub-theme
  .loading-container
    position absolute
    width 100%
    top 70%
    transform translateY(-50%)
</style>