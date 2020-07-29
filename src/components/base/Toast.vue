<template>
    <div class="toast">
        {{title}}
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
.toast 
    position fixed
    top 10%
    width 100%
    display flex 
    justify-content center
    align-items center
    padding 10px 0
</style>