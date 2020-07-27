<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" value="排行"></music-list> 
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
            rank: {}, // 歌单对象,
            songs: []
        }
    },
    methods: {
        // 检查是否存在songList对象
        checkRank() {
            this.rank = this.$store.state.rank
            if (!this.rank.topId) {
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
        },
        // 获取歌手热门歌曲
        async fetchRank() {
            this.songs = []
            const { data: res }= await this.$http.get('/api/top?id=' + this.rank.topId)
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
            return this.rank.label
        },
        bgImage() {
            return this.rank.picUrl
        }
    },
    activated() {
        this.checkRank();
        this.fetchRank();
    },
    watch: {
        songs() {
            if(this.songs.length == 0) {
                this.$store.commit("setRank",{})
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