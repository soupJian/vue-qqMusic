<template>
	<div class="rank" ref="rank">
		<Scroll :list="ranklist" class="rank-scroll" ref="scroll">
            <div>
                <div v-for="item of ranklist" :key="item.topId" class="item" @click="selectRank(item)">
                    <img v-lazy="item.picUrl">
                    <ul>
                        <li v-for="(list, index) of item.song" :key="index">
                            {{ ++index }}. {{list.title}}
                        </li>
                    </ul>
                </div>
            </div>
        </Scroll>
        <div class="loading-wrapper" v-show="!ranklist.length">
            <loading/>
        </div>
	</div>
</template>

<script>
import Scroll from '../../components/base/Scroll'
import Loading from '../../components/base/Load'
import { mapState } from 'vuex'
import { playListMixin } from '../../common/js/mixin'
export default {
    mixins: [ playListMixin ], // 组件同名方法可以覆盖mixin方法
    name: 'rank',
    components: {
        Scroll,
        Loading
    },
    data () {
        return {
            ranklist: []
        }
    },
    computed: {
        ...mapState({
            playList: 'playList'
        })
    },
    watch: {
        playList() {
            this.handlePlaylist()
        }
    },
    methods: {
        async fetchRank () {
            const res = await this.$http.get('/api/top/category', { params: { showDetail: 1 } })
            /* 处理一下数据 */
            this.ranklist = res.data.data.reduce((total, item) => total.concat(item.list), [])
        },
        // 当有播放列表时候需要底部有一个高度
        handlePlaylist() {
            const bottom = this.playList.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.scroll.refresh();
        },
        selectRank(item) { 
            // 给vuex进行传参
            this.$store.commit('setRank', item)
            this.$router.push('/rank/id='+ item.topId)
        },
    },
    created () {
        this.fetchRank()
    }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable.styl'
.rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .rank-scroll
      height 100%
      overflow: hidden
      padding 0 20px
      .item
        display flex
        padding-bottom 20px
      img 
        width 100px
        height 100px
      ul
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small
        li
          width 100%
          line-height: 26px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
    .loading-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
