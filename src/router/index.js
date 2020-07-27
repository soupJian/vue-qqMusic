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
    }
]

const router = new VueRouter({
  routes
})

export default router
