module.exports = {
	root: true,
	parserOptions: {
		parser: "babel-eslint"
	},
	env: {
		browser: true
	},
	extends: [
		"plugin:vue/essential"
	],
	plugins: ["vue"],
	rules: {
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: []
			}
		],
		indent: ['error', 'tab'],
		"space-before-function-paren": 0,
		"generator-star-spacing": "off",
		"comma-dangle": "off",
		"camelcase": "off",
		"no-tabs": "off",
		semi: [2, 'always'],
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		'vue/multi-word-component-names': 'off'
	}
};