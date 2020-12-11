<template>
    <transition name="slide">
        <div class="search" ref="search">
            <!-- 搜索框 -->
            <div class="search-box-wrapper">
                <i class="icon-back" @click="back"></i>
                <input class="box" v-model="query" placeholder="搜索歌曲、歌手" ref="query"/>
                <i class="icon-dismiss" v-show="query" @click="clear"></i>
            </div>
            <!-- 快速搜索 -->
            <quick-search :query="query"></quick-search>
            <!-- 弹窗是否清除所有 -->
            <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"
                 @confirm="clearSearchHistory"
            ></confirm>
            <!-- 热门搜索滚动列表 -->
            <scroll :list="hotSearch" class="hotSearch-scroll" ref="hotSearch">
                <div>
                    <!-- 历史搜索 -->
                    <div class="history-search" v-show="historyQuery.length > 0">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <scroll class="historyScroll" :list="historyQuery">
                            <ul>
                                <li v-for="(item,index) of historyQuery" :key="index" class="history-item" @click="addQuery(item)">{{item}}</li>
                            </ul>
                        </scroll>
                    </div>
                    <!-- 热门搜索 -->
                    <div class="hotSearch">
                        <h4 class="title">热门搜索</h4>
                        <ul>
                            <li class="item" v-for="(item, index) in hotSearch" :key="item.k"
                                @click="addQuery(item.k)">
                                <span class="index" :class="index <= 2 ?'active-index':''">{{index+1}}</span>
                                <span class="name" :class="index <= 2 ?'active-name':''">{{ item.k }}</span>
                                <span class="num">{{item.n}}</span>
                            </li>
                        </ul>
                        <div class="loading-container">
                            <loading v-show="!hotSearch.length"/>
                        </div>
                    </div>
                </div>
            </scroll>
        </div>
    </transition>
</template>
<script>
import scroll from '../../components/base/Scroll'
import loading from '../../components/base/Load'
import QuickSearch from '../../components/quickSearch/QuickSearch'
import Confirm from '../../components/base/Confirm'
import { playListMixin } from '../../common/js/mixin'
import request from '../../common/js/request'
export default {
    mixins: [ playListMixin ], // 组件同名方法可以覆盖mixin方法
    components: {
        scroll,
        loading,
        QuickSearch,
        Confirm
    },
    data(){
        return{
            hotSearch: [],
            query: '',
            historyQuery: JSON.parse(localStorage.getItem('historyQuery')) || []
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.search.style.bottom = bottom
            this.$refs.hotSearch.refresh()
        },
        // 获取热搜词
        async getHotSearch() {
            const { data: { data: res } } = await request({
                url:'/search/hot'
            })
            this.hotSearch = res
        },
        // 点击热搜列表进行query
        addQuery(query) {
            this.query = query.replace(/\s+/g,"")
        },
        back() {
            this.$router.push('/recommend')
        },
        clear() {
            this.query = ''
        },
        showConfirm() {
            this.$refs.confirm.show()
        },
        clearSearchHistory() {
             this.historyQuery = []
            localStorage.setItem("historyQuery", JSON.stringify(this.historyQuery))
        }
    },
    mounted() {
        this.getHotSearch()     
    },
    activated() {
        this.query = ''
        this.historyQuery = JSON.parse(localStorage.getItem('historyQuery')) || []
    }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.slide-enter,.slide-leave-to {
      transform: translateX(100%);
    }
.slide-enter-active,.slide-leave-active{
      transition: all 0.8s ease;
    }
.search
  position fixed
  width 100%
  top 0
  bottom 0
  z-index 10
  background-color $color-background
  .search-box-wrapper
    margin 20px
    display flex
    height 40px
    background: $color-highlight-background
    align-items center
    .icon-back
      font-size: 24px
      color: $color-theme
    .box
      flex: 1
      outline none
      line-height 18px
      padding 0 15px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      padding-right 10px
      color: $color-background
  .hotSearch-scroll
    position absolute
    top 80px
    width 100%
    bottom 0
    overflow: hidden
    .history-search
      margin 0 20px 20px
      .title
        display flex
        justify-content space-between
        margin-bottom: 20px
        font-size: $font-size-medium
        color: $color-text-l
      .historyScroll
        display flex
        width 100%
        overflow hidden
        ul
            white-space nowrap
            .history-item
                display inline-block
                padding 0 10px
                height 20px
    .hotSearch
      margin 0 20px 20px
      .title
         margin-bottom: 20px
         font-size: $font-size-medium
         color: $color-text-l
      li
        display flex
        padding-bottom 15px
        font-size: $font-size-medium
        color: $color-text-d
      .active-index
        color $color-sub-theme
        font-size $font-size-large
      .active-name
          color $color-theme-d
          font-size $font-size-large
        .index
          width 30px
        .name
          flex 1
        .num 
          width 60px
          text-align right
    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>