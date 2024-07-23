<template>
	<div class="home">
		<h1>水平滚动时间轴</h1>
		<horizontalTimelineVue />
	</div>
</template>

<script>
import horizontalTimelineVue from '../components/horizontal/index.vue';

export default {
	name: 'HomeView',
	components: { horizontalTimelineVue }
};
</script>
