<template>
    <div class="singerlist">
        <ul>
            <li v-for="item of singerList" 
                :key="item.singer_id"
                @click="selectSinger(item)"
            >
                <img v-lazy="item.singer_pic">
                <div class="info">
                    <p class="name">
                        <span class="singer_name">{{item.singer_name}}</span>
                        <span class="favorite" @click.stop="toggleFavorite(item)">{{getFavoriteText(item)}} </span>
                    </p>
                    <p class="num" v-if="item.songNum">
                        <span v-if="item.albumNum != 0">单曲:{{item.songNum}}</span>
                        <span v-if="item.albumNum !=0">专辑:{{item.albumNum}}</span>
                        <span v-if="item.albumNum != 0">MV:{{item.mvNum}}</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {singerMixin} from '../../common/js/mixin'
export default {
    mixins: [singerMixin],
    name: 'singerlist',
    props: {
        singerList: {
            type: Array,
            required: true
        }
    },
    methods: {
        selectSinger(singer) {
            this.$store.commit('setSinger', singer)
            this.$store.commit('setValue',"歌手")
            this.$router.push({
            path: '/singer/mid='+singer.singer_mid
          })
        },
    }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable.styl'
    .singerlist
        color $color-text-d
        padding 0 20px
        li 
            width:100%;
            display flex
            padding-bottom 15px
            img 
                width:60px
                height:60px
                border-radius 50% 
                margin-right 20px
            .info
                display flex
                width calc(100% - 80px)
                flex-direction column
                justify-content center
                .name
                    display flex
                    justify-content space-between
                    .singer_name
                        flex 1
                        white-space nowrap
                        overflow hidden
                        margin-bottom 10px
                        text-overflow ellipsis
                    .favorite
                        width 50px
                        text-align center
                .num 
                    span 
                        margin-right 5px
                    
</style>
