export default Vue.component('Subsub', {
    template: /*html*/`
        <div class="level-3" style="color: pink; font-size: 20px;">
            <div class="line top" style="--level: '三级容器'"></div>
            <span> 这里是 孙子组件 </span>
            <div class="line bottom"></div>
        </div>
    `
    // ...
})