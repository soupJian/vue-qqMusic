import { mapState } from 'vuex'
// 播放器
export const playListMixin = {
  computed: {
    ...mapState({
      playList: 'playList'
    })
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newAal) {
      this.handlePlaylist(newAal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must  implement handlePlay methods')
    },
  }
}
// 收藏歌曲
export const playerMixin = {
  computed: {
    ...mapState({
      loveMusic: 'loveMusic',
      currentSong: 'currentSong'
    })
  },
  methods: {
    toggleFavorite(song) {
      const index = this.isFavorite(song)
      if(index > -1) {
          // 已有这首收藏歌曲，不再收藏
        this.loveMusic.splice(index,1)
      } else { // 这首歌没有收藏
        this.loveMusic.unshift(song)
      }
      localStorage.setItem("loveMusic", JSON.stringify(this.loveMusic))
    },
    getFavoriteIcon(song) {
      const index = this.isFavorite(song)
      if ( index > -1) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 判断是否收藏歌曲
    isFavorite(song) {
      const index = this.loveMusic.findIndex((item) => {
        return item.mid === song.mid
      })
      // 有收藏歌曲,索引
      return index
    },
    // 本地存储
    local(arr,name) {
      // 进行本地存储
      arr.forEach((item,index)=> {
          if(item.mid === this.currentSong.mid) {
              arr.splice(index,1)
          }
      })
      arr.unshift(this.currentSong)
      localStorage.setItem(name, JSON.stringify(arr))
    },
  }
}
// 收藏歌手
export const singerMixin = {
  computed: {
    ...mapState({
      loveSinger: 'loveSinger'
    })
  },
  methods: {
    toggleFavorite(singer) {
      const index = this.isFavorite(singer)
      if(index > -1) {
          // 已关注歌手
        this.loveSinger.splice(index,1)
      } else { // 这首歌没有收藏
        this.loveSinger.unshift(singer)
      }
      localStorage.setItem("loveSinger", JSON.stringify(this.loveSinger))
    },
    getFavoriteText(singer) {
      const index = this.isFavorite(singer)
      if ( index > -1) {
        return '已关注'
      } else {
        return '关注'
      }
    },
    // 判断是否收藏歌曲
    isFavorite(singer) {
      const index = this.loveSinger.findIndex((item) => {
        return item.singer_id === singer.singer_id
      })
      // 有收藏歌曲,索引
      return index
    }
  }
}