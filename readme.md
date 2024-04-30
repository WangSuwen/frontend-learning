# 前端学习项目
* 定义一个css变量
```css 
@property --a {
    syntax: '<angle>'; // 变量对应的css语法
    inherits: false; // 是否继承
    initial-value: 0deg; // 初始值
}
```
* 给css变量赋值
```html
    <span style="--index:12"><p>12</p></span>
```

* `document.createDocumentFragment`
```
创建文档DOM片段，默认放在内存中，所以下面代码中：
frag.appendChild(parent.children[Math.floor(Math.random() * parent.children.length)]);
的操作并不会导致DOM重排，因为此时frag是在内存中，而非dom树上，知道while 结束后，将frag append到parent中，才会将他们
重新渲染后dom中。
```

* `filter: drop-shadow(0 0 5px #39ffe2);`
https://www.zhangxinxu.com/wordpress/2016/05/css3-filter-drop-shadow-vs-box-shadow/
```
box-shadow:顾名思意“盒阴影”，只是盒子的阴影；你想啊，这盒子中间明明是透明的，结果，阴影的时候，居然光线没有穿透；

drop-shadow:就符合真实世界的投影，非透明的颜色，我就有投影；透明部分，光线穿过，没投影
```

* `transform: rotate(0deg)`

`rotate` 旋转默认是以Z轴（垂直于屏幕的轴）为中心，元素自己所在位置为圆心进行旋转；
`transform-origin: 100px; `
`transform-origin` 属性允许你改变被转换元素的圆心位置。上面示例表示将旋转圆心向右移动100px，所以元素旋转时就不在以自己为圆心了，而是以自己自有圆心向右移动100px的点为圆心，可以理解为：此时元素的旋转轨迹是：以元素右边100px位置处为圆心，100px为半径的圆弧