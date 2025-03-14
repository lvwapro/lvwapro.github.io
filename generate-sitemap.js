const fs = require('fs');
const path = require('path');

// 固定的URL列表
const staticUrls = [
    'https://lvwapro.github.io/about/',
    'https://lvwapro.github.io/archive/',
    'https://lvwapro.github.io/',
    'https://lvwapro.github.io/offline.html'
];

// 获取当前日期，格式化为YYYY-MM-DD
function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

// 递归读取目录下的所有markdown文件
function getAllFiles(dirPath) {
    let results = [];
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 如果是目录，则获取该目录下的所有md文件
            const mdFiles = fs.readdirSync(fullPath)
                .filter(file => file.endsWith('.md') || file.endsWith('.markdown'))
                .map(file => ({
                    category: item, // 使用目录名作为分类
                    filePath: path.join(fullPath, file)
                }));
            results = results.concat(mdFiles);
        }
    }

    return results;
}

// 读取_posts目录下的所有markdown文件
function getPostFiles() {
    const postsDir = path.join(process.cwd(), '_posts');
    try {
        return getAllFiles(postsDir);
    } catch (error) {
        console.error('Error reading _posts directory:', error);
        return [];
    }
}

// 从文件名生成URL
function getPostUrl(fileInfo) {
    const filename = path.basename(fileInfo.filePath);
    // 文件名格式: YYYY-MM-DD-title.md
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.*?)\.(md|markdown)$/);
    if (!match) return null;

    const [_, year, month, day, title] = match;
    // 移除title中的特殊字符，保留字母、数字和连字符
    const cleanTitle = title.toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return `https://lvwapro.github.io/${year}/${month}/${day}/${cleanTitle}/`;
}

// 生成sitemap XML内容
function generateSitemapXml() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // 添加静态URL
    staticUrls.forEach(url => {
        xml += `  <url>\n`;
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
    });

    // 添加博客文章URL
    const postFiles = getPostFiles();
    postFiles.forEach(fileInfo => {
        const postUrl = getPostUrl(fileInfo);
        if (postUrl) {
            xml += `  <url>\n`;
            xml += `    <loc>${postUrl}</loc>\n`;
            xml += `    <lastmod>${getCurrentDate()}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        }
    });

    xml += '</urlset>';
    return xml;
}

// 生成并保存sitemap.xml文件
function saveSitemap() {
    const sitemap = generateSitemapXml();
    const outputPath = path.join(process.cwd(), 'sitemap3.xml');
    
    try {
        fs.writeFileSync(outputPath, sitemap);
        console.log('Sitemap generated successfully at:', outputPath);
    } catch (error) {
        console.error('Error saving sitemap:', error);
    }
}

// 执行生成sitemap
saveSitemap();