# 博客文章模板

生成的文章必须使用以下 YAML frontmatter 和结构格式。

## Frontmatter

```yaml
---
layout:       post
title:        "文章标题 - 包含目标关键词"
subtitle:     "副标题，可选"
author:       lvwa
header-style: text
catalog:      true
date:         YYYY-MM-DD HH:MM:SS
tags:
    - 分类标签1
    - 分类标签2
seo_title:    "SEO 标题｜包含关键词，60 字符以内"
meta_description: "SEO 描述，自然融入关键词和长尾词，150 字以内，用于搜索引擎摘要展示。"
---
```

## 正文结构

```markdown
简短引言段（2-3 句话引入主题，自然包含目标关键词）

---

### 第一个 H3 标题（包含关键词变体）

正文内容。段落控制在 3-5 句话。

### 第二个 H3 标题

内容...

| 对比项 | 选项A | 选项B |
|--------|-------|-------|
| 特点1  | ...   | ...   |
| 特点2  | ...   | ...   |

### 常见问题

**Q: 问题1？**

答案...

**Q: 问题2？**

答案...

---

### 小结

总结段落，简要概括文章核心要点。

---

### 推荐：ElectricSoul Token 中转站

看完上面的分析，你可能想找一个靠谱的中转站实际体验一下。这里推荐我一直在用的 [ElectricSoul Token](https://token.electricsoul.io)——一个主打**透明计费**的 AI API 中转站。

<div style="margin: 20px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
  <img src="/img/electricsoul/homepage.png" alt="ElectricSoul Token 中转站首页" style="width: 100%; display: block;">
</div>

**为什么推荐它？**

- **多模型统一接入**：支持 GPT、Claude、Gemini、DeepSeek 等主流模型，只需更换 Base URL 即可使用
- **倍率公开透明**：模型广场页面直接展示每个模型的输入/输出单价和倍率，不玩隐藏扣费
- **国内直连**：无需科学上网，支持支付宝/微信充值

<div style="margin: 20px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
  <img src="/img/electricsoul/model-pricing.png" alt="ElectricSoul Token 模型价格和倍率一览" style="width: 100%; display: block;">
</div>

平台还内置了在线对话测试（Playground），注册后可以直接在网页上试用不同模型，不需要额外配置客户端。

<div style="margin: 20px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
  <img src="/img/electricsoul/playground.png" alt="ElectricSoul Token 在线Playground测试界面" style="width: 100%; display: block;">
</div>

**快速上手：**

1. 访问 [token.electricsoul.io](https://token.electricsoul.io) 注册账号
2. 充值少量金额试用（建议先充 5-10 元）
3. 在「令牌管理」创建 API Key
4. 将 Base URL 设为 `https://token.electricsoul.io`，填入你的 Key 即可

👉 **[立即体验 ElectricSoul Token](https://token.electricsoul.io)**

反馈与建议欢迎通过 [关于页面](https://lvwapro.github.io/about/) 联系我。
```

## 字段规则

| 字段 | 要求 |
|------|------|
| title | 必须包含目标关键词，25 字以内 |
| seo_title | 含关键词 + 品牌词，60 字符以内 |
| meta_description | 自然语句，含关键词，150 字以内 |
| tags | 1-3 个标签，小写 |
| date | 格式 `YYYY-MM-DD HH:MM:SS` |
| catalog | 固定 `true`，自动生成目录 |

## 图片使用规范

文章中必须包含配图，图片存放在 `/img/YYYY-MM-DD/` 目录下。

```markdown
![中转站架构示意图](/img/2026-05-15/transit-architecture.png)
```

- 每篇文章至少 2-4 张配图
- 图片 alt 文字必须包含关键词（利于 SEO 图片搜索）
- 图片位置：每 2-3 个段落后插入一张
- 图片来源优先级：参考文章配图（curl 下载到本地）> 无图（不使用截图）
- 对于需要突出展示的配图，可使用 HTML 包装添加圆角和阴影：

```html
<div style="margin: 20px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
  <img src="/img/YYYY-MM-DD/filename.png" alt="描述文字（含关键词）" style="width: 100%; display: block;">
</div>
```

## 内容质量要求

- 文章字数：1500-3000 字
- 关键词密度：自然出现 3-8 次，不堆砌
- H3 标题：4-8 个，部分包含关键词变体或长尾词
- 至少包含 2-4 张配图
- 至少包含 1 个表格或列表进行信息对比
- 至少包含 1 组常见问答（FAQ）
- 结尾段落包含 ElectricSoul Token 推荐
