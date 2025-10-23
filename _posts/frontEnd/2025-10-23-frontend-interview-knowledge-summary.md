---
title: HTML篇
date: 2025-10-23
author:       "lvwa"
header-style: text
date:         2025-04-29 12:00:01
catalog:      true
tags:
    - frontEnd
---

### 前端面试必备知识点总结

在准备前端面试时，掌握一些关键的HTML5知识点是非常重要的。本文将为你总结一些常见的面试题及其答案，帮助你更好地准备面试。

## HTML5 语义化标签

**对HTML语义化的理解**

语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）。通俗来讲就是用正确的标签做正确的事情。

- **优点**：
  - 对机器友好，适合搜索引擎爬取有效信息，有利于SEO。
  - 对开发者友好，增强可读性，便于团队开发与维护。

- **常见语义化标签**：
  - `header`：定义文档的页眉。
  - `nav`：定义导航链接的部分。
  - `footer`：定义文档或节的页脚。
  - `article`：定义文章内容。
  - `section`：定义文档中的节。
  - `aside`：定义其所处内容之外的内容（侧边）。

## src 和 href 的区别

- **src**：用于替换当前元素，指向外部资源的位置，例如 `<img>`、`<script>` 等。浏览器会暂停其他资源的下载和处理，直到该资源加载完毕。
- **href**：用于在当前文档和引用资源之间确立联系，例如 `<a>`、`<link>` 等。浏览器会并行下载资源，并不会停止对当前文档的处理。

## DOCTYPE(文档类型)的作用

DOCTYPE是HTML5中一种标准通用标记语言的文档类型声明，它的目的是告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档。不同的渲染模式会影响浏览器对 CSS 代码甚至 JavaScript 脚本的解析。

- **标准模式 (CSS1Compat)**：浏览器使用W3C的标准解析渲染页面。
- **怪异模式 (BackCompat)**：浏览器使用自己的怪异模式解析渲染页面。

## script标签中defer和async的区别

- **defer**：多个带defer属性的标签，按照加载顺序执行；加载后续文档的过程和js脚本的加载（此时仅加载不执行）是并行进行的，js脚本需要等到文档所有元素解析完成之后才执行。
- **async**：多个带async属性的标签，不能保证加载的顺序；后续文档的加载和执行与js脚本的加载和执行是并行进行的，即异步执行。

## 常用的meta标签

- **charset**：描述HTML文档的编码类型。
- **keywords**：页面关键词。
- **description**：页面描述。
- **refresh**：页面重定向和刷新。
- **viewport**：适配移动端，可以控制视口的大小和比例。
- **搜索引擎索引方式**：all, none, index, follow, noindex, nofollow。

## HTML5有哪些更新

- **语义化标签**：新增了`header`, `nav`, `footer`, `aside`, `section`, `article`等标签。
- **媒体标签**：新增了`audio`和`video`标签。
- **表单**：新增了多种输入类型如`email`, `url`, `number`等。
- **进度条、度量器**：新增了`progress`和`meter`标签。
- **DOM查询操作**：新增了`document.querySelector()`和`document.querySelectorAll()`方法。
- **Web存储**：新增了`localStorage`和`sessionStorage`。
- **其他**：新增了拖放、画布（canvas）、地理定位等功能。

## img的srcset属性的作用

响应式页面中经常用到根据屏幕密度设置不同的图片。`srcset`属性用于设置不同屏幕密度下，`<img>` 会自动加载不同的图片。

```html
<img src="image-128.png" srcset="image-128.png 1x, image-256.png 2x" alt="Responsive Image">
```

## 行内元素与块级元素

- **行内元素**：`a`, `b`, `span`, `img`, `input`, `select`, `strong`。
- **块级元素**：`div`, `ul`, `ol`, `li`, `dl`, `dt`, `dd`, `h1`~`h6`, `p`。

## web worker

web worker 是运行在后台的 js，独立于其他脚本，不会影响页面的性能。通过 `postMessage` 将结果回传到主线程。

