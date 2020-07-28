<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list> 
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
            album: {}, // 歌单对象,
            songs: []
        }
    },
    methods: {
        // 检查是否存在songList对象
        chechAlbum() {
            this.album = this.$store.state.album
            if (!this.album.albumMID) {
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
        },
        // 获取歌手热门歌曲
        async fetchAlbum() {
            this.songs = []
            const { data: res}= await this.$http.get('/api/album/songs?albummid=' + this.album.albumMID)
            // 成功
            if(res.result == 100) {
                this.songs = res.data.list
            } else {
                console.log('获取失败')
            }
        }
    },
    computed: {
        title() {
            return this.album.title
        },
        bgImage() {
            return this.album.cover
        }
    },
    activated() {
        this.chechAlbum();
        this.fetchAlbum();
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>