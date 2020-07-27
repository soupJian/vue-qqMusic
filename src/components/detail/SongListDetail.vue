<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" value="歌单"></music-list> 
    </transition>
</template>
<script>
import musicList from '../list/musicList'
export default {
    components: {
        musicList
    },
    data() {
        return {
            songList: {}, // 歌单对象,
            songs: []
        }
    },
    methods: {
        // 检查是否存在songList对象
        checkSongList() {
            this.songList = this.$store.state.songList

            if (!this.songList.content_id) { 
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
        },
        // 获取歌手热门歌曲
        async fetchSongListDetail() {
            this.songs = []
            const { data: { data: res}}= await this.$http.get('/api/songlist?id='+ this.songList.content_id)
            this.songs = res.songlist
            if(this.songs == undefined) { // 搜索结果为空
                this.songList = []
                return
            }
            this.songs.forEach( item => {
                item.mid = item.songmid
                item.name = item.songname
                item.album = {
                    id: item.albumid,
                    mid: item.albummid,
                    name: item.albumname
                }
            })

        }
    },
    computed: {
        title() {
            return this.songList.title
        },
        bgImage() {
            return this.songList.cover
        }
    },
    activated() {
        this.checkSongList();
        this.fetchSongListDetail();
    }
    // watch: {
    //     songs() {
    //         if(this.songs.length == 0) {
    //             this.$store.commit("setSongList",{})
    //         }
    //     }
    // }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>