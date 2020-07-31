<template>
    <div class="no_result">
        <img src="https://m.xiongmaocar.com/imgs/pc/searchNotImg.png">
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.no_result
    position fixed
    top 110px
    left 0
    bottom 0
    right 0
    display flex
    flex-direction column
    justify-content center
    align-items center
</style>