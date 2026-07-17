import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';

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
		component: () => import(/* webpackChunkName: "horizontal-time-line" */ '../views/HorizontalTimeLine.vue')
	},
	{
		path: '/right-click',
		name: 'RightClick',
		component: () => import(/* webpackChunkName: "right-click" */ '../views/RightClick.vue')
	},
	{
		path: '/auto-scroll',
		name: 'AutoScroll',
		component: () => import(/* webpackChunkName: "auto-scroll" */ '../views/auto-scroll.vue')
	},
	{
		path: '/about',
		name: 'about',
		component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
	},
	{
		path: '/document-read',
		name: 'document-read',
		component: () => import(/* webpackChunkName: "document-read" */ '../views/DocumentReadView.vue'),
	}
];

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
});

export default router;
