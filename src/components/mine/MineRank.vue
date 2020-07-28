<template>
    <transition name="up">
        <div class="mineLove">
            <div class="back" @click="back()">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <rank-list :ranklist="loveRank"></rank-list>
            <no-result v-show="loveRank.length == 0" class="noResult"></no-result>
        </div>
    </transition>
</template>
<script>
import { mapState} from 'vuex'
import NoResult from '../../components/result/NoResult'
import RankList from '../rank/RankList'
export default {
    components: {
        RankList,
        NoResult
    },
    data() {
        return {
            title: '我的榜单'
        }
    },
    methods: {
        back() {
            this.$router.back()
        }
    },
    computed: {
        ...mapState({
            loveRank: 'loveRank'
        })
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
    .rank-list
        top 40px
</style>