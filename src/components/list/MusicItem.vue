<template>
    <div class="music-item">
        <div class="song-list">
            <ul>
                <li v-for="(item, index) of songs" :key="item.id" @click="selectItem(index)">
                    <h2>
                        <span class="name">{{item.name}}</span>
                        <span :class="getIcon(item)" @click.stop="addSong(item)"></span>
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
import { mapState } from 'vuex'
export default {
    props: {
        songs: {
            type: Array
        }
    },
    computed: {
        ...mapState({
            playList:'playList',
            sequenceList: 'sequenceList'
        })
    },
    methods: {
        // 点击歌曲进行播放
        selectItem(index) {
            this.$store.commit('setCurrentIndex', index) // 传递当前播放歌曲索引
            this.$store.commit('setPlayList', this.songs) // 传递当前播放歌曲列表
            this.$store.commit('setSequenceList', this.songs) // 传递顺序播放列表
            this.$store.commit('setFullScreen',true) // 传递当前播放歌曲列表
        },
        addSong(item){
            const index = this.isPlayList(item)
            if(index > -1) {
                return
            } else {
                this.playList.push(item)
                this.$store.commit('setPlayList', this.playList) // 传递当前播放歌曲列表
                if(this.playList.length == 1) { // 只有一首歌那就让他播放
                    this.$store.commit('setCurrentIndex', 0) // 传递当前播放歌曲索引
                }
            }
        },
        getIcon(item) {
            const index = this.isPlayList(item)
            if(index > -1) {
                return ''
            } else {
                return 'icon-add'
            }
        },
        isPlayList(item) {
            // 判断播放列表中是否包含这首歌
            const index = this.playList.findIndex(list => {
                return list.mid == item.mid
            })
            return index
        }
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
                h2
                    display flex
                    justify-content space-between
                    .icon-add
                        font-size $font-size-small
                p
                    color $color-text-d
                    line-height 30px
                    font-size $font-size-small
                    span 
                        margin-right 5px
</style>