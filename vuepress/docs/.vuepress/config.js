module.exports = {
    base: "/vuepress/docs/.vuepress/dist/", // 这个相当于 vue.config.js 中的 publicPath 配置
    theme: '',
    title: 'VuePress + Element',
    description: 'VuePress搭建Element的组件库文档教程示例代码',
    port: 8080,
    themeConfig: {
        smoothScroll: true,
        logo: '/imgs/img10.jpg',
        nav: [
            {
                text: '首页',
                link: '/'
            },
            {
                text: '组件',
                link: '/comps/'
            }
        ],
        sidebar: {
            '/comps/': [
                {
                    title: '首页',
                    collapsable: true,
                    children: [
                        '',
                        '示例来源'
                    ]
                },
                {
                    title: 'Select 选择器',
                    collapsable: true,
                    children: [
                        'select'
                    ]
                }
            ]
        }
    },
    head: [],
    plugins: ['demo-container'],
    markdown: {}
}