import Subsub from "./Subsub.js";


export default Vue.component('ComponentContainer', {
    component: { 
        DynamicScroller: VueVirtualScroller.DynamicScroller,
        Subsub
    },
    data () {
        return {
            list: []
        };
    },
    created () {
        for (let i = 0; i < 1000; i++) {
            this.list.push({ id: i, name: `John Doe - ${i}` });
        }
    },
    template: /*html*/`
        <div class="scroll-container level-2">
            <link rel="stylesheet" href="MainContainer.css">
            <div class="line top" style="--level: '二级容器'"></div>
            <h2>Hello World -- <i style="color: deeppink;">这里是子组件</i></h2>
            <Subsub />
            <DynamicScroller
                class="scroller"
                :items="list"
                :item-size="62"
                :buffer="20"
                key-field="id"
                v-slot="{ item }"
            >
                <div class="user">
                    {{ item.name }}<h1> - {{item.id}}</h1>
                </div>
            </DynamicScroller>
            <div class="line bottom"></div>
        </div>
    `
});