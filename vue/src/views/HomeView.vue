<template>
	<div class="home">
		<router-link to="/horizontal-time-line">水平滚动时间轴</router-link>
		<router-link to="/swipper">swipper</router-link>
		<router-link to="/right-click">自定义右键</router-link>
	</div>
</template>

<script>

export default {
	name: 'HomeView'
};
</script>
<style lang="scss" scoped>
    .home {
        display: flex;
        gap: 20px;
        a {
            font-size: 16px;
        }
    }
</style>
