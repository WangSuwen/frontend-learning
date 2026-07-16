import Vue from 'vue';
import App from './App.vue';
import router from './router';
import FileViewer from '@file-viewer/vue2.7';

Vue.use(FileViewer);

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app');
