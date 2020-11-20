<template>
	<div class="m-header">
    <router-link tag="div" class="mine" to="/mine">
        <i class="icon-mine"></i>
      </router-link>
		<h1 class="text">soupJian Music</h1>
    <router-link tag="div" class="search" to="/search">
      <i class="icon-search"></i>
    </router-link>
	</div>
</template>

<style scoped lang="stylus">
@import "../../../common/stylus/variable";
  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .mine
      position absolute
      top 0
      left 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .search
      position: absolute
      top: 0
      right: 0
      .icon-search
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>