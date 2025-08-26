import { NextResponse } from 'next/server';

// 站点地图配置
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tidyotter.app';
const SUPPORTED_LOCALES = ['zh', 'en'];

// 页面配置
const pages = [
  {
    path: '',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/features',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/download',
    priority: 0.9,
    changefreq: 'weekly',
  },
  {
    path: '/pricing',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/privacy',
    priority: 0.5,
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    priority: 0.5,
    changefreq: 'yearly',
  },
];

// 生成XML sitemap
function generateSitemap(): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  
  // 为每个页面和每种语言生成URL
  pages.forEach(page => {
    SUPPORTED_LOCALES.forEach(locale => {
      const url = `${SITE_URL}/${locale}${page.path}`;
      
      xml += `  <url>
`;
      xml += `    <loc>${url}</loc>
`;
      xml += `    <lastmod>${currentDate}</lastmod>
`;
      xml += `    <changefreq>${page.changefreq}</changefreq>
`;
      xml += `    <priority>${page.priority}</priority>
`;
      
      // 添加多语言链接
      SUPPORTED_LOCALES.forEach(altLocale => {
        const altUrl = `${SITE_URL}/${altLocale}${page.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />
`;
      });
      
      xml += `  </url>
`;
    });
  });
  
  // 添加API端点（如果需要被索引）
  const apiEndpoints = [
    {
      path: '/api/reservation',
      priority: 0.3,
      changefreq: 'never',
    },
  ];
  
  apiEndpoints.forEach(endpoint => {
    xml += `  <url>
`;
    xml += `    <loc>${SITE_URL}${endpoint.path}</loc>
`;
    xml += `    <lastmod>${currentDate}</lastmod>
`;
    xml += `    <changefreq>${endpoint.changefreq}</changefreq>
`;
    xml += `    <priority>${endpoint.priority}</priority>
`;
    xml += `  </url>
`;
  });
  
  xml += `</urlset>`;
  
  return xml;
}

// 生成sitemap index（如果有多个sitemap文件）
function generateSitemapIndex(): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // 主站点地图
  xml += `  <sitemap>
`;
  xml += `    <loc>${SITE_URL}/api/sitemap</loc>
`;
  xml += `    <lastmod>${currentDate}</lastmod>
`;
  xml += `  </sitemap>
`;
  
  // 如果有博客或其他内容，可以添加额外的sitemap
  // xml += '  <sitemap>';
  // xml += '    <loc>' + SITE_URL + '/api/sitemap/blog</loc>';
  // xml += '    <lastmod>' + currentDate + '</lastmod>';
  // xml += '  </sitemap>';
  
  xml += `</sitemapindex>`;
  
  return xml;
}

export async function GET() {
  try {
    // 直接生成主 sitemap，不使用动态参数
    const xmlContent = generateSitemap();
    
    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 缓存1小时
        'CDN-Cache-Control': 'public, max-age=86400', // CDN缓存24小时
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
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