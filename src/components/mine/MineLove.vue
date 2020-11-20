<template>
    <transition name="up">
        <div class="mine-list">
            <div class="back" @click="back">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <!-- 弹窗是否清除所有 -->
            <confirm ref="confirm" :text="confirmText" confirmBtnText="清空"
                    @confirm="clearAll"
            ></confirm>
            <scroll :list="list" class="song-scroll" ref="scroll">
                <div>
                    <h1 class="title" v-show="list.length > 0">
                        <span class="text">清空列表</span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                    <music-item :songs="list"></music-item>
                </div>
            </scroll>
            <no-result v-show="list.length == 0 || list == undefined" class="noResult"></no-result>
        </div>
    </transition>
</template>
<script>
import Scroll from '../base/Scroll'
import NoResult from '../../components/result/NoResult'
import MusicItem from '../list/MusicItem'
import Confirm from '../base/Confirm'

import { playListMixin } from '../../common/js/mixin'
import { mapState } from 'vuex'
export default {
    mixins: [ playListMixin ],
    computed:{
        ...mapState({
            loveMusic: 'loveMusic',
            historyPlay: 'historyPlay'
        }),
        title() {
            return this.$route.name == 'mineLove' ? '我喜欢': '历史播放'
        },
        confirmText(){
            return this.$route.name == 'mineLove' ? '是否清空所有喜欢的歌曲': '是否清空所有的播放历史'
        },
        list() {
            return this.$route.name == 'mineLove' ? this.loveMusic: this.historyPlay
        }
    },
    components: {
        Scroll,
        NoResult,
        MusicItem,
        Confirm
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
        // 点击歌曲进行播放
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.list) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.list) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
        },
        // 清除所有的
        clearAll(){
            if(this.$route.name === 'mineLove') {
                localStorage.removeItem('loveMusic')
                this.$store.commit('clearLoveMusic')
            } else {
                localStorage.removeItem('historyPlay')
                this.$store.commit('clearHistoryPlay')
            }
        },
        showConfirm(){
            this.$refs.confirm.show()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.up-enter-active,.up-leave-active
    opacity 1
    transition: all .5s;
.up-enter, .up-leave-to
    opacity: 0;
    transform: translateX(100%);
.mine-list
    position fixed
    width 100%
    top 0
    bottom 0
    z-index 11
    background-color $color-background
    .back
        height 40px
        display flex
        align-items center
        padding-left 10px
        i
            font-size 22px
            color $color-theme
        span
            margin-left 10px
    .song-scroll
        position fixed
        overflow hidden
        top 40px
        bottom 0
        left 0
        right 0
        padding 20px 20px 0
        .title
            height 30px 
            display flex
            justify-content space-between
</style>