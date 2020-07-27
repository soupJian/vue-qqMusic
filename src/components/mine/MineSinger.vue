<template>
    <transition name="up">
        <div class="mineLove" v-show="showFlag">
            <div class="back" @click="hide">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <scroll :list="loveSinger" class="singer-scroll" ref="scroll">
                <SingerList :singerList="loveSinger"></SingerList>
            </scroll>
            <no-result v-show="loveSinger.length == 0" class="noResult"></no-result>
        </div>
    </transition>
</template>
<script>
import {mapState} from 'vuex'
import Scroll from '../base/Scroll'
import NoResult from '../../components/result/NoResult'
import SingerList from '../../components/singer/SingerList'
import { playListMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin ],
    components: {
        SingerList,
        Scroll,
        NoResult
    },
    computed:{
        ...mapState({
            loveSinger: 'loveSinger'
        })
    },
    data() {
        return {
            showFlag: false,
            title: '歌手'
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
.mineLove
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
    .singer-scroll
        position fixed
        overflow hidden
        top 40px
        bottom 0
        width 100%
</style>