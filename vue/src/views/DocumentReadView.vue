<template>
	<div style="height: 100vh">
		<div class="flex align-center gap-20">
			<input type="file" @change="onChange" />
			<div class="flex align-center gap-10">
				<button class="btn btn-primary" @click="onZoom(0.3)">放大</button>
				<button class="btn btn-primary" @click="onZoom(-0.3)">缩小</button>
			</div>
		</div>
		<div style="height: calc(100vh - 40px)">
			<file-viewer :file="file" :options="options" />
		</div>
	</div>
</template>
<script>
import officePreset from '@file-viewer/preset-office';

export default {
	name: 'DocumentReadView',

	data() {
		return {
			file: undefined,
			zoom: 1,
			options: {
				theme: 'light',
				preset: officePreset,
				rendererMode: 'replace',
				toolbar: { position: 'bottom-right' },
				watermark: { text: '内部预览', opacity: 0.14 },
				archive: {
					cache: true,
					workerTimeoutMs: 30000
				}
			}
		};
	},
	methods: {
		onChange(event) {
			const value = event.target.files && event.target.files.item(0);
			if (value) {
				this.file = value;
			}
		},
		onZoom(zoom) {
			const section = document.querySelector('section.docx');
			if (section) {
				section.style.transform = `translateX(-50%) scale(${this.zoom = this.zoom + zoom})`;
			}
		}
	}
};
</script>
<style scoped lang="scss">
.flex { display: flex; }
.align-center { align-items: center; }
.gap-10 { gap: 10px; }
.gap-20 { gap: 20px; }
</style>