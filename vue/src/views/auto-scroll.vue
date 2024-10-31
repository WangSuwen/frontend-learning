<template>
	<div>
		<h1 style="font-size: 30px;">自动滚动数据列表 + 动态添加新数据（海量数据时，dom数量也能保持少量）</h1>
		<vue-seamless-scroll
			:data="listData"
			:class-option="classOption"
			ref="seamlessScroll"
			class="warp"
		>
			<ul class="item">
				<li v-for="(item, index) in listData" :key="index">
					<span class="title" v-text="item.title"></span>
					<span class="date" v-text="item.date"></span>
				</li>
			</ul>
		</vue-seamless-scroll>
	</div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll';
export default {
	name: 'Example01Basic',
	components: {
		vueSeamlessScroll
	},
	data () {
		return {
			index: 1,
			change0or1: 0,
			listData: [],
			classOption: {
				// step: 1,
				singleHeight: 30,
				waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
				/* step: 2, // 数值越大速度滚动越快
				openWatch: true, // 开启数据实时监控刷新dom
				limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
				hoverStop: true, // 是否开启鼠标悬停stop
				direction: 1, // 0向下 1向上 2向左 3向右
				singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
				singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
				waitTime: 1000 // 单步运动停止的时间(默认值1000ms) */
			},
			interval: null
		};
	},
	mounted () {
		this.initData();
	},
	beforeDestroy () {
		this.insertData && clearInterval(this.insertData);
	},
	methods: {
		initData () {
			for (let i = 1; i <= 20; i++) {
				this.listData.push({
					title: `初始化添加的行${i}`,
					date: Date.now()
				});
			}
			this.insertData();
		},
		insertData () {
			this.insertData = setInterval(() => {
				this.listData.splice(10 * this.change0or1, 10, ...[
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() },
					{ title: `动态添加的行${this.index++}`, date: Date.now() }
				]);
				// listData length无变化，仅仅是属性变更，手动调用下组件内部的reset方法
				this.$refs.seamlessScroll.reset();
				this.change0or1 = this.change0or1 === 0 ? 1 : 0;
			}, 14 * 1000);
		}
	}
};
</script>

<style lang="scss" scoped>
    .warp {
        height: 270px;
        width: 360px;
        margin: 100px auto;
        overflow: hidden;
        ul {
            list-style: none;
            padding: 0;
            margin: 0 auto;
            li, a {
                display: block;
                height: 30px;
                line-height: 30px;
                display: flex;
                justify-content: space-between;
                font-size: 15px;
            }
        }
    }
</style>