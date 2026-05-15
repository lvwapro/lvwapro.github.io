---
name: transit-article-writer
description: >-
  AI API 中转站内容获客专用工具。通过 Chrome DevTools MCP 从 keywordtool.io 抓取热门关键词，
  在 Google 搜索竞品文章，读取并改写为 SEO 优化的博客 Markdown 文章，文末推广自家中转站
  ElectricSoul Token (https://token.electricsoul.io)。当用户提到中转站文章、关键词研究、
  SEO 写文章、内容获客、写推广文章、keyword research、热门关键词、搜索热度、
  transit station、中转站推广 时触发。
---

# 中转站内容获客助手

从关键词调研到生成 SEO 博客文章的一站式工作流。专为 AI API 中转站获客场景设计，文章末尾统一推广 [ElectricSoul Token](https://token.electricsoul.io)。

## 自家中转站信息

- **名称**：ElectricSoul Token
- **链接**：https://token.electricsoul.io
- **定位**：稳定、透明、性价比高的 AI API 中转站
- **支持模型**：GPT、Claude、Gemini 等主流模型
- **特点**：倍率公开透明、计费清晰可查、响应速度快

所有生成的文章**结尾必须包含**对 ElectricSoul Token 的推荐段落（见模板）。

## 前置条件

- Cursor 中已配置 `chrome-devtools-mcp`（带 `--autoConnect` 参数）
- Chrome 开启远程调试（`chrome://inspect/#remote-debugging`）
- 用户已在 Chrome 中登录 keywordtool.io（如需查看搜索量数据）

## 工作流程

### 第一步：关键词调研

用户在 Chrome 中打开 keywordtool.io 的搜索结果页（或提供 URL）。

**读取关键词数据：**

1. `list_pages` → 查找 keywordtool.io 标签页
2. `select_page` → 选中该标签页
3. `evaluate_script` → 提取关键词列表：

```javascript
() => {
  const rows = document.querySelectorAll('table tbody tr, .keyword-list-item, [class*="keyword"]');
  const keywords = [];
  rows.forEach(row => {
    const text = row.innerText.trim();
    if (text) keywords.push(text);
  });
  if (keywords.length === 0) {
    return document.querySelector('.results, [class*="result"], main')?.innerText || '';
  }
  return keywords.join('\n');
}
```

4. 如果 `evaluate_script` 无法获取到关键词，使用 `take_snapshot` 获取完整页面文本
5. 整理并展示关键词列表，标注搜索量和竞争度（如有）

**输出给用户：** 将关键词按热度排序展示，请用户选择 1-3 个目标关键词进行下一步。

### 第二步：Google 搜索竞品文章

用户选择目标关键词后：

1. `navigate_page` → 导航到 Google 搜索：
   - URL 格式：`https://www.google.com/search?q={编码后的关键词}&hl=zh-CN`
2. 等待页面加载后 `take_snapshot` 获取搜索结果
3. `evaluate_script` → 提取排名靠前的文章：

```javascript
() => {
  const results = [];
  document.querySelectorAll('#search .g, [data-sokoban-container]').forEach((el, i) => {
    if (i >= 10) return;
    const titleEl = el.querySelector('h3');
    const linkEl = el.querySelector('a[href]');
    const descEl = el.querySelector('[data-sncf], .VwiC3b, [style*="-webkit-line-clamp"]');
    if (titleEl && linkEl) {
      results.push({
        rank: i + 1,
        title: titleEl.innerText,
        url: linkEl.href,
        description: descEl?.innerText || ''
      });
    }
  });
  return JSON.stringify(results, null, 2);
}
```

4. 展示搜索结果列表，请用户选择 2-3 篇想要参考的文章

### 第三步：提取参考文章（Readability + Markdown 转换）

参考 `ai-content-collection-0515` 插件的提取逻辑，使用 Readability 算法自动识别正文、去除噪声，并保留完整的 Markdown 格式（含图片、链接）。

对每篇选中的文章：

1. `navigate_page` → 打开文章 URL
2. 对于虚拟化渲染页面（如知乎），先滚动到底部加载完整内容：

```javascript
async () => {
  for (let i = 0; i < 10; i++) {
    window.scrollBy(0, window.innerHeight);
    await new Promise(r => setTimeout(r, 800));
  }
  return 'scrolled';
}
```

3. `evaluate_script` → 使用 Readability 风格逻辑提取正文并转换为 Markdown：

```javascript
() => {
  const doc = document.cloneNode(true);
  // 移除明显的非正文元素
  doc.querySelectorAll('nav, header, footer, aside, [class*="sidebar"], [class*="comment"], [class*="recommend"], [class*="related"], [class*="ad"], [class*="banner"], [role="navigation"], [role="complementary"]').forEach(el => el.remove());

  // 找到正文区域
  const selectors = ['article', '[class*="article"]', '.Post-RichTextContainer', '.RichText', '[class*="content"]', '.post-body', 'main', '[role="main"]'];
  let articleEl = null;
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    if (el && el.innerText.length > 300) { articleEl = el; break; }
  }
  if (!articleEl) articleEl = doc.body;

  // 递归将 HTML 转为 Markdown（保留图片、链接、格式）
  let md = '';
  const walk = (node) => {
    if (node.nodeType === 3) { md += node.textContent; return; }
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();

    if (tag === 'img') {
      const src = node.src || node.dataset.src || node.dataset.original || '';
      const alt = node.alt || '';
      if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon'))
        md += `\n![${alt}](${src})\n`;
      return;
    }
    if (tag === 'a') { md += `[${node.textContent.trim()}](${node.href || ''})`; return; }
    if (/^h[1-6]$/.test(tag)) { md += '\n' + '#'.repeat(parseInt(tag[1])) + ' '; }
    if (tag === 'br') { md += '\n'; return; }
    if (tag === 'p' || tag === 'div') md += '\n\n';
    if (tag === 'li') md += '\n- ';
    if (tag === 'strong' || tag === 'b') { md += '**'; Array.from(node.childNodes).forEach(walk); md += '**'; return; }
    if (tag === 'em' || tag === 'i') { md += '*'; Array.from(node.childNodes).forEach(walk); md += '*'; return; }
    if (tag === 'table') { md += '\n'; }
    Array.from(node.childNodes).forEach(walk);
  };
  Array.from(articleEl.childNodes).forEach(walk);

  // 清理格式 + 截断保护（单篇最多 8000 字符，避免上下文溢出）
  md = md.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').trim();
  if (md.length > 8000) md = md.substring(0, 8000) + '\n\n... (内容已截断)';

  // 单独收集图片列表（最多 10 张）
  const images = [];
  articleEl.querySelectorAll('img').forEach(img => {
    if (images.length >= 10) return;
    const src = img.src || img.dataset.src || '';
    if (src && !src.includes('avatar') && !src.includes('logo') && !src.includes('icon'))
      images.push({ src, alt: img.alt || '' });
  });

  return JSON.stringify({ title: document.title, markdown: md, images }, null, 2);
}
```

4. 如果 JS 提取失败，退回 `take_snapshot` 获取页面文本

**关键：提取结果是带格式的 Markdown**（含 `![alt](url)` 图片标记），不是纯文本。

**广告过滤已内置在提取逻辑中：**
- Readability 风格的选择器自动排除 nav/sidebar/comment/ad 等区域
- 图片过滤排除 avatar/logo/icon
- 改写阶段再做二次过滤：剔除竞品推广、联系方式引流、赞助内容

### 第三步（补充）：下载图片到本地

提取到的图片 URL 是外站链接，需要下载到本地避免防盗链和链接失效。

**保存目录：** `/img/YYYY-MM-DD/`（与文章日期一致）

**下载流程：**

1. 先创建目录：`mkdir -p img/YYYY-MM-DD`
2. 从提取结果的 `images` 列表中筛选有价值的图片（排除广告图/太小的图）
3. 使用 `curl` 下载每张图片：

```bash
curl -L -o img/YYYY-MM-DD/descriptive-name.png "https://外站图片URL" \
  -H "Referer: https://来源网站" \
  --connect-timeout 10
```

4. 文件命名规则：有意义的英文短横线名（如 `transit-architecture.png`、`token-billing-flow.png`）
5. 下载后在改写的 Markdown 中，**将外站 URL 替换为本地路径**：

```markdown
<!-- 替换前 -->
![架构图](https://pic1.zhimg.com/v2-xxx.jpg)

<!-- 替换后 -->
![中转站架构示意图](/img/2026-05-15/transit-architecture.png)
```

**下载失败的备选方案：**
- 外站有防盗链 → 尝试不带 Referer 或使用 `take_screenshot` 截图代替
- 图片已失效 → 跳过该图片
- 参考文章无合适配图 → 用 `take_screenshot` 截取参考页面的关键段落

**图片使用原则：**
- 每篇文章至少 2-4 张配图
- 图片 alt 文字必须改写为包含目标关键词的中文描述（利于 SEO）
- 图片间距合理，每 2-3 个段落后放一张
- 优先使用信息类图片（架构图 > 流程图 > 对比截图 > 装饰图）

### 第四步：改写生成博客文章

基于收集到的 Markdown 素材，**改写**为原创 SEO 博客文章。

**改写任务要求（参考 ai-content-collection 插件逻辑）：**

1. 分析提取的内容，识别核心信息，忽略无关部分
2. 生成的文章必须是中文
3. 内容不能太短，保留核心信息，**开头不要直接是 ## 或 ###**，先用 2-3 句话总结文章中心思想
4. 使用 Markdown 格式，确保结构清晰
5. **准确处理图片**：
   - 从参考文章中筛选与主题相关的图片
   - 保留原始 `![描述](URL)` 标记
   - 将图片插入到最合理、最符合上下文的位置
   - 图片 alt 文字改写为包含目标关键词的描述
   - 图片之间保持适当间距，不要连续放多张
6. **去除所有竞品广告和推广内容**
7. 融合多篇参考文章的观点，形成更全面的内容
8. 标题包含目标关键词，自然嵌入长尾词
9. 段落简短（3-5 句），便于移动端阅读
10. 至少包含 1 个表格或列表做信息对比
11. 至少包含 1 组常见问答（FAQ）
12. **结尾必须推广 ElectricSoul Token**

**不要做的事：**
- 不要使用一级标题（#），因为已有 frontmatter title
- 二级标题不要和 title 重复
- 不要保留竞品的推广链接和购买引导
- 不要堆砌关键词

**文章格式：** 严格使用 [post-template.md](post-template.md) 中的 YAML frontmatter 和结构。

关键 frontmatter 字段说明：
- `layout`: 固定为 `post`
- `title`: 包含目标关键词，25 字以内
- `subtitle`: 补充说明，可选
- `author`: 固定为 `lvwa`
- `header-style`: 固定为 `text`
- `catalog`: 固定为 `true`
- `date`: 当天日期 `YYYY-MM-DD HH:MM:SS`
- `tags`: 文章分类标签（数组格式，统一使用 `transit` 单标签）
- `seo_title`: SEO 标题，含关键词，60 字符以内
- `meta_description`: SEO 描述（50-200 字符），含关键词

### 第五步：保存文章

保存位置：`_posts/{category}/YYYY-MM-DD-{slug}.md`

- `{category}`：文章分类目录名（如 `transit`、`vpn`、`app` 等），如目录不存在则创建
- `{slug}`：**英文单词**短横线连接的文件名（禁止使用中文拼音），基于文章主题
- `{YYYY-MM-DD}`：当天日期

如果目录不存在，先创建：
```bash
mkdir -p _posts/{category}
```

### 第六步：确认与优化

保存后：
1. 展示文件路径和文章标题
2. 列出文章中嵌入的关键词
3. 询问是否需要调整内容、标题或 SEO 元数据
4. 询问是否继续写下一篇（用另一个关键词）

## 关键词选择策略

优先选择以下类型的关键词：
- **长尾关键词**：搜索量适中但竞争较低（如"中转站推荐2026"而非"中转站"）
- **问题类关键词**：以"怎么"、"如何"、"什么"开头的搜索词
- **对比类关键词**：如"A vs B"、"A 和 B 的区别"
- **教程类关键词**：如"XX 使用教程"、"XX 新手指南"

## 异常处理

- **keywordtool.io 未登录**：提示用户先登录，或直接让用户手动提供关键词列表
- **Google 搜索被限制**：换用其他搜索引擎 URL，或请用户手动提供参考文章 URL
- **文章内容被付费墙/登录墙挡住**：跳过该文章，使用其他参考来源
- **MCP 连接失败**：引导用户检查 Chrome 远程调试设置
- **页面加载超时**：在 `navigate_page` 中设置 `timeout` 参数，或手动重试

## 灵活模式

用户不一定要从第一步开始。Skill 支持从任意步骤切入：

- **只提供关键词**：跳过第一步，直接从第二步 Google 搜索开始
- **只提供参考文章 URL**：跳过一二步，直接从第三步读取内容开始
- **只提供主题描述**：跳过调研环节，直接基于 AI 知识生成文章（第四步）
- **已在 Chrome 打开 keywordtool.io**：从第一步的读取环节开始
