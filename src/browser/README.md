# 浏览器特性

## Node 和 DOM 区别

DOM 提供更高级的 HTML 专用功能。DOM 树中的每个独立单元都是一个 Node，Node 更底层，适合处理所有类型的节点。

```typescript
const textNode = document.createTextNode('Hello')     // node
document.body.appendChild(textNode)


const div = document.createElement('div')   // DOM
div.textContent = 'Hello World'
div.style.color = 'red'
document.body.appendChild(div)
```