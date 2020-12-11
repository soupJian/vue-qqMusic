<template>
    <div class="player" v-show="playList.length >= 1">
        <!-- 全屏播放器 -->
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
                <!-- 背景图 -->
                <div class="background">
                    <img width="100%" height="100%" :src="imgsrc"/>
                </div>
                <!-- 头部 -->
                <div class="top">
                    <div class="back" @click="back(false)">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle">
                        <span v-for="item of currentSong.singer" :key="item.id">{{item.name}}</span>
                    </h2>
                </div>
                <!-- 中间 -->
                <div class="middle"
                     @touchstart.prevent="middleTouchStart"
                     @touchmove.prevent="middleTouchMove"
                     @touchend="middleTouchEnd">
                    <!-- 左边图片 -->
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img class="image" :src="imgsrc" :class="rorate"/>
                            </div>
                        </div>
                        <!-- 当前播放的歌词 -->
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <!-- 右边歌词 -->
                    <scroll class="middle-r" ref="lyricList" :list="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" 
                                    class="text"
                                    v-for="(line, index) in currentLyric.lines"
                                    :key="index"
                                    :class="{'current': currentLineNum === index}"
                                    @dblclick="playCurrentLyric(line)">
                                    {{line.txt}}
                                </p>
                                <p v-show="currentLyric.lines.length === 0" class="nolyric">
                                    该歌曲暂无歌词
                                </p>
                            </div>
                        </div>
              </scroll>
                </div>
                <div class="bottom">
                    <!-- 左右切换分页显示 -->
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <!-- 进度条 -->
                    <div class="progress-wrapper">
                        <span class="time time-l">{{forMat(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :precent="precent" @precentChange="precentChange"/>
                        </div>
                        <span class="time time-r">{{forMat(currentSong.interval)}}</span>
                    </div>
                    <!-- icon图标操作区域 -->
                    <div class="operators">
                        <div class="icon icon-l" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon icon-l" @click="changeIndex(-1)" >
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon icon-center" @click="changePlaying" :class="disabledCls">
                            <i :class="playIcon"></i>
                        </div>
                        <div class="icon icon-r" @click="changeIndex(1)">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon icon-r"  @click="toggleFavorite(currentSong)">
                            <i :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
                <Toast title="抱歉！该歌曲暂无播放地址" v-show="audioSrc == undefined"></Toast>
            </div>
        </transition>
        <!-- 迷你播放器 -->
        <!-- 迷你播放器 -->
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen && currentSong !=  undefined" @click="back(true)">
                <div class="icon">
                    <img width="40" height="40" :src="imgsrc" :class="rorate"/>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc">
                        <span v-for="item of currentSong.singer" :key="item.id">{{item.name}}</span>
                    </p>
                </div>
                <div class="control" @click.stop="changePlaying">
                    <i :class="miniIcon"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist" @click.stop="showPlaylist"></i>
                </div>
            </div>
        </transition>
        <audio :src="audioSrc"
                ref="audio"
                @canplay="ready" @error="error"
                @timeupdate="updateTime"
                @ended="end">
        </audio>
        <play-list ref="playList" @changeMode="changeMode"></play-list>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Lyric from 'lyric-parser'
import progressBar from '../progress-bar/progressBar'
import scroll from '../base/Scroll'
import playList from '../playList/PlayList'
import Toast from '../base/Toast'
import {playerMixin} from '../../common/js/mixin'
import request from '../../common/js/request'
export default {
    mixins: [playerMixin],
    data() {
        return {
            audioSrc: '', // 歌曲播放地址
            songReady: false, // 歌曲是在否准备
            playMode: { // 播放模式
                sequence: 0, // 顺序
                loop: 1,    // 循环
                random: 2   // 随机
            },
            currentTime: 0, // 音频目前播放时间
            currentLyric: null , // 歌词对象
            currentLineNum: 0, // 当前播放那个的歌词行数
            playingLyric: '', // 当前播放的歌词
            currentShow: 'cd', // 当前展示的是歌词还是cd
            touch: {} // 是否手指滑动状态
        }
    },
    computed: {
      ...mapState({
        fullScreen: 'fullScreen', // 控制全屏
        playList: 'playList',  // 播放列表的数据是否存在
        currentSong: 'currentSong', // 当前播放歌曲
        playing: 'playing', // 播放状态
        currentIndex: 'currentIndex', // 当前歌曲索引
        mode: 'mode', // 播放模式
        sequenceList: 'sequenceList', // 随机播放列表
        historyPlay: 'historyPlay', // 播放历史
        loveMusic: 'loveMusic', // 喜欢的歌曲
      }),
      imgsrc(){  // 图片地址
          return JSON.stringify(this.currentSong) == '{}' ? '' : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.currentSong.album.mid}.jpg`
      },
      playIcon() { // 播放暂停按钮
          return this.playing ? 'icon-pause' : 'icon-play' 
      },
      miniIcon() { // mini播放器icon变化
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 当播放时候中间图片进行旋转
      rorate() {
          return this.playing ? 'play' : 'play pause'
      },
      // 播放模式图标
      iconMode() {
        return this.mode === this.playMode.sequence ? 'icon-sequence' : this.mode === this.playMode.loop ? 'icon-loop' : 'icon-random' 
      },
      // 当歌曲未加载时候播放暂停按钮不可用
      disabledCls() {
          return this.songReady ? '' : 'disable'
      },
      // 计算当前播放时间与总时间的比例
      precent() {
        return this.currentTime / this.currentSong.interval
      }
    },
    methods: {
        // 大小播放器之间的切换
        back(status) {
            this.$store.commit('setFullScreen', status)
        },
        // 获取播放地址
        async fetchAudioSrc(mid) {
            this.audioSrc = ''
            const { data: res } = await request({
                url:'/song/urls?id='+mid
            })
            if(JSON.stringify(res.data) == {}) { // 没有播放地址
                this.audioSrc = ''
            } else {
                this.audioSrc = res.data[mid]
            }
            if(this.audioSrc == undefined) {
                clearTimeout(this.timeAudio)
                this.timeAudio = setTimeout(() => {
                    // 播放下一首
                    this.changeIndex(1)
                },3000)
            }
        },
        // 获取歌词
        async fetchLyric(mid) {
            const {data: res} = await request({
                url:'/lyric?songmid='+mid
            })
            if(res.result == 100) {
                // res.data.lyric // 歌词数据
                this.currentLyric = new Lyric(res.data.lyric,this.handleLyric) //this.handleLyric回调函数
                this.currentLyric.play()
            } else {
                // 获取不到歌词清空
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            }
        },
        // 处理歌词播放
        handleLyric({lineNum, txt}) {
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl, 1000)// 滚动到元素
            } else {
                this.$refs.lyricList.scrollTo(0, 0, 1000)// 滚动到顶部
            }
            this.playingLyric = txt
        },
        // 音频加载成功，可以播放
        ready() {
            this.songReady = true
            this.$store.commit('setPlaying', true)
            // 加载成功就可以播放
            this.$refs.audio.play()
        },
        // 音频加载错误
        error() {
            this.songReady = false
        },
        // 播放器播放状态
        changePlaying() {
            if(this.songReady) {
                this.playing ? this.$store.commit('setPlaying', false) : this.$store.commit('setPlaying',true)
                if(this.currentLyric) {
                    // 歌词暂停与播放
                    this.currentLyric.togglePlay()
                }
            }
        },
        // 上一首下一首实现 
        changeIndex(i) {
            // 当只有一首歌的时候执行loop方法
            if(this.playList.length === 1) {
                this.loop()
            } else {
                let index = this.currentIndex + i
                if(index < 0) index = this.playList.length -1
                if(index == this.playList.length) index = 0
                this.$store.commit('setCurrentIndex',index)
            }
        },
        // 歌曲结束
        end() {
            if(this.mode === this.playMode.loop) {
                this.loop()
            } else {
             // 如果不是循环播放，则自动播放下一首
            this.changeIndex(1)
            }
        },
        // 改变播放模式
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.$store.commit('setMode', mode)
            let list = null
            if(mode == this.playMode.random) { 
                this.shuffle(this.sequenceList)
                list = this.sequenceList
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.$store.commit('setPlayList',list)
        },
        // 循环播放
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric) {
                this.currentLyric.seek(0)
            }
        },
        // 数组乱序
        shuffle(arr) {
            let i = arr.length;
            while (i) {
                let j = Math.floor(Math.random() * i--);
                [arr[j], arr[i]] = [arr[i], arr[j]];
            }
            return arr;
        },
        // video的时间更新属性
        updateTime(e) {
            // e.target.currentTime 就是歌曲当前播放时间
            this.currentTime = e.target.currentTime
        },
        // 解决时间显示问题
        forMat(interval) {
            interval = interval | 0
            const minute = interval/60 | 0
            const second = interval % 60 | 0
            if(second<10) return `${minute}:0${second}`
            return `${minute}:${second}`
        },
        precentChange(precent){
            // 拉动bar进度条后设置audio播放时间
            const currentTime = this.currentSong.interval * precent
            this.$refs.audio.currentTime = currentTime
            // 拉动bar进度条后歌词跟着进度条变化到和歌曲一样的
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
            }
        },
        middleTouchStart(e) {
            this.touch.initiated = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        middleTouchMove(e) {
            if (!this.touch.initiated) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            // 纵轴滚动偏差绝对值大于横轴滚动偏差绝对值，不该移动。只支持横向移动。
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            // 歌词偏移量限制
            const width = deltaX
            if(width < 0) {
                this.$refs.lyricList.$el.style.left = '0'
                this.$refs.middleL.style.opacity = `${width / window.innerWidth}`
                this.currentShow = 'lyric'
            } else {
                this.$refs.lyricList.$el.style.left = '100%'
                this.$refs.middleL.style.opacity = '1'
                this.currentShow = 'cd'
            }
        },
        middleTouchEnd() {
            this.touch.initiated = false
        },
        // playlist的显示与隐藏
        showPlaylist() {
            this.$refs.playList.show()
        },
        // 双击歌词播放
        playCurrentLyric(line){
            const currentTime = line.time
            this.$refs.audio.currentTime = currentTime / 1000
            // 拉动bar进度条后歌词跟着进度条变化到和歌曲一样的
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime)
            }
        }
    },
    watch: {
        currentSong(newSong,oldSong) {
            if(newSong.mid === oldSong.mid){
                return
            }
            // 歌曲改变进行本地存储
            if(this.currentSong == undefined) {
                this.$store.commit('setCurrentSong',{})
                return
            }
            this.fetchAudioSrc(this.currentSong.mid)
            // 防止歌词跳动
            if (this.currentLyric) {
                this.currentLyric.stop()
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.fetchLyric(this.currentSong.mid)
            },1000)
            this.local(this.historyPlay,"historyPlay")
        },
        playing() {
            const audio = this.$refs.audio
            this.playing ? audio.play() : audio.pause()
        }
    },
    components: {
        progressBar,
        scroll,
        playList,
        Toast
    },
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
// 转场动画
.normal-enter-active, .normal-leave-active
    transition all .4s
    .top, .bottom
      transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
.normal-enter, .normal-leave-to
    opacity: 0
    .top
      transform translateY(-100px)
    .bottom
      transform translateY(100px)
// 图片旋转
@keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
.player
    .normal-player
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 150
        background: $color-background
        .background
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            opacity: 0.6
            filter: blur(20px)
        .top
            position relative
            margin-bottom 15px
            .back
                position absolute
                top: 0
                left: 6px
                z-index: 50
                .icon-back
                    display: block
                    padding: 9px
                    font-size: $font-size-large-x
                    color: $color-theme
                    transform: rotate(-90deg)
            .title
                width: 70%
                margin: 0 auto
                line-height: 40px
                text-align: center
                font-size: $font-size-large
                color: $color-text
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
            .subtitle
                display flex
                justify-content center
                line-height: 20px
                font-size: $font-size-medium
                color: $color-text
                span
                    padding 0 5px
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
        .middle
            position fixed
            top 120px
            bottom 170px
            width 100%
            .middle-l
                position: absolute
                width: 100%
                height: 0
                padding-top: 80%
                .cd-wrapper
                    position: absolute
                    left: 10%
                    top: 0
                    width: 80%
                    height: 100%
                    .cd
                        width: 100%
                        height: 100%
                        box-sizing: border-box
                        border: 10px solid rgba(255, 255, 255, 0.1)
                        border-radius: 50%
                        .image
                            width 100%
                            height 100%
                            border-radius 50%
                    .play
                        animation: rotate 20s linear infinite
                    .pause
                        animation-play-state: paused
                .playing-lyric-wrapper
                    width: 80%
                    margin: 30px auto 0 auto
                    overflow: hidden
                    text-align: center
                    .playing-lyric
                        height: 20px
                        line-height: 20px
                        font-size: $font-size-medium
                        color: $color-text-l
            .middle-r
                position: fixed
                top: 80px
                bottom: 160px
                width 100%
                left 100%
                overflow: hidden
                text-align: center
                .text
                    line-height: 32px
                    color: $color-text-l
                    font-size: $font-size-medium
                .current
                    color: $color-text
                .nolyric
                    margin-top 50%
        .bottom 
            position absolute
            bottom 50px
            width 100%
            .dot-wrapper
                text-align: center
                .dot
                    display: inline-block
                    vertical-align: middle
                    margin: 0 4px
                    width: 8px
                    height: 8px
                    border-radius: 50%
                    background: $color-text-l
                .active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
            .progress-wrapper
                display flex
                align-items center
                width 80%
                margin 0px auto
                padding 10px 0
                .time
                    color $color-text
                    font-size $font-size-small
                    flex 0 0 30px
                    line-height 30px
                    width 30px
                .time-l
                    text-align: left
                .time-r
                    text-align: right
                .progress-bar-wrapper
                    flex: 1
            .operators
                display flex
                padding 0 20px 
                .icon 
                    flex 1
                    text-align center
                    color $color-theme
                    font-size 30px
                    align-self center
                .icon-center
                    font-size 40px
                .disable
                    color: $color-theme-d
                .icon-favorite
                    color $color-sub-theme
    .mini-player
        display: flex
        align-items: center
        position: fixed
        left: 0
        bottom: 0
        z-index: 180
        width: 100%
        height: 60px
        background: $color-highlight-background
        .icon
            flex: 0 0 40px
            width: 40px
            padding: 0 10px 0 20px
            img
                border-radius: 50%
            .play
                animation: rotate 20s linear infinite
            .pause
                animation-play-state: paused
        .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
                margin-bottom: 2px
                overflow hidden
                white-space nowrap
                text-overflow ellipse
                font-size: $font-size-medium
                color: $color-text
            .desc
                overflow hidden
                white-space nowrap
                text-overflow ellipse
                font-size: $font-size-small
                color: $color-text-d
                span 
                    margin-right 10px
        .control
            flex: 0 0 30px
            width: 30px
            padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
            font-size: 30px
            color: $color-theme-d
        .icon-mini
            font-size: 32px
            position: absolute
            left: 0
            top: 0  

</style>