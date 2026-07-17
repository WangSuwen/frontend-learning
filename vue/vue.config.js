const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const resolveApp = value => path.resolve(__dirname, value);
const resolvePackageRoot = packageName => path.dirname(require.resolve(`${packageName}/package.json`));
const resolvePackageFile = (packageName, relativePath) => path.join(resolvePackageRoot(packageName), relativePath);

module.exports = defineConfig({
	publicPath: './',
	transpileDependencies: [
		/@file-viewer/,
		/pdfjs-dist/,
		/e-virt-table/,
		/styled-exceljs/
	],
	chainWebpack: config => {
		// 上一次的禁用缓存配置（可选，但建议保留，防止缓存干扰）
		config.module.rule('vue').uses.delete('cache-loader');
		config.module.rule('js').uses.delete('cache-loader');
	},

	configureWebpack: config => {
		// 2. 强力覆盖开发环境下的 devtool 为 source-map (继续保留)
		if (process.env.NODE_ENV === 'development') {
			config.devtool = 'source-map';
		}

		// 3. 别名配置 (调整核心)
		config.resolve = {// A. 针对 Webpack 5+ 的 polyfill 回退配置
			fallback: {
				"fs": false,           // 告诉 Webpack 不要解析 fs
				"path": false,         // 如果报错报到 path，也可以一并设为 false
				"fs/promises": false,  // 明确对 fs/promises 设为 false// 1. 强行将 Node 的 'util' 模块重定向到我们刚才安装的纯前端 util npm包
				"util": require.resolve("util/"), 
				// 🛠️ 1. 在回退机制中将 zlib 重定向到浏览器版 zlib
				"zlib": require.resolve("browserify-zlib")
			},
			alias: {
				'@file-viewer/core/assets$': resolvePackageFile('@file-viewer/core', 'dist/assets.js'),
				'@file-viewer/core/browser$': resolvePackageFile('@file-viewer/core', 'dist/browser.js'),
				'@file-viewer/core/headless$': resolvePackageFile('@file-viewer/core', 'dist/headless.js'),
				'@file-viewer/docx$': resolvePackageFile('@file-viewer/docx', 'dist/docx-preview.mjs'),
                
				// 🛠️ 关键核心别名：
				// 不管 @file-viewer 内部怎么引用，强行将 'pdfjs-dist' 的入口
				// 指向其专门提供的兼容版本 legacy 目录下的 pdf.js
				'pdfjs-dist$': 'pdfjs-dist/legacy/build/pdf.js',
				'pdfjs-dist/build/pdf.mjs$': 'pdfjs-dist/legacy/build/pdf.js'
			},
			extensions: ['.js', '.vue', '.json', '.mjs']
		};

		// 4. 继续保留上次的 mjs 兼容配置
		if (!config.module.rules) config.module.rules = [];
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto'
		});
	}
});



