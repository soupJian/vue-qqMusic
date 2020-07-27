<template>
    <div class="search-result">
        <!-- 搜索框 -->
        <div class="search-box-wrapper">
            <i class="icon-back" @click="back"></i>
            <input class="box" v-model="query" placeholder="搜索歌曲、歌手" ref="query"/>
            <i class="icon-dismiss" v-show="query" @click="clear"></i>
        </div>
        <!-- tab -->
        <div class="tab-t">
            <span v-for="item of tabList" :key="item.t" v-html="item.name" class="item"
                  @click="changeT(item.t)" :class="t == item.t ?'active':''"
            ></span>
        </div>
        <div class="result" ref="result">
            <!-- 歌曲 -->
            <scroll :list="resultMusic" v-show="t==0" class="music-scroll" ref="songScroll">
                <div>
                    <ul class="result-list">
                        <li v-for="(item, index) of resultMusic" :key="item.songmid" @click="selectItem(index)">
                            <i class="icon-music"></i>
                            {{item.songname}}---<span v-for="singer of item.singer" :key="singer.id">{{singer.name}}</span>
                        </li>
                    </ul>
                    <div class="loading-container">
                        <loading v-show="!resultMusic.length && !showNoResult"/>
                    </div>
                    
                </div>
            </scroll>
            <!-- 歌单 -->
            <scroll :list="resultSongList" v-show="t==2" class="music-scroll" ref="listscroll">
                <div>
                    <disc :DiscList="resultSongList"/>
                    <div class="loading-container">
                        <loading v-show="!resultSongList.length && !showNoResult"/>
                    </div>
                </div>
            </scroll>
            <!-- 专辑 -->
            <scroll :list="resultMusic" v-show="t==8" class="music-scroll" ref="albumScroll">
                <div>
                    <disc :DiscList="resultAlbum"/>
                    <div class="loading-container">
                        <loading v-show="!resultAlbum.length && !showNoResult"/>
                    </div>
                </div>
            </scroll>
            <!-- 歌手 -->
            <scroll :list="resultMusic" v-show="t==9" class="music-scroll" ref="singerScroll">
                <div>
                    <singer-list :singerList="resultSinger"></singer-list>
                </div>
                <div class="loading-container">
                        <loading v-show="!resultSinger.length && !showNoResult"/>
                </div>
            </scroll>
            <!-- mv -->
            <scroll :list="resultMusic" v-show="t==12" class="music-scroll">
                <div>
                    暂未开发......
                </div>
            </scroll>
        </div>
        <no-result v-show="showNoResult"></no-result>
        <router-view></router-view>
    </div>
</template>
<script>
import scroll from '../base/Scroll'
import Disc from '../base/Disc'
import loading from '../base/Load'
import singerList from '../singer/SingerList'
import NoResult from './NoResult'
import { playListMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin ],
    components: {
        scroll,
        Disc,
        loading,
        singerList,
        NoResult
    },
    data() {
        return {
            query: '',
            resultMusic: [], // 歌曲列表
            resultSongList: [], // 歌单列表
            resultLyric: [],  // 歌词列表
            resultAlbum: [], // 专辑列表
            resultSinger: [], // 歌手列表
            resultMv: [], // MV列表
            t: 0, // 搜索参数
            tabList: [
                { 't': 0, 'name': '歌曲' },
                { 't': 2, 'name': '歌单' },
                { 't': 8, 'name': '专辑' },
                { 't': 9, 'name': '歌手' },
                { 't': 12, 'name': 'mv' }
            ],
            showNoResult: false // 如果没有搜索结果
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.result.style.bottom = bottom
            this.$refs.songScroll.refresh()
        },
        back() {
            this.$router.back()
        },
        clear() {
            this.query = ''
            this.$refs.query.focus()
        },
        changeT(t) {
            this.t = t
            this.fetchSearch()
        },
         async fetchSearch() {
            // 进行以下判断，如果每个数组已经存在了，就不需要在发送请求了
            if (this.t == 0 && this.resultMusic.length != 0) return
            if (this.t == 2 && this.resultSongList.length !=0) return 
            if (this.t == 8 && this.resultAlbum.length !=0) return
            if (this.t == 9 && this.resultSinger.length !=0) return
            if (this.t == 12 && this.resultMv.length !=0) return
            if(!this.query) return
            const { data: { data:res } } = await this.$http.get('/api/search',{params:{t: this.t,key: this.query}})
                if(res.list.length == 0) { // 表示查询不到
                    this.showNoResult = true
                }
                if(res.list.length > 0) { // 有搜索结果
                    this.showNoResult = false
                }
                if(this.t == 0){
                    this.resultMusic = res.list
                    this.resultMusic.forEach(item => {
                        item.mid = item.songmid
                        item.name = item.songname
                        item.album = {
                            id: item.albumid,
                            mid: item.albummid,
                            name: item.albumname
                        }
                    })
                }
                if(this.t == 2){
                    this.resultSongList = res.list
                    this.resultSongList.forEach(item => {
                        item.id = item.docid
                        item.content_id = item.docid
                        item.username = item.dissname
                        item.cover = item.imgurl
                        item.title = item.introduction || '暂无描述---这个歌单作者很懒'
                    })
                }
                if(this.t == 8){
                    this.resultAlbum = res.list
                    this.resultAlbum.forEach(item => {
                        item.id = item.albumID
                        item.username = item.singerName
                        item.cover = item.albumPic
                        item.title = item.albumName
                    })
                }
                if(this.t == 9){
                    this.resultSinger = res.list
                    this.resultSinger.forEach(item => {
                        item.singer_id = item.singerID
                        item.singer_mid = item.singerMID
                        item.singer_name = item.singerName
                        item.singer_pic = item.singerPic
                    })
                }
                if(this.t == 12){
                    this.resultMv = res.list
                }
        },
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) //传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.resultMusic) //传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.resultMusic) //传递顺序播放列表
            this.$store.commit('setFullScreen',true) //传递当前播放歌曲列表
        },
    },
    activated() {
        this.query = this.$route.params.query
        this.fetchSearch()
    },
    watch: {
        query() {
            if(this.query =='') {
                return
            }
            this.resultMusic = [] // 歌曲列表
            this.resultSongList = [] // 歌单列表
            this.resultLyric = []  // 歌词列表
            this.resultAlbum = [] // 专辑列表
            this.resultSinger = [] // 歌手列表
            this.resultMv = [] // MV列表
            this.fetchSearch()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.search-result
    position fixed
    top 0
    bottom 0
    width 100%
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
    .tab-t
        display flex
        padding 0 10px
        justify-content center
        .item 
            flex 1
            text-align center
            padding-bottom 10px
        .active 
            color $color-theme
            border-bottom: 2px solid $color-theme
    .result
        position fixed
        width 100%
        top 118px
        bottom 0
        .music-scroll
            height 100%
            overflow hidden
            .result-list
                padding 0 20px
                li
                    width 90% 
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    font-size: 16px
                    color: $color-text-d
                    padding-bottom 20px
                    span 
                        margin-right 5px
                .icon-music
                    margin-right 5px
.loading-container
    position fixed
    bottom 50%
    left 50%
    transform translate(-50%,-30%)
</style>