<template>
	<div class="context-menu-wrapper">
		<div ref="contextMenuWrapper">
			<slot></slot>
		</div>
		<!-- <Teleport to="body"> -->
		<Transition @beforeEnter="handleBeforeEnter" @enter="handleEnter" @afterEnter="handleAfter">
			<div v-if="shouMenu" class="context-menu" :style="{ left: x + 'px', top: y + 'px' }">
				<div class="menu-list">
					<div
						class="menu-item"
						v-for="(item, index) in menus"
						:key="index"
						@click="menuClick(item)"
					>
						{{item.label}}
					</div>
				</div>
			</div>
		</Transition>
		<!-- </Teleport> -->
	</div>
</template>
<script>
export default {
	name: "ContextMenu",
	props: {
		menus: {
			type: Array,
			default: () => []
		}
	},
	data () {
		return {
			shouMenu: false,
			x: 0,
			y: 0
		};
	},
	mounted () {
		this.$refs.contextMenuWrapper.addEventListener('contextmenu', this.handleContextMenu);
		window.addEventListener('click', this.closeMenu);
		window.addEventListener('contextmenu', this.closeMenu, true);
	},
	unmounted () {
		this.$refs.contextMenuWrapper.removeEventListener('contextmenu', this.handleContextMenu);
		window.removeEventListener('click', this.closeMenu);
		window.removeEventListener('contextmenu', this.closeMenu);
	},
	methods: {
		handleBeforeEnter (el) {
			el.style.height = '0';
		},
		handleEnter (el) {
			el.style.height = 'auto';
			const h = el.clientHeight;
			el.style.height = 0;
			requestAnimationFrame(() => {
				el.style.height = h + 'px';
				el.style.transition = 'height 0.2s ease-in-out';
			});
		},
		handleAfter (el) {
			el.style.transition = 'none';
		},
		closeMenu (e) {
			// if (this.$refs.contextMenuWrapper.contains(e.target)) {
			this.shouMenu = false;
			// }
		},
		handleContextMenu (e) {
			e.preventDefault();
			e.stopPropagation();
			this.x = e.clientX;
			this.y = e.clientY;
			this.shouMenu = true;
		},
		menuClick (item) {
			this.$emit('menuClick', item);
			this.shouMenu = false;
		}
	}
};
</script>
<style lang="scss" scoped>
    .context-menu-wrapper {
        display: inline-block;
    }
    .context-menu {
        position: fixed;
        background-color: #FFFFFF;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2), 1px 1px 5px rgba(0, 0, 0, 0.2);
        min-width: 100px;
        font-size: 12px;
        border-radius: 5px;
        color: #1d1d1f;
        line-height: 1.8;
        white-space: nowrap;
        overflow: hidden;
        z-index: 9999;
        .menu-list {
            .menu-item {
                font-size: 16px;
                padding: 10px 20px;
                cursor: pointer;
                &:hover {
                    color: #FFFFFF;
                    background-color: purple;
                }
            }
        }
    }
</style>