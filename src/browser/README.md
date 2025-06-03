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

## Node 类型

Node（最基础） 定位：所有 DOM 节点的基类，包含类型：

https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node.element_node

* Node.ELEMENT_NODE:  An Element node like <p> or <div>.
* Node.ATTRIBUTE_NODE:  An Attribute of an Element.
* Node.TEXT_NODE:  The actual Text inside an Element or Attr.
* Node.CDATA_SECTION_NODE:  A CDATASection, such as <!CDATA[[ … ]]>
* Node.PROCESSING_INSTRUCTION_NODE:  A ProcessingInstruction of an XML document, such as <?xml-stylesheet … ?>.
* Node.COMMENT_NODE:  A Comment node, such as <!-- … -->.
* Node.DOCUMENT_NODE:  A DocumentType node, such as <!doctype html>.
* Node.DOCUMENT_FRAGMENT_NODE:  A DocumentFragment node.