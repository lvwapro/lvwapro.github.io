---
title: Telegram 机器人创建与使用指南
date: 2025-07-29
description: 本文详细介绍了如何在Telegram中创建自己的机器人，包括申请流程、将机器人添加到群组、获取群组chat_id以及发送消息等步骤。此外，还讲解了Telegram中的各种对象和方法。
author: "lvwa"
header-style: text
catalog:      true
layout:       post
tags: telegram
---

>TG群聊推荐：[SOSO搜搜🔍中文搜索](https://t.me/lvwapro)

本文旨在帮助开发者了解如何在Telegram中创建并管理自己的机器人，包括从申请到使用的全过程。我们将一步步介绍如何通过BotFather创建一个新机器人，如何将其添加到特定的群组，并且获取该群组的chat_id以便于后续的消息发送。此外，还将简要说明Telegram的一些核心概念如Update对象及其相关属性。

## 创建机器人

在Telegram中，我们可以通过与名为BotFather的官方机器人交互来申请属于自己的机器人。以下是具体步骤：

1. **添加BotFather为好友**  
   点击[这里](https://t.me/BotFather)添加BotFather。

2. **打开与BotFather的对话框并发送 /newbot 命令**  
   这一步之后，BotFather会要求你输入想要创建的机器人的名字。这个名字可以自由选择，用于称呼你的机器人。

3. **设置自定义机器人的用户名**  
   请注意，这个用户名必须是唯一的，并以_bot或Bot结尾，不能包含中文或标点符号。

4. **获取Token**  
   如果上一步执行成功，BotFather会返回一个token给用户。这个token非常重要，请务必保存好，因为它是后续操作的基础。

## 将机器人添加到群组里

为了使机器人能够在某个特定的群组内工作，首先需要将其加入到那个群组。进入机器人信息页面，点击“更多”，然后选择“添加到群组”，最后选择一个目标群组即可。

## 获取群组chat_id

通常情况下，我们需要让机器人在一个指定的群组内工作。为此，首先需要将机器人添加至该群组，然后在群组中任意发送一条消息并@你的机器人（例如`hello @your_bot`）。接着，在浏览器中打开以下链接（记得替换为你的token）：  
`https://api.telegram.org/bot<token>/getUpdates`

你将会看到一个JSON格式的响应，其中包含了当前群组的id。找到`chat.id`字段，这就是你需要的群组ID，以后发送消息时都会用到它。

## 机器人发送请求

### 请求接口

向Telegram发送消息的方式类似于钉钉机器人，都是向一个API发送HTTP请求。对于同一个API，Telegram支持GET和POST两种请求方式。请求的基本格式如下：
```
https://api.telegram.org/bot<token>/<method>
```
其中，`<token>`是你的机器人token，而`<method>`则是Telegram提供的方法名之一。

### 携带参数

请求API时，有些方法可能需要携带额外参数。Telegram支持四种传参方式/类型：URL查询参数、application/x-www-form-urlencoded、application/json 以及 multipart/form-data (用于上传文件)。

### 获取响应

每次请求后，Telegram都会返回一个JSON格式的响应，其结构如下所示：
```json
{
  "ok": true,
  "result": ...
}
```
其中，`result`字段可以是Telegram定义的一个或多个对象。

## Telegram对象

Telegram中的大部分操作都是基于各种预定义的对象完成的。这些对象包括但不限于Update、User、Chat 和 Message等。接下来，我们将逐一介绍这些对象及其主要字段。

### Update

该对象表示接收到的新更新，比如新消息或编辑过的消息。它的主要字段有：

- `update_id`: 更新的唯一标识符。
- `message`, `edited_message`, `channel_post`, `edited_channel_post`: 各种形式的新消息。
- `inline_query`, `chosen_inline_result`, `callback_query`, `shipping_query`, `pre_checkout_query`, `poll`, `poll_answer`: 不同类型的更新事件。

### User

此对象表示Telegram上的一个用户或机器人。关键字段包括：

- `id`: 用户或机器人的唯一标识。
- `is_bot`: 判断是否为机器人。
- `first_name`, `last_name`, `username`: 用户的名字、姓氏及用户名。
- 其他一些可选字段，如语言偏好、是否能加入群聊等。

### Chat

代表一个聊天会话的信息。重要的字段有：

- `id`: 聊天的唯一ID。
- `type`: 聊天类型，可能是私聊、群聊、超级群聊或者频道。
- `title`, `username`, `first_name`, `last_name`: 根据聊天类型不同，这些字段可能可用也可能不可用。

### Message

表示一条消息。主要内容包括：

- `message_id`: 消息在当前聊天中的唯一ID。
- `from`: 发送者信息。
- `date`: 发送时间。
- `chat`: 消息所属的聊天。
- 以及其他多种类型的消息内容，如文本、图片、视频等。

以上就是关于如何创建Telegram机器人以及基本操作的介绍。希望对你有所帮助！