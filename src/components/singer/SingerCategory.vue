<template>
    <div class="singer-category">
        <div v-for="(item,key) of categoryList"
            :key="key"
		>
            <ul class="SingerUl">
                <li v-for="(value, index) of item "
                    :key="value.id"
                    :class="{'active':activeIndex[key] === index}"
                    @click="categoryClick(key,index)"
                >
                    {{value.name}}
                </li>
            </ul>
		</div>
    </div>
</template>
<script>
export default {
    props: {
        categoryList:{
            type: Object,
			required: true
        }
    },
    data() {
		return {
			activeIndex: {
				sex:0,
				genre: 0,
                area:0
			}
		}
	},
    methods: {
        categoryClick(key,index) {
            this.activeIndex[key] = index
             const params = {}
            for (let key in this.activeIndex) { 
                 params[key] = this.categoryList[key][this.activeIndex[key]].id
            }
            this.$emit('category-click', params)
        }
    }
}
</script>
<style scoped lang="stylus">
@import '../../common/stylus/variable.styl'
.singer-category
  padding:10px 10px 0 10px;
  color $color-text-d
  ul
    display flex
    flex-wrap wrap
    li
      padding 5px
      margin 5px;
      font-size $font-size-medium
      text-align center
    .active
      border-radius 10px
      background-color $color-text-l
      color $color-text-ll
</style>