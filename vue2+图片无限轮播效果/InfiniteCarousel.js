
export default Vue.component('InfiniteCarousel', {
    template: /*html*/`
        <div
            class="infinite-carousel"
            :style="{ width: width, height: height }"
            @mouseenter="pauseAutoPlay"
            @mouseleave="startAutoPlay"
        >
            <div
                class="carousel-track"
                :style="trackStyle"
                @transitionend="handleTransitionEnd"
            >
                <div
                    v-for="(item, index) in renderList"
                    :key="index"
                    class="carousel-item"
                >
                    <img :src="item" class="carousel-img" :style="{width}" />
                </div>
            </div>
            <div class="carousel-arrow carousel-arrow-left" @click="prev">‹</div>
            <div class="carousel-arrow carousel-arrow-right" @click="next">›</div>
            <div class="carousel-dots">
                <span
                    v-for="(item, index) in images"
                    :key="index"
                    class="carousel-dot"
                    :class="{ active: realIndex === index }"
                    @click="goTo(index)"
                />
            </div>
        </div>
    `,
    props: {
        images: {
        type: Array,
        default: () => []
        },
        width: {
        type: String,
        default: '600px'
        },
        height: {
        type: String,
        default: '300px'
        },
        autoplay: {
        type: Boolean,
        default: true
        },
        interval: {
        type: Number,
        default: 3000
        },
        duration: {
        type: Number,
        default: 400
        }
    },
    data() {
        return {
        currentIndex: 1,
        enableTransition: true,
        timer: null,
        isMoving: false
        }
    },
    computed: {
        renderList() {
            if (!this.images.length) return []
            const first = this.images[0]
            const last = this.images[this.images.length - 1]
            return [last, ...this.images, first]
        },
        trackStyle() {
            return {
                width: `${this.renderList.length * 100}%`,
                transform: `translateX(-${this.currentIndex * (100 / this.renderList.length)}%)`,
                transition: this.enableTransition ? `transform ${this.duration}ms ease` : 'none'
            }
        },
        realIndex() {
            const length = this.images.length
            if (!length) return 0
            if (this.currentIndex === 0) {
                return length - 1
            }
            if (this.currentIndex === length + 1) {
                return 0
            }
            return this.currentIndex - 1
        }
    },
    mounted() {
        this.startAutoPlay()
    },
    beforeDestroy() {
        this.pauseAutoPlay()
    },
    methods: {
        next() {
            if (this.isMoving || this.images.length <= 1) return
            this.isMoving = true
            this.enableTransition = true
            this.currentIndex += 1
        },
        prev() {
            if (this.isMoving || this.images.length <= 1) return
            this.isMoving = true
            this.enableTransition = true
            this.currentIndex -= 1
        },
        goTo(index) {
            if (this.isMoving) return
            this.isMoving = true
            this.enableTransition = true
            this.currentIndex = index + 1
        },
        handleTransitionEnd() {
            const length = this.images.length
            if (this.currentIndex === length + 1) {
                this.enableTransition = false
                this.currentIndex = 1
            }
            if (this.currentIndex === 0) {
                this.enableTransition = false
                this.currentIndex = length
            }
            this.isMoving = false
        },
        startAutoPlay() {
            if (!this.autoplay || this.images.length <= 1) return
            this.pauseAutoPlay()
            this.timer = setInterval(() => {
                this.next()
            }, this.interval)
        },
        pauseAutoPlay() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        }
    },
    watch: {
        images() {
            this.pauseAutoPlay()
            this.currentIndex = 1
            this.enableTransition = false
            this.$nextTick(() => {
                this.enableTransition = true
                this.startAutoPlay()
            })
        }
    }
});