import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    singer: {},  // 歌手详情
    songList: {}, // 歌单详情
    album: {}, // 专辑详情
    rank: {}, // 排行榜详情
    playing: false,  // 播放状态
    fullScreen: false, // 事都全屏
    playList: [], // 播放列表
    sequenceList: [], // 顺序播放列表
    mode: 0, // 播放模式
    currentIndex: -1, //当前播放歌曲索引
    currentSong: {}, // 当前播放歌曲
    historyPlay: JSON.parse(localStorage.getItem('historyPlay')) || [],// 历史播放
    loveSinger: JSON.parse(localStorage.getItem('loveSinger')) || [], // 关注的歌手
    loveAlbum: JSON.parse(localStorage.getItem('loveAlbum')) || [], // 收藏的专辑
    loveSongList: JSON.parse(localStorage.getItem('loveSongList')) || [], // 收藏的歌单
    loveMusic: JSON.parse(localStorage.getItem('loveMusic')) || [], // 喜欢的歌曲
    loveRank: JSON.parse(localStorage.getItem('loveRank')) || [] // 收藏的排行榜
  },
  mutations: {
    // 点击歌手进行切换详情页，传递singer
    setSinger(state,singer) {
      state.singer = singer
    },
    // 点击歌单进行切换详情页，传递songList
    setSongList(state,songList) {
      state.songList = songList
    },
    // 点击专辑进行切换详情页，传递album
    setAlbum(state,album) {
      state.album = album
    },
    // 点击排行榜详情
    setRank(state, rank) {
      state.rank = rank
    },
    // 设置是否全屏展示
    setFullScreen(state,boolean) {
       state.fullScreen = boolean
    },
    // 控制播放暂停状态
    setPlaying(state, boolean){
      state.playing = boolean
    },
    // 控制顺序播放列表
    setSequenceList(state, list){
      state.sequenceList = list
    },
    // 控制当前播放列表
    setPlayList(state, list){
      state.playList = list
      state.currentSong = state.playList[state.currentIndex]
    },
    setCurrentSong(state,currentSong) {
      state.currentSong = currentSong
    },
    // 设置当前播放歌曲索引
    setCurrentIndex(state,index){
      state.currentIndex = index
      state.currentSong = state.playList[state.currentIndex]
    },
    // 控制播放模式
    setMode(state,mode) {
      state.mode = mode
    },
  },
  actions: {
  },
  modules: {
  }
})
