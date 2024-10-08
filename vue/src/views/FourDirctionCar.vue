<template>
	<div class="car-canvas">
		<div
			class="huojia"
			:class="{'guodao': item.y === 3 || item.y === 7}"
			v-for="item in huojia1"
			:key="item.name"
			:style="{ 
				left: item.x * borderWidth + 'px', 
				top: item.y * borderWidth + 'px',
				'--borderWidth': borderWidth + 'px'
			}"
		>
			<span v-if="![3, 7].includes(item.y)">x: {{ item.x }}, y: {{ item.y }}</span>

		</div>
		<div id="car" class="car" :style="{'--borderWidth': borderWidth + 'px'}"></div>
	</div>
</template>
<script>
export default {
	name: "FourDirectionCar",
	components: {  },
	data () {
		return {
			huojia1: [
				{ x: 1, y: 1, name: 101 },
				{ x: 2, y: 1, name: 102 },
				{ x: 3, y: 1, name: 103 },
				{ x: 4, y: 1, name: 104 },
				{ x: 5, y: 1, name: 105 },
				{ x: 6, y: 1, name: 106 },
				{ x: 7, y: 1, name: 107 },
				{ x: 8, y: 1, name: 108 },
				{ x: 9, y: 1, name: 109 },
				{ x: 10, y: 1, name: 110 },
				{ x: 11, y: 1, name: 111 },
				{ x: 1, y: 2, name: 112 },
				{ x: 2, y: 2, name: 113 },
				{ x: 3, y: 2, name: 114 },
				{ x: 4, y: 2, name: 115 },
				{ x: 5, y: 2, name: 116 },
				{ x: 6, y: 2, name: 117 },
				{ x: 7, y: 2, name: 118 },
				{ x: 8, y: 2, name: 119 },
				{ x: 9, y: 2, name: 120 },
				{ x: 10, y: 2, name: 121 },
				{ x: 11, y: 2, name: 122 },
				{ x: 1, y: 3, name: 123 },
				{ x: 2, y: 3, name: 124 },
				{ x: 3, y: 3, name: 125 },
				{ x: 4, y: 3, name: 126 },
				{ x: 5, y: 3, name: 127 },
				{ x: 6, y: 3, name: 128 },
				{ x: 7, y: 3, name: 129 },
				{ x: 8, y: 3, name: 130 },
				{ x: 9, y: 3, name: 131 },
				{ x: 10, y: 3, name: 132 },
				{ x: 11, y: 3, name: 133 },
				{ x: 1, y: 4, name: 134 },
				{ x: 2, y: 4, name: 135 },
				{ x: 3, y: 4, name: 136 },
				{ x: 4, y: 4, name: 137 },
				{ x: 5, y: 4, name: 138 },
				{ x: 6, y: 4, name: 139 },
				{ x: 1, y: 5, name: 140 },
				{ x: 2, y: 5, name: 141 },
				{ x: 3, y: 5, name: 142 },
				{ x: 4, y: 5, name: 143 },
				{ x: 5, y: 5, name: 144 },
				{ x: 6, y: 5, name: 145 },
				{ x: 1, y: 6, name: 146 },
				{ x: 2, y: 6, name: 147 },
				{ x: 3, y: 6, name: 148 },
				{ x: 4, y: 6, name: 149 },
				{ x: 5, y: 6, name: 150 },
				{ x: 6, y: 6, name: 151 },
				{ x: 1, y: 7, name: 152 },
				{ x: 2, y: 7, name: 153 },
				{ x: 3, y: 7, name: 154 },
				{ x: 4, y: 7, name: 155 },
				{ x: 5, y: 7, name: 156 },
				{ x: 6, y: 7, name: 157 },
				{ x: 7, y: 7, name: 172 },
				{ x: 1, y: 8, name: 158 },
				{ x: 2, y: 8, name: 159 },
				{ x: 3, y: 8, name: 160 },
				{ x: 4, y: 8, name: 161 },
				{ x: 5, y: 8, name: 162 },
				{ x: 6, y: 8, name: 163 },
				{ x: 7, y: 8, name: 171 },
				{ x: 1, y: 9, name: 164 },
				{ x: 2, y: 9, name: 165 },
				{ x: 3, y: 9, name: 166 },
				{ x: 4, y: 9, name: 167 },
				{ x: 5, y: 9, name: 168 },
				{ x: 6, y: 9, name: 169 },
				{ x: 7, y: 9, name: 170 },
			],
			borderWidth: 100, // 格子边长
			preCoordinate: {}, // 前一个坐标
			// 小车的移动轨迹
			carTrajectories: [
				{ x: 1, y: 1 },
				{ x: 4, y: 2 },
				/* { x: 4, y: 2 },
				{ x: 4, y: 3 },
				{ x: 5, y: 3 },
				{ x: 6, y: 3 },
				{ x: 4, y: 3 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 6, y: 5 },
				{ x: 4, y: 5 },
				{ x: 2, y: 5 }, */
			],
			speed: 3, // 移动速度
			carLeft: 0, // 车子左上角x 起始位置
			carTop: 0, // 车子左上角Y 起始位置
			movedDistance: 0, // 车子已移动距离
			xMoving: false, // 是否正在水平移动
			yMoving: false, // 是否正在垂直移动
		};
	},
	mounted () {
		this.init();
	},
	methods: {
		xMove () {

		},
		init () {
			const car = document.querySelector('#car');
			this.carLeft = this.carTrajectories[0].x * this.borderWidth;
			this.carTop = this.carTrajectories[0].y * this.borderWidth;
			car.style.left = `${this.carTrajectories[0].x * this.borderWidth}px`;
			car.style.top = `${this.carTrajectories[0].y * this.borderWidth}px`;
			this.preCoordinate = this.carTrajectories[0];
			this.carTrajectories.shift();
			let stepDistance = 0, // 两个相邻坐标之间的距离
				stepPxDistance = 0; // 两个相邻坐标之间的像素距离;
			const interval = setInterval(() => {
				// 水平运动
				if (this.carTrajectories[0].x !== this.preCoordinate.x) {
					stepDistance = Math.abs(this.carTrajectories[0].x - this.preCoordinate.x);
					stepPxDistance = stepDistance * this.borderWidth;
					this.movedDistance += this.speed;
					if (this.carTrajectories[0].x > this.preCoordinate.x) {
						this.carLeft += this.speed;
						if (this.movedDistance > stepPxDistance) {
							this.carLeft = this.carLeft - (this.movedDistance - stepPxDistance);
						}
					} else {
						this.carLeft -= this.speed;
						if (this.movedDistance > stepPxDistance) {
							this.carLeft = this.carLeft + (this.movedDistance - stepPxDistance);
						}
					}
					car.style.left = `${this.carLeft}px`;
				}
				// 垂直运动
				else if (this.carTrajectories[0].y !== this.preCoordinate.y) {
					stepDistance = Math.abs(this.carTrajectories[0].y - this.preCoordinate.y);
					stepPxDistance = stepDistance * this.borderWidth;
					this.movedDistance += this.speed;
					if (this.carTrajectories[0].y > this.preCoordinate.y) {
						this.carTop += this.speed;
						if (this.movedDistance > stepPxDistance) {
							this.carTop = this.carTop - (this.movedDistance - stepPxDistance);
						}
					} else {
						this.carTop -= this.speed;
						if (this.movedDistance > stepPxDistance) {
							this.carTop = this.carTop + (this.movedDistance - stepPxDistance);
						}
					}
					car.style.top = `${this.carTop}px`;
				}
				if (this.movedDistance > stepPxDistance) {
					this.preCoordinate = this.carTrajectories[0];
					this.movedDistance = 0;
					this.carTrajectories.shift();
				}
				if (this.carTrajectories.length === 0) {
					clearInterval(interval);
				}
			}, Math.floor(this.borderWidth / this.speed));
		}
	}
};
</script>
<style lang="scss" scoped>
    .car-canvas {
        width: 100vw;
        height: 100vh;
        position: relative;
        font-size: 16px;
        .guodao {
            border: none !important;
            background: greenyellow !important;
        }
        .huojia {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: var(--borderWidth);
            height: var(--borderWidth);
            background-color: #ccc;
            border: 1px solid #000;
            box-sizing: border-box;
            &.active {
                background-color: #f00
            }
        }
        .car {
            width: var(--borderWidth);
            height: var(--borderWidth);
            background-color: red;
            position: absolute;
        }
    }
</style>