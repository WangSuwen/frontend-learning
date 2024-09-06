<template>
	<div>
		<div class="swiper1">
			<div class="swiper-wrapper">
				<div
					v-for="(item, index) in slides"
					:key="index"
					class="swiper-slide swiper-no-swiping"
				>
					<div class="role" :style="{'--img': `url(${rolesImg[index]})`}"></div>
				</div>
			</div>
			<div class="swiper-button swiper-button-prev" @click="prevSwiperSlide"></div>
			<div class="swiper-button swiper-button-next" @click="nextSwiperSlide"></div>
		</div>
	</div>
</template>
<script>
import Swiper, { Navigation } from 'swiper';
import 'swiper/swiper.css';
import 'swiper/css/pagination';


// import required modules
export default {
	data: function() {
		return {
			slides: [],
			modules: [Navigation],
			rolesImg: [
				'https://zxsj.wanmei.com/images/cover240114/qingyun_p_w.jpg?v=1',
				'https://zxsj.wanmei.com/images/cover240114/guiwang_p_w.jpg?v=1',
				'https://zxsj.wanmei.com/images/cover240114/hehuan_p_w.jpg?v=1',
				'https://zxsj.wanmei.com/images/cover240114/lingxi_p_lw.jpg?v=1',
				'https://zxsj.wanmei.com/images/cover240114/fenxiang_p_w.jpg?v=1',
			],
			swiper1: null,
			swiperIntity: null
		};
	},
	created () {
		this.slides = Array.from({ length: 5 }).map((_, index) => `Slide ${index + 1}`);
	},
	mounted () {
		this.initSwiper();
	},
	methods: {
		prevSwiperSlide () {
			this.swiperIntity.slidePrev();
		},
		nextSwiperSlide () {
			this.swiperIntity.slideNext();
		},
		initSwiper () {
			const that = this;
			this.swiper1 = new Swiper('.swiper1', {
				noSwiping: true,
				/* allowSlideNext: true,
				allowSlidePrev: true, */
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				slidesPerView: 3,
				loop: true,
				modules: [Navigation],
				on: {
					init (swiper) {
						that.swiperIntity = swiper;
						swiper.slideTo(5, 0, false);
						console.log(swiper.realIndex);
					},
					/* slideChange (swiper) {
						if (swiper.realIndex === 0) {
							swiper.slideTo(1, 0, false);
						} else if (swiper.realIndex === 4){}
					} */
				}
			});
		},
	}
};
</script>
<style lang="scss" scoped>
    @use 'sass:math';
    .swiper1 {
        position: relative;
        .swiper-wrapper {
            display: flex;
            .swiper-slide {
                width: 7.09rem !important;
                height: 8.93rem !important;
                margin: 0 1rem 0;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                .role {
                    background: var(--img);
                    width: 100%;
                    height: 100%;
                    background-size: 100%;
                    background-position: center;
                    background-repeat: no-repeat
                }
            }
        }
        .swiper-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            cursor: pointer;;
        }
        .swiper-button-prev {
            width: 20px;
            height: 20px;
            left: 50%;
            background-color: green;
        }
        .swiper-button-next {
            right: 0;
            width: 20px;
            height: 20px;
            margin-left: 1rem;
            background-color: red;
        }
    }
</style>