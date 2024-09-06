<template>
    <div>
        <Swiper
            :slidesPerView="3"
            :navigation="true"
            :loop="true"
            :modules="modules"
            class="mySwiper"
            @swiper="onSwiper"
            @activeIndexChange="onSlideChange"
        >
            <SwiperSlide
				v-for="(item, index) in slides"
				:key="index"
			>
                <div class="arrowbox" :class="{active: index === realIndex}"></div>
                <div class="role" :style="{'--img': `url(${rolesImg[index]})`}"></div>
			</SwiperSlide>
        </Swiper>
    </div>
</template>

<script>
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import 'swiper/css';
    import 'swiper/css/pagination';
    import 'swiper/css/navigation';
    import { Pagination, Navigation } from 'swiper/modules';

export default {
    name: 'App',
    components: {
        Swiper,
        SwiperSlide,
    },
    data () {
        return {
            slides: [],
            rolesImg: [
                'https://zxsj.wanmei.com/images/cover240114/qingyun_p_w.jpg?v=1',
                'https://zxsj.wanmei.com/images/cover240114/guiwang_p_w.jpg?v=1',
                'https://zxsj.wanmei.com/images/cover240114/hehuan_p_w.jpg?v=1',
                'https://zxsj.wanmei.com/images/cover240114/lingxi_p_lw.jpg?v=1',
                'https://zxsj.wanmei.com/images/cover240114/fenxiang_p_w.jpg?v=1',
            ],
            modules: [Pagination, Navigation],
            swiperInity: null,
            realIndex: 0
        };
    },
    created () {
		this.slides = Array.from({ length: 5 }).map((_, index) => `Slide ${index + 1}`);
	},
    mounted () {
        
    },
    methods: {
        onSlideChange (item) {
            console.log(item);
            this.realIndex = item.realIndex;
        },
        onSwiper (swiper) {
            this.swiperInity = swiper;
            swiper.slideTo(5, 0, false);
            this.realIndex = 5;
        },
    }
}
</script>

<style lang="scss" scoped>
    ::v-deep(.swiper-button-prev) {
        width: 1.7rem;
        height: 1.4rem;
        background: url(https://zxsj.wanmei.com/images/cover231129/vocation_pre.png) no-repeat;
        background-size: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 50%;
        margin: 0 0 0 -6rem;
        color: unset;
    }
    ::v-deep(.swiper-button-next) {
        color: unset;
        width: 1.7rem;
        height: 1.4rem;
        background: url(https://zxsj.wanmei.com/images/cover231129/vocation_next.png) no-repeat;
        background-size: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 50%;
        margin: 0 0 0 4.3rem;
    }
    .swiper-slide {
        width: 7.09rem !important;
        height: 8.93rem !important;
        margin: 0 1rem 0;
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .arrowbox {
            width: 13.36rem;
            height: 8.05rem;
            background: url(https://zxsj.wanmei.com/images/cover231129/arrowbox.png) no-repeat;
            background-size: 100%;
            position: absolute;
            left: 50%;
            margin: 0 0 0 -6.68rem;
            z-index: -1;
            display: none;
            &.active {
                display: block !important;
            }
        }
        .role {
            background: var(--img);
            width: 100%;
            height: 100%;
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat
        }
    }
</style>
