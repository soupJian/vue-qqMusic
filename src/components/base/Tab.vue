<template>
  <div class="tab">
    <router-link tag="div" class="tab-item"
                 v-for="item of tabList" :key="item.id"
                 :to="item.router">
      <span class="tab-link">{{item.name}}</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    props: {
      tabList:{
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>