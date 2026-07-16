module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset' // 或者你自己项目的 presets
	],
	plugins: [
		// 🛠️ 关键：添加以下三个插件，让 Babel 支持私有属性和方法
		'@babel/plugin-transform-class-properties',
		'@babel/plugin-transform-private-methods',
		'@babel/plugin-transform-private-property-in-object',
		// 🛠️ 关键：加入此行，支持解析 class 内部的 static {} 静态块
		'@babel/plugin-transform-class-static-block'
	]
};