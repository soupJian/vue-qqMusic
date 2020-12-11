<template>
    <div class="quickSearch">
        <div class="quick">
            <div class="search_query" v-show="query != ''" @click="querySearch">
                <span>详细搜索</span>
                <span class="span_query">{{query}}</span>
            </div>
            <div class="quick_singer_wrap" v-for="item of quickObj" :key="item.type">
                <div v-show="item.itemlist.length > 0">
                    <div class="quick_singer_title">{{item.name}}</div>
                    <div class="quick_singer_item" v-for="list of item.itemlist" :key="list.id" @click="selectItem(item,list)">
                        <img :src="list.pic" v-if="list.pic">
                        <p> {{list.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import request from '../../common/js/request'
export default {
    props: {
        query: {
            type: String,
            default: ''   
        }
    },
    data() {
        return{
            quickObj: [],
            historyQuery: []
        }
    },
    watch: {
        query() {
            if(this.query == '') {
                this.quickObj = []
                return
            }
            this.quickSearch()
        }
    },
    methods: {
        async quickSearch() {
            const {data: { data: res }} = await request({
                url:'/search/quick?key='+this.query
            })
            this.quickObj = res
        },
        selectItem(item,list) {
            if(item.name==="专辑") {
                let album = []
                album.push(list)
                album.forEach( item => {
                    item.id = list.id
                    item.albumMID = list.mid
                    item.cover = list.pic
                    item.title = list.name
                })
                this.$store.commit('setAlbum',album[0])
                this.$store.commit("setValue",'专辑')
                this.$router.push('/album/id='+ album[0].id)
            }
            if(item.name=="歌手") {
                let singer = []
                singer.push(list)
                singer.forEach( item=> {
                    item.singer_mid = list.mid
                    item.singer_pic = list.pic
                    item.singer_name = list.name
                    item.singer_id = list.id
                })
                this.$router.push({
                    path: '/singer/mid='+singer[0].singer_mid
                })
                this.$store.commit('setSinger', singer[0])
                this.$store.commit("setValue",'歌手')
            }
            if(item.name=="单曲") {
                this.searchOne(list.name,list.singer)
            }
            if(item.name=="MV"){
                this.$router.push('/mv/'+list.vid)
            }
            this.local()
        },
        async searchOne(name,singer) { // 解决快速搜索单曲没有歌曲的专辑信息，获取不到图片信息问题
            const {data:{data:res}} = await request({
                url: '/song/find?key='+`${name+singer}`
            })
            res.mid = res.songmid
            res.name = res.songname
            res.album = {
                id: res.albumid,
                mid: res.albummid,
                name: res.albumname
            }
            let musicList = []
            musicList.push(res)
            this.$store.commit('setCurrentIndex', 0) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', musicList) //传递当前播放歌曲列表
            this.$store.commit('setSequenceList',musicList) //传递顺序播放列表
            this.$store.commit('setFullScreen',true) //传递当前播放歌曲列表
        },
        // 封装存储的方法
        local() {
            this. historyQuery = JSON.parse(localStorage.getItem('historyQuery')) || []
            // 进行本地存储
            this.historyQuery.forEach((item,index)=> {
                if(item === this.query) {
                    this.historyQuery.splice(index,1)
                }
            })
            this.historyQuery.unshift(this.query)
            localStorage.setItem("historyQuery", JSON.stringify(this.historyQuery))
        },
        querySearch() {
            this.$router.push('/search/'+this.query)
            this.local()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.quickSearch
    position fixed
    margin 0 20px
    width calc( 100% - 40px)
    color $color-text-d
    z-index 2
    background-color $color-highlight-background
    .quick
        .search_query
            padding 10px
            .span_query
                font-size 16px
                padding-left 10px
                color $color-theme
        .quick_singer_wrap
            .quick_singer_title
                font-size 16px
                padding 10px 10px 0
                color $color-theme
            .quick_singer_item
                display flex
                padding 10px 20px 0
                img
                    width 40px
                    height 40px
                    margin-right 10px
                p
                    color $color-text-d
                    font-size 14px
                    align-self center
                    padding-bottom 5px
</style>