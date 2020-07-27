<template>
    <transition name="up">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="playlist_wrap" @click.stop>
                <div class="playlist_header">
                    当前播放( {{playList.length}} )
                </div>
                <div class="playlist_operator">
                    <div class="playlist_mode" @click="changeMode">
                        <i :class="iconMode"></i>
                        {{modeText}}
                    </div>
                    <div class="playlist_clear" @click="showConfirm">
                        <i class="icon-clear"></i>
                    </div>
                </div>
                <div class="scroll">
                    <scroll class="playlist_item" :list="playList" ref="scroll">
                        <div>
                            <div class="item" v-for="(item,index) of playList" :key="item.id" @click="changeSong(index)">
                                <span class="item_name">
                                    <span class="current" :class="item.mid===currentSong.mid?'icon-play':''"></span>
                                    <span class="name">{{item.name}}</span>
                                </span>
                                <span class="item_operator">
                                    <i :class="getFavoriteIcon(item)" @click.stop="toggleFavorite(item)"></i>
                                    <i class="icon-delete" @click.stop="deleteOne(index)"></i>
                                </span>
                            </div>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="close" @click="hide">
                关闭
            </div>
            <confirm ref="confirm" text="是否清空列表" confirmBtnText="清空"
                    @confirm="clearSearchHistory"
            ></confirm>
        </div>
    </transition>
</template>
<script>
import { mapState } from 'vuex'
import scroll from '../base/Scroll'
import Confirm from '../base/Confirm'
import {playerMixin} from '../../common/js/mixin'
export default {
    mixins: [playerMixin],
    components: {
        scroll,
        Confirm
    },
    data() {
        return {
            showFlag: false,
            playMode: { // 播放模式
                sequence: 0, // 顺序
                loop: 1,    // 循环
                random: 2   // 随机
            }
        }
    },
    computed: {
        ...mapState({
            currentSong: 'currentSong',
            playList:'playList',
            mode: 'mode',
            currentIndex: 'currentIndex'
        }),
        // 播放模式图标
        iconMode() {
            return this.mode === this.playMode.sequence ? 'icon-sequence' : this.mode === this.playMode.loop ? 'icon-loop' : 'icon-random' 
        },
        modeText() {
        return this.mode === this.playMode.sequence ? '顺序播放' : this.mode === this.playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
        show() {
            this.showFlag = true
            setTimeout(() => {
              this.$refs.scroll.refresh()
            }, 20)
        },
        hide() {
            this.showFlag = false
        },
        // 删除某一首歌
        deleteOne(index) {
            this.playList.splice(index,1)
            if(index < this.currentIndex) {
                 this.$store.commit('setCurrentIndex',this.currentIndex-1)
            }
            if(index == this.playList.length) {
                this.$store.commit("setCurrentIndex", 0)
            }
            // 清空了列表，路由返回
            if(this.playList.length == 0) {
                this.$router.back()
                this.deleteAll()
            }
            this.$store.commit('setPlayList',this.playList)
            this.$store.commit('setSequenceList',this.playList)
        },
        deleteAll() {
            this.hide()
            this.$store.commit("setPlayList", [])
            this.$store.commit("setCurrentIndex", -1)
            this.$store.commit("setSequenceList", [])
            this.$store.commit("setPlaying", false)
        },
        // 切换歌曲
        changeSong(index) {
            this.$store.commit("setCurrentIndex",index)
        },
        // 改变播放模式
        changeMode() {
            this.$emit('changeMode')
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        clearSearchHistory() {
            this.deleteAll()
        }
    },
    watch: {
        playList() {
            this.$refs.scroll.refresh()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
/* 过渡动画 */
.up-enter-active,.up-leave-active
    opacity 1
    transition: all .5s;
.up-enter, .up-leave-to
    opacity: 0;
    transform: translateY(100%);
.playlist
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 200
    background-color $color-background-d
    .playlist_wrap
        position absolute
        left 0
        bottom 0
        width 100%
        padding 20px 20px 0
        background-color $color-highlight-background
        box-sizing border-box
        border-radius 20px 20px 0 0
        .playlist_header
            padding-bottom 10px
        .playlist_operator
            display flex
            color $color-theme
            justify-content space-between
        .scroll
            margin-top 10px
            width 100%
            height 400px
            margin-bottom 50px
            position relative
            .playlist_item
                top 0
                bottom 0
                width 100%
                position absolute
                overflow hidden
                .item
                    display flex
                    height 40px
                    justify-content space-between
                    align-items center
                    color $color-text-d
                    .item_name
                        display flex
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        .current
                            min-width 20px
                            margin-right 5px
                            color $color-theme
                        .name
                            overflow hidden
                            white-space nowrap
                            text-overflow ellipsis
                    .item_operator
                        padding-left 10px 
                        color $color-theme
                        font-size $font-size-small
                        i
                            margin-left 10px
                        .icon-favorite
                            color $color-sub-theme
    .close
        position fixed
        left 0
        bottom 0
        width 100%
        height 50px
        line-height 50px
        text-align center
        background-color $color-background
</style>
