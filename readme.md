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