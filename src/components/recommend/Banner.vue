<template>
    <div class="banner">
        <swiper ref="mySwiper" :options="swiperOptions" v-if="showBanner">
            <swiper-slide v-for="item of BannerList"
                          :key="item.id"
                          class="banner-item">
            <img :src="item.picUrl" :load="imgLoad"/>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
    components: {
        Swiper,
        SwiperSlide
    }, 
    props:{
        BannerList: {
            type:Array
        }
    },
    data() {
      return {
        swiperOptions: {
          pagination: {
            el: '.swiper-pagination'
          },
          loop: true,
          autoplay: true
        }
      }
    },
    methods: {
        imgLoad() {
			this.$emit('img-load');
		}
    },
    /* 解决轮播图从第一张开始*/
    computed: {
        showBanner() {
            return this.BannerList.length
        }
    }
}
</script>

<style lang="stylus" scoped>
    .banner >>> .swiper-pagination-bullet-active
        width 16px
        border-radius 8px
        background: #fff
	.banner{
        width:100%;
        height:0;
        padding-bottom: 39%;
    }
	.banner-item{
		width:100%;
        height: 0;
        padding-bottom: 39%;
        img {
            width:100%;
            border-radius 10px 10px 0 0 ;
        }
	}
            
</style>