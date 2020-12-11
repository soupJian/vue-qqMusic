<template>
    <div class="comment" ref="comment">
        <div class="back" @click="back">
            <i class="icon-back"></i>
            <span class="title">{{title}}</span>
        </div>
        <div class="hotComment" ref="hotComment">
            <div class="title">
                热门评论 ( {{ total }} )
            </div>
            <scroll :list="hotComment" class="scroll_comment" :pullUp="pullUp" @scrollToEnd="getMoreComment" ref="scroll">
                <div class="item">
                    <ul ref="ul">
                        <li v-for="item of hotComment" :key="item.commentid">
                            <img v-lazy="item.avatarurl">
                            <div class="detail">
                                <p class="comment_info">{{item.nick}}</p>
                                <p class="comment_detail" v-html="item.rootcommentcontent"></p>
                            </div>
                        </li>
                        <loading v-show="hotComment !=null && hasMore" title="获取更多评论中"></loading>
                    </ul>
                </div>
            </scroll>
            <no-result v-show="hotComment == null"></no-result>
        </div>
        <div class="backToTop" @click="backToTop" ref="backToTop">
            <i class="icon-back"></i>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { playListMixin } from '../../common/js/mixin'
import scroll from '../base/Scroll'
import loading from '../base/Load'
import NoResult from '../result/NoResult'
import request from '../../common/js/request'
export default {
    mixins: [ playListMixin ], // 组件同名方法可以覆盖mixin方法
    components: {
        scroll,
        loading,
        NoResult
    },
    data() {
        return {
            id: "",
            pageSize: 20,
            title: '',
            hotComment: [],
            total: 0,
            pullUp: true,
            hasMore: true
        }
    },
    methods: {
        // 当有播放列表时候需要底部有一个高度
        handlePlaylist() {
            const bottom = this.playList.length > 0 ? '60px' : ''
            this.$refs.ul.style.paddingBottom = bottom
            this.$refs.scroll.refresh();
            this.$refs.backToTop.style.bottom = bottom 
        },
        async getComment() {
            this.hasMore = true
            const params = { id: this.id, pageSize: this.pageSize,type: 1}
            const {data: {data: res}} = await request({
                url:'/comment', 
                data:params
            })
            this.title = res.name
            this.total = res.comment.commenttotal
            this.hotComment = res.comment.commentlist
            if(this.hotComment == null) {
                return
            }
            // 转义换行
            this.hotComment.forEach( item => {
                if(item.rootcommentcontent == undefined) {
                    return
                }
                item.rootcommentcontent = item.rootcommentcontent.replace(/\\n/g,"<br/>")
            })
            // 检查是否还有更多
            if(this.pageSize >= this.total) {
                this.hasMore = false
            }
        },
        back() {
            this.$router.back()
        },
        // 上拉加载
        getMoreComment() {
            if(!this.hasMore) {
                return
            }
            this.pageSize += 20
            this.getComment()
        },
        // 回到顶部
        backToTop() {
            this.$refs.scroll.scrollTo(0,0,500)
        }
    },
    computed: {
        ...mapState({
            playList: 'playList'
        })
    },
    activated() {
        this.id = this.$route.params.id
    },
    watch: {
        id() {
            this.getComment()
            this.pageSize = 20,
            this.title = '',
            this.hotComment = [],
            this.comment = [],
            this.total = 0
        },
        playList() {
            this.handlePlaylist()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.comment
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 100
    background-color $color-background
    .back
        height 40px
        display flex
        align-items center
        padding-left 10px
        i
            font-size 22px
            color $color-theme
        span
            margin-left 10px
    .hotComment
        .title 
            padding 10px 
            background-color $color-dialog-background
            color $color-text-l
        .scroll_comment
            position fixed
            top 80px
            bottom 0
            width 100%
            overflow hidden
            .item 
                ul
                    padding 10px
                    li
                        display flex
                        padding 10px 0
                        img 
                            width 30px
                            height 30px
                            border-radius 50%
                            margin-right 10px
                        .detail
                            display flex
                            color $color-text-l
                            flex-direction column
                            .comment_info
                                color $color-text-ll
                                font-size $font-size-large
                                margin-bottom 5px
                            .comment_detail
                                font-size $font-size-medium
                                line-height 20px
    .backToTop
        width 50px
        height 50px
        position fixed
        bottom 10px
        right 10px
        margin-bottom 10px
        border-radius 50%
        background-color $color-highlight-background
        display flex
        justify-content center
        align-items center
        transform rotate(90deg) 
        color $color-theme 
</style>