<template>
	<div class="right-menu">
		<ContextMenu
			:menus="menus1"
			@menuClick="handleMenuClick($event, 'chosedMenu1')"
		>
			<div class="block1 block">
				<h1>menu1</h1>
				<p>选中的菜单：{{ chosedMenu1 }}</p>
			</div>
		</ContextMenu>
		<ContextMenu
			:menus="menus2"
			@menuClick="handleMenuClick($event, 'chosedMenu2')"
		>
			<div class="block2 block">
				<h1>menu2</h1>
				<p>选中的菜单：{{ chosedMenu2 }}</p>
				<ContextMenu
					:menus="menus3"
					@menuClick="handleMenuClick($event, 'chosedMenu3')"
				>
					<div class="block3 block">
						<h1>menu3</h1>
						<p>选中的菜单：{{ chosedMenu3 }}</p>
					</div>
				</ContextMenu>
			</div>
		</ContextMenu>
	</div>
</template>
<script>
import ContextMenu from "../components/ContextMenu.vue";

export default {
	name: "RightClick",
	components: {
		ContextMenu
	},
	data () {
		return {
			menus1: [
				{ label: "菜单1-1" },
				{ label: "菜单1-2" },
				{ label: "菜单1-3" },
				{ label: "菜单1-4" },
			],
			menus2: [
				{ label: "菜单2-1" },
				{ label: "菜单2-2" },
				{ label: "菜单2-3" },
				{ label: "菜单2-4" },
			],
			menus3: [
				{
					label: "菜单3-1",
					click: () => {
						console.log("菜单3-1");
					}
				},
				{
					label: "菜单3-2",
					click: () =>{
						console.log("菜单3-2");
					}
				}
			],
			chosedMenu1: '',
			chosedMenu2: '',
			chosedMenu3: ''
		};
	},
	methods: {
		handleMenuClick (menu, chosedMenu) {
			this[chosedMenu] = menu.label;
		}
	}
};
</script>
<style lang="scss" scoped>
    .right-menu {
        color: #fff;
        font-size: 16px;
    }
    .right-menu {
        display: flex;
        gap: 40px;
    }
    .block {
        border-radius: 5px;
    }
    .block1 {
        width: 200px;
        height: 200px;
        background-color: red;
    }
    .block2 {
        width: 400px;
        height: 400px;
        background-color: blue;
    }
    .block3 {
        width: 200px;
        height: 200px;
        background-color: green;
    }
</style>