<template>
  <div id="app">
    <m-header></m-header>
    <tab :tabList="tabList"></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player/>
    <operator-song></operator-song>
  </div>
</template>

<script>
import MHeader from './components/app/m-header/Mheader'
import Tab from './components/base/Tab'
import player from './components/play/Player'
import  OperatorSong from './components/operatorSong/OperatorSong'
export default {
  components: {
    MHeader,
    Tab,
    player,
    OperatorSong
  },
  data() {
    return {
      tabList: [
        { "id": 1, "name": "推荐", "router": "/recommend" },
        { "id": 2, "name": "歌手", "router": "/singer" },
        { "id": 3, "name": "排行", "router": "/rank" }
      ]
    }
  }
}
</script>
<style lang="stylus">

</style>
