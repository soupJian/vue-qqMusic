<template>
    <transition name="slide">
        <div class="mine">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="mine-title">个人中心</div>
            <div class="total">
                <router-link tag="div" class="item" v-for="item of items" :key="item.id" :to="item.path">
                    <span>{{item.name}}</span>
                </router-link>
            </div>
            <div class="copyRight">
                <p>soupJian Music</p>
                <p>学校：江西理工大学</p>
                <p>微信电话：13479291739  QQ: 2242476448</p>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            items: [
                {"id": 0,"name": "我喜欢",'path': '/mine/love'},
                {"id": 1,"name": "歌手",'path': '/mine/singer'},
                {"id": 3,"name": "歌单",'path': '/mine/songList'},
                {"id": 4,"name": "专辑",'path': '/mine/album'},
                {"id": 5,"name": "榜单",'path': '/mine/rank'},
                {"id": 2,"name": "播放历史",'path': '/mine/history'}
            ],
            title: '',
            show: false
        }
    },
    methods: {
        back() {
            this.$router.push('/recommend')
        }
    },
    computed: {
        ...mapState({
            historyPlay: 'historyPlay',
            loveMusic: 'loveMusic'
        })
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.slide-enter,.slide-leave-to 
    transform: translateX(-100%);
.slide-enter-active,.slide-leave-active
    transition: all 0.5s ease
.mine
    position fixed
    width 100%
    top 0
    bottom 0
    z-index 10
    background-color $color-background
    .back
        position absolute
        top 10px
        left 10px
        font-size 22px
        color $color-theme
    .mine-title
        width 60%
        height 40px
        margin 0 auto
        line-height 40px
        text-align center
    .total
        width 100%
        height calc(100% - 200px)
        display flex
        flex-direction column
        justify-content center
        .item
            width 80%
            height 40px
            margin 10px auto
            text-align center
            line-height 40px
            background-color $color-dialog-background
            border-radius 20px
    .copyRight
        display flex
        flex-direction column
        color $color-text-l
        font-size $font-size-small
        p
            text-align center
            height 30px
            line0height 30px
    .singer_wrap
        position fixed
        top 0
        bottom 0
        width 100%
        background-color $color-background
</style>