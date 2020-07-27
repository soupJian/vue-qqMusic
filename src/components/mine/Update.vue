<template>
    <transition name="up">
        <div class="update" v-show="showFlag">
            <div class="back" @click="hide">
                <i class="icon-back"></i>
                <span class="title">{{title}}</span>
            </div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTSOPd0HJqxMveNBo17QvugNKXnFYtbY-AmOA&usqp=CAU" alt="">
        </div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            showFlag: false,
            title: '更新中，敬请期待!!!'
        }
    },
    methods: {
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
.update
    position fixed
    width 100%
    top 0
    bottom 0
    z-index 11
    background-color #ccc
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
    img 
        position absolute
        top 50%
        transform translateY(-50%)
        width 100%
</style>