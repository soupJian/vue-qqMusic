<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="hotSongs"></music-list>
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
            singer: {},
            hotSongs: [] // 歌手热门歌曲
        }
    },
    methods: {
        // 检查是否存在singer对象
        checkSinger() {
            this.singer = this.$store.state.singer
            if (!this.singer.singer_id) {
                // 没有this.singer.id则自动跳转singer
                this.$router.push("/singer")
                return
            }
        },
        // 获取歌手热门歌曲
        async fetchHotSong() {
            this.hotSongs = []
            const { data: { data: res } } = await this.$http.get('/api/singer/songs?num=50&singermid='+this.singer.singer_mid)
            this.hotSongs = res.list
        }
    },
    computed: {
        title() {
            return this.singer.singer_name
        },
        bgImage() {
            return this.singer.singer_pic
        }
    },
    activated() {
        this.checkSinger();
        this.fetchHotSong();
    },
    watch: {
        hotSongs() {
            if(this.hotSongs.length == 0) {
                this.$store.commit("setSinger",{})
            }
        }
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