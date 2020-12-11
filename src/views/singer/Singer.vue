<template>
	<div class="Singer" ref="singer">
        <singer-category :categoryList="categoryList" @category-click="fetchSingerlist"/>
        <scroll :list="singerList" class="singer-scroll" ref="scroll">
            <div>
                <singer-list :singerList="singerList"/>
            </div>
        </scroll>
        <div class="loading-container" v-show="!singerList.length">
            <Loading/>
        </div>
	</div>
</template>

<script>
import SingerCategory from '../../components/singer/SingerCategory'
import SingerList from '../../components/singer/SingerList'
import Loading from '../../components/base/Load'
import Scroll from '../../components/base/Scroll'
import { playListMixin } from '../../common/js/mixin'
import request from '../../common/js/request'
export default {
    mixins: [ playListMixin ], // 组件同名方法可以覆盖mixin方法
	components:{
		SingerCategory,
        SingerList,
        Loading,
        Scroll
    },
    data(){
        return {
            categoryList: {}, // 歌手分类
            singerList: [], // 获取歌手列表
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            // list是个vue components，.$el取元素
            this.$refs.singer.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        // 获取歌手分类
        async fetchCategory() {
            const { data: { data: res } } = await request({
                url: '/singer/category'
            })
            this.categoryList = {
                sex: res.sex,
                area: res.area,
                genre: res.genre
            }
        },
         /* 获取歌手列表*/
        async fetchSingerlist (params) {
            /* 利用params将点击的属性传给接口*/
            this.singerList = []
            const res = await request({
                url:'/singer/list', 
                data:{params}
            })
            this.singerList = res.data.data.list
        }
    },
    created() {
        this.fetchCategory();
        this.fetchSingerlist()
    }
}
</script>

<style scoped lang="stylus"> 
.Singer
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .singer-scroll
    height calc(100% - 144px) // 减去上面category高度
    overflow: hidden
  .loading-container
    position absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
