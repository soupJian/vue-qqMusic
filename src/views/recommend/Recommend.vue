<template>
    <div class="recommend" ref="recommend">
        <scroll :list="DiscList" ref="scroll" class="recommend-scroll">
            <div>
                <banner :BannerList="BannerList" @img-load="scrollRefresh"/>
                <h1 class="list-title">热门歌单推荐</h1>
                <disc :DiscList="DiscList"/>
            </div>
            <div class="loading-container" v-show="!DiscList.length">
                <Loading/>
            </div>
        </scroll>
    </div>
</template>

<script>
import Banner from '../../components/recommend/Banner'
import Disc from '../../components/base/Disc'
import Scroll from '../../components/base/Scroll'
import Loading from '../../components/base/Load'
import { playListMixin } from '../../common/js/mixin'
import request from '../../common/js/request'
export default {
    mixins: [ playListMixin ],
    components: {
        Banner,
        Disc,
        Scroll,
        Loading
    },
    data(){
		return {
            BannerList: [], // 轮播图
            DiscList: []// 推荐歌单
        }
    },
	methods:{ 
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            // list是个vue components，.$el取元素
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
		/* 获取轮播图 */
		async fetchBannerList () {
			const { data:{ data: res } } = await request({
                url: '/recommend/banner'
            })
                this.BannerList = res  
        },
        // 获取推荐歌单
        async fetchDiscList () {
			const { data: { data: res } } = await request({
                url: '/recommend/playlist/u'
            })
            this.DiscList = res.list
        },
        // scroll刷新高度
        scrollRefresh () {
			this.$refs.scroll.refresh();
        }
	}, // methods 结束
	mounted() {
        this.fetchBannerList();
        this.fetchDiscList();
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-scroll
      height: 100%
      overflow: hidden
      .list-title
        height 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
</style>