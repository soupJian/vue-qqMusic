<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list> 
    </transition>
</template>
<script>
import musicList from '../list/musicList'
import { mapState} from 'vuex'
import request from '../../common/js/request'
export default {
    components: {
        musicList
    },
    data() {
        return {
            songs: []
        }
    },
    methods: {
        // 检查是否存在songList对象
        checkRank() {
            if (!this.rank.topId) {
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
        },
        // 获取歌手热门歌曲
        async fetchRank() {
            this.songs = []
            const { data: res }= await request({
                url: '/top?id=' + this.rank.topId
            })
            // 成功
            if(res.result == 100) {
                this.songs = res.data.list
            } else {
                console.log('获取失败')
            }  
        }
    },
    computed: {
        ...mapState({
            rank: 'rank'
        }),
        title() {
            return this.rank.label
        },
        bgImage() {
            return this.rank.picUrl
        }
    },
    mounted() {
        this.checkRank()
        this.fetchRank()
    },
    watch: {
        album() {
            this.fetchRank()
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>