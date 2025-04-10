---
layout:       post
title:        "TCP的组成部分"
subtitle:    "TCP的为什么是可靠的?"
author:       "lvwa"
header-style: text
date:       2025-03-11 12:00:00
catalog:      true
tags:
    - network
---

> 文章参考 [hpbn](https://hpbn.co/building-blocks-of-tcp/), 更多详细的内容可点击查看

### 网络协议的核心组成

在互联网的构架中，IP（互联网协议）和TCP（传输控制协议）是两个不可或缺的核心协议。IP负责主机之间的路由与寻址，而TCP则为那些不可靠的信道提供了一种可靠的通信方式的实现。这个广泛采用的TCP/IP协议栈最早是由Vint Cerf和Bob Kahn在1974年提出的，标志着现代网络的起点。

随着技术的演进，最初的提案经过了多次更新，最终在1981年作为两份独立的RFC发布了TCP/IP的第四版规范：

- RFC 791：规定了网络间的连接协议
- RFC 793：详细描述了传输控制协议的实现

尽管对TCP进行了各种优化与改进，但其核心机制始终保持稳定。如今，TCP已成为众多应用的首选协议，如万维网、电子邮件和文件传输等，成为我们网络通信的支柱。

通过TCP，我们能够有效地处理丢包重传、顺序交付、拥塞控制和数据完整性等问题。使用TCP协议的应用程序能够确保传输的数据接收顺序和内容的准确性，同时优化了网络通信的复杂性。然而，这在提升浏览器的Web性能时也带来了一些挑战。

HTTP标准并不将TCP作为唯一的传输协议选项，但实际上，现代互联网中几乎所有的HTTP流量依然通过TCP进行处理，归因于TCP所提供的便利和高效功能。

为了构建出优化的网页体验，了解TCP的一些基本机制显得尤为重要。虽然在应用层面上我们未必直接操作TCP套接字，但从设计上我们需要考虑的选择最终都会影响TCP的性能以及应用程序的网络交互。  

### TCP连接的建立流程

所有TCP连接都始于一个被称为**三次握手**的过程。在进行数据交流之前，客户端与服务器需要先就序列号以及其他连接变量达成共识。考虑到安全性，序列号的生成是随机的。

在这一过程中：

![image](/img/building-block-of-tcp/three-way-handshake.svg)

1. 客户端选择一个随机的序列号x，并发送一个SYN数据包，这个数据包还可能包括其它TCP标志和选项。
2. 服务器接收到后，增加序列号x并选择它自己的随机序列号y，然后附加相关标志并回应。
3. 客户端再次增加序列号并发送最后的确认包，完成握手。

一旦这三次握手完成，数据就可以开始在客户端与服务器之间流动。此时，客户端可以在确认包后立即发送数据，而服务器则需要等到收到确认后才可以发送数据。这个过程对每一个TCP连接产生的延迟是显著的，因为在新的TCP连接建立前必须经过这完整的往返延迟。

例如，如果客户端位于纽约，而服务器在伦敦，开启一个TCP连接的三次握手可能至少需要56毫秒的延迟。这种由连接建立带来的延迟，让新建的TCP连接代价高昂，这也是为什么连接重用对于在TCP下运行的任何应用程序来说都是至关重要的优化之一。

### 拥塞控制与避免机制

1984年，John Nagle提出了一种“拥塞崩溃”现象，指出在网络节点之间带宽不对称的情况下可能对网络造成的影响。拥塞问题在复杂网络中是一种普遍存在的现象，尤其是IP和TCP的结合使用中，可能导致数据包冲突与传输性能下降。

为了应对这一现象，TCP中引入了多种机制，如流量控制、拥塞控制与避免等。这些机制旨在合理调节数据双向发送的速率，从而确保网络在不同负载情况下的运行稳定和高效。

TCP中的流控制机制确保发送方不会向接收方发送超过其处理能力的数据，以避免数据“淹没”接收方的情况。连接过程中，每一端会告知对方自己的**接收窗口大小**（rwnd），以动态调整数据流。

### TCP流量控制与慢启动机制

尽管TCP内置了流量控制机制，网络拥塞在20世纪80年代后期仍呈现出问题。由于流量控制仅仅是限制了发送方与接收方之间的流量，没有考虑到网络的承载能力，这就引入了慢启动这一机制。

在新连接建立初期，TCP设定的**初始拥塞窗口**（cwnd）值较小，以便测量网络的实际传输能力。发送方会在每次确认接收到数据包后增加拥塞窗口的大小，直到达到网络的承载极限。

### 拥塞避免策略

TCP在设计中将丢包视为重要信号，代表网络出现了拥塞。在这种情况下，TCP的拥塞避免算法会调整拥塞窗口，限制数据流，避免造成更多丢包。因此，TCP实施的拥塞控制和避免机制相互配合，以确保网络在充分利用带宽的同时避免产生额外的负担。

最后，无论何时，TCP的性能调节机制在现代高速网络中，往往受到延迟的影响，由此理解这一过程对于优化网络应用的表现是至关重要的。

### 优化TCP性能的最佳实践

优化TCP性能是一个不断演变的过程，随着网络条件和应用需求的变化而变化。以下是一些提升TCP性能的策略：

- 定期升级服务器内核，以确保使用最新的TCP算法。
- 增加TCP的初始拥塞窗口，以便在连接初期就快速传输数据。
- 启用窗口缩放来增强远程连接的性能。
- 优化应用程序，尽可能减少不必要的数据传输，使用压缩技术降低数据量。

通过这些方法，可以显著提升应用程序的网络性能，从而确保用户享受到更快速、更流畅的上网体验。

## 总结
![image](/img/building-block-of-tcp/gitmind.png)