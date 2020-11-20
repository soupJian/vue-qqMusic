import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import ('../views/recommend/Recommend.vue')
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import ('../views/singer/Singer.vue')
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import ('../views/rank/Rank.vue')
    },
    {
      path: '/singer/:mid',
      name: 'singerDetail',
      component: () => import ('../components/detail/singerDetail.vue')
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import ('../views/mine/Mine.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import ('../views/search/Search.vue')
    },
    {
      path: '/songList/:id',
      name: 'SongListDetail',
      component: () => import ('../components/detail/SongListDetail.vue')
    },
    {
      path: '/album/:id',
      name: 'AlbunDetail',
      component: () => import ('../components/detail/AlbumDetail.vue')
    },
    {
      path: '/rank/:id',
      name: 'RankDetail',
      component: () => import ('../components/detail/RankDetail.vue')
    },
    {
      path: '/search/:query',
      name: 'searchQuery',
      component: () => import ('../components/result/Result.vue')
    },
    {
      path: '/mine/love',
      name: 'mineLove',
      component: () => import ('../components/mine/MineLove.vue')
    },
    {
      path: '/mine/history',
      name: 'mineHistory',
      component: () => import ('../components/mine/MineLove.vue')
    },
    {
      path: '/mine/singer',
      name: 'mineSinger',
      component: () => import ('../components/mine/MineSinger.vue')
    },
    {
      path: '/mine/songList',
      name: 'mineSongList',
      component: () => import ('../components/mine/MineSongList.vue')
    },
    {
      path: '/mine/album',
      name: 'mineAlbum',
      component: () => import ('../components/mine/MineSongList.vue')
    },
    {
      path: '/mine/rank',
      name: 'mineRank',
      component: () => import ('../components/mine/MineRank.vue')
    },
    {
      path: '/comment/:id',
      name: 'comment',
      component: () => import ('../components/comment/Comment.vue')
    },
    {
      path: '/mv/:vid',
      name: 'mv',
      component: () => import ('../views/videoPlay/VideoPlay.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router
