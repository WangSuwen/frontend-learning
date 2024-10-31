import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SwipperView from '../views/SwipperView.vue';
import HorizontalTimeLine from '../views/HorizontalTimeLine.vue';
import RightClick from '../views/RightClick.vue';
import AutoScroll from '../views/auto-scroll.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/horizontal-time-line',
		name: 'horizontal-time-line',
		component: HorizontalTimeLine
	},
	{
		path: '/swipper',
		name: 'swipper',
		component: SwipperView
	},
	{
		path: '/right-click',
		name: 'RightClick',
		component: RightClick
	},
	{
		path: '/auto-scroll',
		name: 'AutoScroll',
		component: AutoScroll
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
