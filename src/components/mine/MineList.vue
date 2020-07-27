<template>
    <transition name="up">
        <div class="mine-list" v-show="showFlag">
            <div class="back" @click="hide">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <scroll :list="list" class="song-scroll" ref="scroll">
                <div>
                    <div class="song-list">
                        <ul>
                            <li v-for="(item, index) of list" :key="item.id" @click="selectItem(index)">
                                <h2><span class="name">{{item.name}}</span></h2>
                                <p>
                                <span v-for="list of item.singer" :key="list.id">{{list.name}}</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </scroll>
            <no-result v-show="list.length == 0 || list == undefined" class="noResult"></no-result>
        </div>
    </transition>
</template>
<script>
import Scroll from '../base/Scroll'
import NoResult from '../../components/result/NoResult'
import { playListMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin ],
    components: {
        Scroll,
        NoResult
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        list: {
            type: Array
        }
    },
    data() {
        return {
            showFlag: false,
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            // list是个vue components，.$el取元素
            this.$refs.scroll.$el.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        show() {
            this.showFlag = true
        },
        hide() {
            this.showFlag = false
        },
        // 点击歌曲进行播放
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.list) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.list) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
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
    transform: translateY(100%);
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
        width 100%
        .song-list
            padding 0 30px
            .text
                height 20px
                padding-bottom 10px 
                span 
                    margin-right 6px
                    line-height 20px
                    white-space nowrap
                    text-overflow ellipsis
                    overflow hidden
            ul
                li
                    display flex
                    flex-direction column
                    line-height 20px
                    padding-bottom 10px
                    p
                        color $color-text-d
                        font-size $font-size-small
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        span 
                            margin-right 5px
        .noResult
            top 40px

</style>