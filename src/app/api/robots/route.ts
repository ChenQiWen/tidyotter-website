import { NextResponse } from 'next/server';

// 生成robots.txt内容
function generateRobotsTxt(): string {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://filezen.app';
  const isProduction = process.env.NODE_ENV === 'production';
  
  let robotsTxt = '';
  
  if (isProduction) {
    // 生产环境 - 允许所有爬虫
    robotsTxt += `User-agent: *\n`;
    robotsTxt += `Allow: /\n`;
    robotsTxt += `\n`;
    
    // 禁止访问的路径
    const disallowedPaths = [
      '/api/',
      '/_next/',
      '/admin/',
      '/dashboard/',
      '/private/',
      '/*.json$',
      '/*.xml$',
      '/404',
      '/500',
    ];
    
    disallowedPaths.forEach(path => {
      robotsTxt += `Disallow: ${path}\n`;
    });
    
    robotsTxt += `\n`;
    
    // 特定爬虫规则
    robotsTxt += `# Google\n`;
    robotsTxt += `User-agent: Googlebot\n`;
    robotsTxt += `Allow: /\n`;
    robotsTxt += `\n`;
    
    robotsTxt += `# Bing\n`;
    robotsTxt += `User-agent: Bingbot\n`;
    robotsTxt += `Allow: /\n`;
    robotsTxt += `\n`;
    
    robotsTxt += `# Baidu\n`;
    robotsTxt += `User-agent: Baiduspider\n`;
    robotsTxt += `Allow: /\n`;
    robotsTxt += `\n`;
    
    // 限制某些爬虫的访问频率
    robotsTxt += `# Rate limiting for aggressive crawlers\n`;
    robotsTxt += `User-agent: AhrefsBot\n`;
    robotsTxt += `Crawl-delay: 10\n`;
    robotsTxt += `\n`;
    
    robotsTxt += `User-agent: SemrushBot\n`;
    robotsTxt += `Crawl-delay: 10\n`;
    robotsTxt += `\n`;
    
    robotsTxt += `User-agent: MJ12bot\n`;
    robotsTxt += `Crawl-delay: 10\n`;
    robotsTxt += `\n`;
    
    // 完全禁止某些爬虫
    const blockedBots = [
      'SiteAuditBot',
      'AhrefsBot',
      'MJ12bot',
      'DotBot',
      'AspiegelBot',
      'SurveyBot',
      'VoilaBot',
      'SlySearch',
      'BLEXBot',
    ];
    
    robotsTxt += `# Blocked bots\n`;
    blockedBots.forEach(bot => {
      robotsTxt += `User-agent: ${bot}\n`;
      robotsTxt += `Disallow: /\n`;
      robotsTxt += `\n`;
    });
    
  } else {
    // 开发/测试环境 - 禁止所有爬虫
    robotsTxt += `User-agent: *\n`;
    robotsTxt += `Disallow: /\n`;
    robotsTxt += `\n`;
    robotsTxt += `# Development environment - crawling disabled\n`;
  }
  
  // 添加sitemap链接
  robotsTxt += `# Sitemaps\n`;
  robotsTxt += `Sitemap: ${siteUrl}/sitemap.xml\n`;
  robotsTxt += `Sitemap: ${siteUrl}/api/sitemap\n`;
  robotsTxt += `\n`;
  
  // 添加额外信息
  robotsTxt += `# Additional information\n`;
  robotsTxt += `# Website: ${siteUrl}\n`;
  robotsTxt += `# Contact: support@filezen.app\n`;
  robotsTxt += `# Last updated: ${new Date().toISOString().split('T')[0]}\n`;
  
  return robotsTxt;
}

export async function GET() {
  try {
    const robotsTxt = generateRobotsTxt();
    
    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 缓存24小时
        'CDN-Cache-Control': 'public, max-age=604800', // CDN缓存7天
      },
    });
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

// 支持HEAD请求
export async function HEAD() {
  const response = await GET();
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}