## HTML5的离线储存

离线存储指的是在用户没有与因特网连接时，可以正常访问站点或应用。基于一个新建的 `.appcache` 文件的缓存机制，通过这个文件上的解析清单离线存储资源。

- **创建 manifest 文件**：
  ```html
  <html manifest="cache.manifest">
  ```

- **编写 cache.manifest 文件**：
  ```manifest
  CACHE MANIFEST
  # v1.0
  CACHE:
  index.html
  styles.css
  scripts.js
  NETWORK:
  network.html
  FALLBACK:
  / offline.html
  ```

- **更新缓存**：
  - 更新 manifest 文件。
  - 通过 JavaScript 操作。
  - 清除浏览器缓存。

## title与h1的区别、b与strong的区别、i与em的区别

- **title**：表示标题，无明确意义。
- **h1**：表示层次明确的标题，对页面信息抓取有很大影响。
- **b**：简单加粗标签。
- **strong**：有语义，起到加重语气的效果。
- **i**：内容展示为斜体。
- **em**：表示强调的文本。

## iframe 有那些优点和缺点

- **优点**：
  - 加载速度较慢的内容（如广告）。
  - 可以使脚本并行下载。
  - 实现跨子域通信。

- **缺点**：
  - 阻塞主页面的 `onload` 事件。
  - 无法被一些搜索引擎识别。
  - 产生很多页面，不容易管理。

## label 的作用是什么？如何使用？

`label` 标签用来定义表单控件的关系。当用户选择 `label` 标签时，浏览器会自动将焦点转到和 `label` 标签相关的表单控件上。

- **使用方法1**：
  ```html
  <label for="username">用户名</label>
  <input type="text" id="username">
  ```

- **使用方法2**：
  ```html
  <label>用户名 <input type="text" id="username"></label>
  ```

## Canvas和SVG的区别

- **SVG**：
  - 基于XML，每个元素都是可用的。
  - 不依赖分辨率。
  - 支持事件处理器。
  - 最适合带有大型渲染区域的应用程序。

- **Canvas**：
  - 通过JavaScript绘制2D图形。
  - 依赖分辨率。
  - 不支持事件处理器。
  - 弱的文本渲染能力。
  - 最适合图像密集型的游戏。

## head 标签有什么作用，其中什么标签必不可少？

`<head>` 标签用于定义文档的头部，它是所有头部元素的容器。`<title>` 定义文档的标题，是 head 部分中唯一必需的元素。

## 文档声明（Doctype）和<!Doctype html>有何作用? 严格模式与混杂模式如何区分？

- **文档声明**：告诉浏览器当前HTML文档使用什么版本的HTML来写的。
- **<!Doctype html>**：让浏览器进入标准模式，使用最新的 HTML5 标准来解析渲染页面。
- **严格模式**：浏览器按照W3C标准解析代码。
- **混杂模式**：浏览器用自己的方式解析代码。

## 浏览器乱码的原因是什么？如何解决？

- **原因**：
  - 网页源代码和内容编码不一致。
  - 数据库编码和网页编码不一致。
  - 浏览器不能自动检测网页编码。

- **解决办法**：
  - 使用软件编辑HTML网页内容。
  - 程序查询数据库数据显示数据前进程序转码。
  - 在浏览器中转换编码。

## 渐进增强和优雅降级之间的区别

- **渐进增强**：从基础功能开始，逐步增加高级功能。
- **优雅降级**：一开始就构建完整的功能，再针对低版本浏览器进行兼容。

## HTML5 drag API

- **dragstart**：开始拖放时触发。
- **drag**：正在拖放时触发。
- **dragenter**：进入目标元素时触发。
- **dragover**：在目标元素内移动时触发。
- **dragleave**：移出目标元素时触发。
- **drop**：完全接受被拖放元素时触发。
- **dragend**：整个拖放操作结束时触发。

希望这些知识点能帮助你在前端面试中取得好成绩！