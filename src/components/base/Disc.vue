<template>
	<div class="disc">
      <ul>
        <li v-for="item of DiscList" :key="item.content_id" @click="selectAblum(item)">
          <div class="icon">
            <img width="60" height="60" v-lazy="item.cover"/>
          </div>
          <div class="text">
            <h2 class="name" v-html="item.title"></h2>
            <p class="desc" v-html="item.username"></p>
          </div>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
	props:{
		DiscList:{
			type:Array,
			required:true
		}
  },
    methods: {
        selectAblum(item) {
          // 判断是歌单还是专辑，如果是歌单
            if(item.content_id) {
              this.$store.commit('setSongList',item)
              this.$store.commit("setValue",'歌单')
              this.$router.push('/songList/id='+ item.content_id)
            } else if (item.albumMID) { // 如果是专辑
              this.$store.commit('setAlbum',item)
              this.$store.commit("setValue",'专辑')
              this.$router.push('/album/id='+ item.albumMID)
            }
        }
    }
}
</script>

<style scoped="scoped" lang="stylus">
@import "../../common/stylus/variable.styl"
 .disc
    padding 0 20px
    li
        display flex
        box-sizing: border-box
        align-items: center
        padding-bottom 15px
      .text 
            display: flex
            min-width: 0; /* 使得后面的文字有省略号 */
            padding-left 20px
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            font-size: $font-size-medium
            .name
                margin-bottom: 10px
                color: $color-text
                overflow: hidden
                text-overflow ellipsis
                white-space nowrap
            .desc
                color: $color-text-d
                overflow: hidden
                text-overflow ellipsis
                white-space nowrap
</style>
