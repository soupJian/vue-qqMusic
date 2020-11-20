<template>
	<div class="wrapper" ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
	props:{
		// 监听页面滚动，知道滚动的位置
		probeType: {
            type: Number,
            default: 1
		},
		// 监听滚动
		listenScroll: {
            type: Boolean,
            default: false
        },
		// 传递过来的数组
		list:{
			type: Array,
			required:null
		},
		// 页面点击事件
        click:{
            type: Boolean,
            default: true
		},
		dblclick:{
			type: Boolean,
			default: true
		},
		pullUp: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		initScroll() {
			this.scroll = new Bscroll(this.$refs.wrapper, {
				probeType: this.probeType,
                /* 可以触发点击事件*/
				click: this.click,
				scrollX: true,
				dblclick: this.dblclick
			})
			if (this.listenScroll) {
                let me = this
                this.scroll.on('scroll', (pos) => {
                    // 写成：this.$emit('scroll', pos)，this是指this.scroll.on('scroll', (pos) => {})里的'scroll'
                    // 监听到scroll事件和位置，pos是个对象有X和Y轴的属性
                    me.$emit('scroll', pos)
                })
			}
			if(this.pullUp) { // 监听上拉加载事件
				// scrollEnd：scroll停止，scrollToEnd：scroll滚动到底部
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        // 小于(this.scroll.maxScrollY + 50)快滚动到底部
                        this.$emit('scrollToEnd')
                    }
                })
			}
		},
		refresh() {
			this.scroll && this.scroll.refresh();	
		},
		scrollTo() {
            // 接收参数到scroll，因此用apply
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
           this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments) 
        }
	},
	watch: {
		list() {
			this.$nextTick(() =>{
				this.refresh();
			})
		}
	},
	mounted(){
		this.initScroll();
	}
}
</script>

<style>
</style>
