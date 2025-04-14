---
layout:       post
title:        "WebSocket协议"
author:       "lvwa"
header-style: text
catalog:      true
date: 2025-04-14 12:00:00
tags:
    - network
---
> 本文参考 [High Performance Browser Networking](https://hpbn.co/)，获取更多详细内容请查看原文。

### 理解WebSocket协议
WebSocket是一种能够实现客户端与服务器之间双向、面向消息的流式传输的协议。它对比传统的HTTP请求具有更高的实时性能，适合需要快速交互的应用场景。通过WebSocket，用户可以在浏览器和服务器之间迅速交换文本和二进制数据。

WebSocket的设计考虑了许多核心要素，例如连接时的协商、同源策略的维护，确保与现有的HTTP系统的兼容，以及灵活的消息传递框架。其双向的传输方式使开发者能够在一个简单的API下方便地实现从JSON到自定义的二进制格式的任意数据传输。

尽管WebSocket强大而灵活，但开发者需要清楚，使用自定义协议带来的挑战，如状态管理、压缩和缓存等同样需要考虑。在应用设计时，保持这些权衡能够帮助实现最佳的性能。

WebSocket实际上是包含多个标准的集合：WebSocket API由W3C定义，而WebSocket协议本身（RFC 6455）则是由HyBi工作组提出的规范。

### WebSocket API的特点
WebSocket API的结构简单易懂，能够帮助开发者轻松处理连接的建立和消息的处理。它使得创建WebSocket连接只需要指定URL以及设置一些回调函数即可，如：

```javascript
var ws = new WebSocket('wss://example.com/socket');
ws.onerror = function(error) { /* 错误处理... */ }; 
ws.onclose = function() { /* 连接终止处理... */ }; 
ws.onopen = function() { ws.send('连接已建立，您好服务器！'); }; 
ws.onmessage = function(msg) { 
  if (msg.data instanceof Blob) { /* Blob处理逻辑 */ }
  else { /* 文本处理逻辑 */ }
};
```

这样的API不仅仅是简单的实现，更让开发者感受到WebSocket的便捷。例如，在打开安全的WebSocket连接时，常用的`wss`协议和`ws`协议分别用于加密和非加密的数据传输。

WebSocket在处理接收到的消息时，不会对有效负载进行严格的限制，文本和二进制数据都可以方便地处理，而浏览器会自动将接收到的数据转换为易于操作的格式，如DOMString或者Blob对象。

### 消息的发送与接收
一旦WebSocket连接建立后，客户端能够随时发送和接收UTF-8编码的消息和二进制数据。双向通信的功能为应用程序带来了更高的灵活性，例如：

```javascript
ws.onopen = function() {
  ws.send('Hello, 服务器！'); 
  ws.send(JSON.stringify({'msg':'有效载荷'}));
  var buffer = new ArrayBuffer(128);
  ws.send(buffer);  
};
```

这段代码展示了WebSocket如何同时支持文本和二进制数据的传输。需要注意的是，发送的所有数据都是异步处理的，使用`bufferedAmount`属性可以帮助了解当前的缓冲数据量，确保后续消息能够顺利发送。

### 子协议协商的灵活性
WebSocket允许客户端与服务器之间进行子协议的协商，使得在消息中也能够包含额外的元数据。这一特性使得两者能够针对特定需求达成一致：如通过JSON编码的数据或特定二进制格式进行通讯。在连接的建立过程中，客户端可以告知服务器它所支持的协议，服务器则会选择其中一个进行后续的通讯。

```javascript
var ws = new WebSocket('wss://example.com/socket', ['appProtocol', 'appProtocol-v2']);
ws.onopen = function() { /* ... */ };
```
### 区别
WebSocket是唯一允许通过相同传输控制协议bidirectionalcommunication的传输（图17-2）：客户端和服务器可以随意交换消息。因此，WebSocket提供双向文本和二进制应用程序数据的低延迟传递。

XHR针对“事务性”request-responsecommunication进行了优化：客户端向服务器发送完整的、格式良好的HTTP请求，服务器以完整的响应进行响应。不支持请求流，在Streams API可用之前，没有可靠的跨浏览器响应流API。

SSE支持基于文本的数据的高效、低延迟的服务器到客户端流式传输：客户端启动SSE连接，服务器使用事件源协议将更新流式传输到客户端。在初始握手后，客户端无法向服务器发送任何数据。

![image](/img/2025-04-14/websocket.svg)

### 高效能的WebSocket性能
为了在客户端和服务器之间实现高效的传输，WebSocket采用了独特的机制，它是支持多种数据类型的流型协议，允许不止一种类型的数据传递。开发者需谨慎设计应用以优化性能，例如拆分大消息，合理控制缓冲数据，使用合适类型的二进制数据等。

此外，WebSocket还支持协议扩展，这意味着开发者可以在标准协议框架上通过新增操作码和字段来扩展其功能。这使得WebSocket在多变性和灵活性上体现出更大优势，使开发者可以针对具体应用场景来调整和优化其性能。

