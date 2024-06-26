// import Vue from '../node_modules/vue/dist/vue.runtime.esm.js'
import VueI18n from '../node_modules/vue-i18n/dist/vue-i18n.esm.js';
// 从语言包文件中导入语言包对象
import zh from './zh.mjs'
import en from './en.mjs'
// Vue.use(VueI18n)
const messages = {
    zh,
    en
}
const i18n = new VueI18n({
    messages,
    locale: 'zh'
})
export default {
    VueI18n,
    i18n,
};