<template>
    <div class="music-item">
        <div class="song-list">
            <ul>
                <li v-for="(item, index) of songs" :key="item.id" @click="selectItem(index)">
                    <h2>
                        <span class="name">{{item.name}}</span>
                    </h2>
                    <p>
                        <span v-for="list of item.singer" :key="list.id">{{list.name}}</span>
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        songs: {
            type: Array
        }
    },
    methods: {
        // 点击歌曲进行播放
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.songs) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.songs) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.music-item
    .song-list
        ul
            li
                display flex
                flex-direction column
                padding-bottom 10px
                p
                    color $color-text-d
                    line-height 30px
                    font-size $font-size-small
                    span 
                        margin-right 5px
</style>