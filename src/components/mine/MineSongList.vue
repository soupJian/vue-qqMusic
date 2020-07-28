<template>
    <transition name="up">
        <div class="mineLove">
            <div class="back" @click="back()">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <scroll :list="list" class="singer-scroll" ref="scroll">
                <disc :DiscList="list"/>
            </scroll>
            <no-result v-show="list.length == 0" class="noResult"></no-result>
        </div>
    </transition>
</template>
<script>
import {mapState} from 'vuex'
import Scroll from '../base/Scroll'
import NoResult from '../../components/result/NoResult'
import Disc from '../base/Disc'
import { playListMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin ],
    components: {
        Disc,
        Scroll,
        NoResult
    },
    computed:{
        ...mapState({
            loveSongList: 'loveSongList',
            loveAlbum: 'loveAlbum'
        }),
        title() {
            return this.$route.name == 'mineSongList' ? '我的歌单': '我的专辑'
        },
        list() {
             return this.$route.name == 'mineSongList' ? this.loveSongList : this.loveAlbum
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            // list是个vue components，.$el取元素
            this.$refs.scroll.$el.style.bottom = bottom
            this.$refs.scroll.refresh()
            
        },
        back(){
            this.$router.back()
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
        top 50px
        bottom 0
        width 100%
</style>