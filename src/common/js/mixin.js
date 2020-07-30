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
    // 找到当前歌曲在新列表中的索引，防止切换播放顺序时会自动切歌
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
          return item.mid === this.currentSong.mid
      })
      this.$store.commit('setCurrentIndex',index)
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
export const listMixin = {
  computed: {
    ...mapState({
      value: 'value',
      loveSongList: 'loveSongList',
      loveAlbum: 'loveAlbum',
      loveRank: 'loveRank',
      loveSinger: 'loveSinger',
      songList: 'songList',
      album: 'album',
      rank: 'rank',
      singer: 'singer'
    })
  },
  methods: {
    toggleFavorite() {
      const index = this.isFavorite()
      let loveList,item,loveLocal
      let value = this.value
      if(value == "歌单") {
        loveList = this.loveSongList
        item = this.songList
        loveLocal = "loveSongList"
      }
      if(value == "歌手") {
        loveList = this.loveSinger
        item = this.singer
        loveLocal = "loveSinger"
      }
      if(value == "排行") {
        loveList = this.loveRank
        item = this.rank
        loveLocal = "loveRank"
      }
      if(value == "专辑") {
        loveList = this.loveAlbum
        item = this.album
        loveLocal = "loveAlbum"
      }
      if(index > -1) {
          // 已有这首收藏歌单，不再收藏
        loveList.splice(index,1)
      } else { // 歌单没有收藏
        loveList.unshift(item)
      }
      localStorage.setItem(loveLocal, JSON.stringify(loveList))
    },
    getFavoriteIcon() {
      const index = this.isFavorite()
      if ( index > -1) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 判断是否收藏歌曲
    isFavorite() {
      let index
      if(this.value == "歌单") {
          index = this.loveSongList.findIndex((item) => {
          return item.content_id === this.songList.content_id
        })
        return index
      }
      if(this.value == "排行") {
        index = this.loveRank.findIndex((item) => {
          return item.topId === this.rank.topId
        })
        return index
      }
      if(this.value == "专辑") {
          index = this.loveAlbum.findIndex((item) => {
          return item.albumMID === this.album.albumMID
        })
        return index
      }
      if(this.value == "歌手") {
        index = this.loveSinger.findIndex((item) => {
        return item.singer_id === this.singer.singer_id
      })
      return index
    }
    }
  }
}