// 邮件模板配置和生成函数

export interface EmailTemplateData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  locale: string;
  reservationId?: string;
  timestamp?: string;
}

// 邮件主题配置
export const EMAIL_SUBJECTS = {
  zh: {
    userConfirmation: 'TidyOtter - 预约确认',
    adminNotification: 'TidyOtter - 新的预约申请',
  },
  en: {
    userConfirmation: 'TidyOtter - Reservation Confirmation',
    adminNotification: 'TidyOtter - New Reservation Request',
  },
} as const;

// 生成用户确认邮件HTML
export function generateUserConfirmationEmail(data: EmailTemplateData): string {
  const { name, email, phone, message, locale, reservationId, timestamp } = data;
  const isZh = locale === 'zh';
  
  const content = {
    zh: {
      title: 'TidyOtter 预约确认',
      greeting: `亲爱的 ${name}，`,
      confirmation: '感谢您对 TidyOtter 的关注！我们已收到您的预约申请。',
      details: '您的预约详情：',
      emailLabel: '邮箱：',
      phoneLabel: '电话：',
      messageLabel: '留言：',
      nextSteps: '接下来的步骤：',
      step1: '我们的团队将在 24 小时内与您联系',
      step2: '我们会为您安排产品演示时间',
      step3: '您将收到详细的产品介绍和使用指南',
      aboutProduct: '关于 TidyOtter：',
      productDesc: 'TidyOtter 是一款智能桌面文件整理工具，帮助您自动分类和管理文件，提升工作效率。',
      features: '主要功能：',
      feature1: '🗂️ 智能文件分类',
      feature2: '🔍 快速文件搜索',
      feature3: '📊 文件使用统计',
      feature4: '🔄 自动备份同步',
      contact: '如有任何问题，请随时联系我们：',
      contactEmail: '邮箱：support@tidyotter.app',
      contactWebsite: '官网：https://tidyotter.app',
      thanks: '再次感谢您的关注！',
      team: 'TidyOtter 团队',
      footer: '此邮件由 TidyOtter 自动发送，请勿直接回复。',
    },
    en: {
      title: 'TidyOtter Reservation Confirmation',
      greeting: `Dear ${name},`,
      confirmation: 'Thank you for your interest in TidyOtter! We have received your reservation request.',
      details: 'Your reservation details:',
      emailLabel: 'Email:',
      phoneLabel: 'Phone:',
      messageLabel: 'Message:',
      nextSteps: 'Next steps:',
      step1: 'Our team will contact you within 24 hours',
      step2: 'We will schedule a product demonstration for you',
      step3: 'You will receive detailed product introduction and user guide',
      aboutProduct: 'About TidyOtter:',
      productDesc: 'TidyOtter is an intelligent desktop file organization tool that helps you automatically categorize and manage files, improving work efficiency.',
      features: 'Key features:',
      feature1: '🗂️ Smart file categorization',
      feature2: '🔍 Quick file search',
      feature3: '📊 File usage statistics',
      feature4: '🔄 Automatic backup sync',
      contact: 'If you have any questions, please feel free to contact us:',
      contactEmail: 'Email: support@tidyotter.app',
      contactWebsite: 'Website: https://tidyotter.app',
      thanks: 'Thank you again for your interest!',
      team: 'TidyOtter Team',
      footer: 'This email is automatically sent by TidyOtter, please do not reply directly.',
    },
  };
  
  const t = content[isZh ? 'zh' : 'en'];
  
  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 10px;
    }
    .title {
      font-size: 20px;
      color: #666;
    }
    .content {
      margin-bottom: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #333;
    }
    .details-box {
      background-color: #f8f9fa;
      border-left: 4px solid #1976d2;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .detail-item {
      margin-bottom: 10px;
    }
    .detail-label {
      font-weight: bold;
      color: #555;
    }
    .steps {
      background-color: #e3f2fd;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .step {
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;
    }
    .step::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #1976d2;
      font-weight: bold;
    }
    .features {
      margin: 20px 0;
    }
    .feature {
      margin-bottom: 8px;
      padding-left: 10px;
    }
    .contact-info {
      background-color: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #888;
    }
    .button {
      display: inline-block;
      background-color: #1976d2;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 0;
      font-weight: bold;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ffc107;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TidyOtter</div>
      <div class="title">${t.title}</div>
    </div>
    
    <div class="content">
      <div class="greeting">${t.greeting}</div>
      
      <p>${t.confirmation}</p>
      
      <div class="details-box">
        <h3>${t.details}</h3>
        <div class="detail-item">
          <span class="detail-label">${t.emailLabel}</span> ${email}
        </div>
        ${phone ? `<div class="detail-item"><span class="detail-label">${t.phoneLabel}</span> ${phone}</div>` : ''}
        ${message ? `<div class="detail-item"><span class="detail-label">${t.messageLabel}</span> ${message}</div>` : ''}
        ${reservationId ? `<div class="detail-item"><span class="detail-label">ID:</span> ${reservationId}</div>` : ''}
        ${timestamp ? `<div class="detail-item"><span class="detail-label">${isZh ? '时间：' : 'Time:'}</span> ${new Date(timestamp).toLocaleString(locale)}</div>` : ''}
      </div>
      
      <div class="steps">
        <h3>${t.nextSteps}</h3>
        <div class="step">${t.step1}</div>
        <div class="step">${t.step2}</div>
        <div class="step">${t.step3}</div>
      </div>
      
      <div class="highlight">
        <h3>${t.aboutProduct}</h3>
        <p>${t.productDesc}</p>
        
        <div class="features">
          <strong>${t.features}</strong>
          <div class="feature">${t.feature1}</div>
          <div class="feature">${t.feature2}</div>
          <div class="feature">${t.feature3}</div>
          <div class="feature">${t.feature4}</div>
        </div>
      </div>
      
      <div class="contact-info">
        <h3>${t.contact}</h3>
        <p>${t.contactEmail}</p>
        <p>${t.contactWebsite}</p>
      </div>
      
      <p>${t.thanks}</p>
      <p><strong>${t.team}</strong></p>
    </div>
    
    <div class="footer">
      <p>${t.footer}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 生成管理员通知邮件HTML
export function generateAdminNotificationEmail(data: EmailTemplateData): string {
  const { name, email, phone, message, locale, reservationId, timestamp } = data;
  const isZh = locale === 'zh';
  
  const content = {
    zh: {
      title: '新的预约申请',
      notification: '您收到了一个新的 TidyOtter 预约申请：',
      userInfo: '用户信息：',
      nameLabel: '姓名：',
      emailLabel: '邮箱：',
      phoneLabel: '电话：',
      messageLabel: '留言：',
      actions: '建议操作：',
      action1: '在 24 小时内联系用户',
      action2: '准备产品演示材料',
      action3: '记录用户需求和偏好',
      adminPanel: '管理面板',
      viewDetails: '查看详情',
    },
    en: {
      title: 'New Reservation Request',
      notification: 'You have received a new TidyOtter reservation request:',
      userInfo: 'User Information:',
      nameLabel: 'Name:',
      emailLabel: 'Email:',
      phoneLabel: 'Phone:',
      messageLabel: 'Message:',
      actions: 'Suggested Actions:',
      action1: 'Contact user within 24 hours',
      action2: 'Prepare product demonstration materials',
      action3: 'Record user requirements and preferences',
      adminPanel: 'Admin Panel',
      viewDetails: 'View Details',
    },
  };
  
  const t = content[isZh ? 'zh' : 'en'];
  
  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #d32f2f;
      margin-bottom: 10px;
    }
    .title {
      font-size: 20px;
      color: #666;
    }
    .alert {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      border-left: 4px solid #f39c12;
    }
    .user-info {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #d32f2f;
    }
    .info-item {
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .info-label {
      font-weight: bold;
      color: #495057;
      display: inline-block;
      width: 80px;
    }
    .info-value {
      color: #212529;
    }
    .actions {
      background-color: #e8f5e8;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .action-item {
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;
    }
    .action-item::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background-color: #d32f2f;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 10px 5px;
      font-weight: bold;
      text-align: center;
    }
    .metadata {
      background-color: #f1f3f4;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
      color: #5f6368;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TidyOtter Admin</div>
      <div class="title">${t.title}</div>
    </div>
    
    <div class="alert">
      <strong>🔔 ${t.notification}</strong>
    </div>
    
    <div class="user-info">
      <h3>${t.userInfo}</h3>
      <div class="info-item">
        <span class="info-label">${t.nameLabel}</span>
        <span class="info-value">${name}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.emailLabel}</span>
        <span class="info-value">${email}</span>
      </div>
      ${phone ? `
      <div class="info-item">
        <span class="info-label">${t.phoneLabel}</span>
        <span class="info-value">${phone}</span>
      </div>
      ` : ''}
      ${message ? `
      <div class="info-item">
        <span class="info-label">${t.messageLabel}</span>
        <span class="info-value">${message}</span>
      </div>
      ` : ''}
    </div>
    
    ${reservationId || timestamp ? `
    <div class="metadata">
      ${reservationId ? `<p><strong>ID:</strong> ${reservationId}</p>` : ''}
      ${timestamp ? `<p><strong>${isZh ? '时间：' : 'Time:'}</strong> ${new Date(timestamp).toLocaleString(locale)}</p>` : ''}
      <p><strong>${isZh ? '用户语言：' : 'User Language:'}</strong> ${locale}</p>
    </div>
    ` : ''}
    
    <div class="actions">
      <h3>${t.actions}</h3>
      <div class="action-item">${t.action1}</div>
      <div class="action-item">${t.action2}</div>
      <div class="action-item">${t.action3}</div>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="mailto:${email}" class="button">${isZh ? '回复邮件' : 'Reply Email'}</a>
      ${phone ? `<a href="tel:${phone}" class="button">${isZh ? '拨打电话' : 'Call Phone'}</a>` : ''}
    </div>
    
    <div class="footer">
      <p>TidyOtter Admin Notification System</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 生成纯文本版本的邮件（作为备选）
export function generatePlainTextEmail(data: EmailTemplateData, type: 'user' | 'admin'): string {
  const { name, email, phone, message, locale, reservationId, timestamp } = data;
  const isZh = locale === 'zh';
  
  if (type === 'user') {
    const greeting = isZh ? `亲爱的 ${name}，` : `Dear ${name},`;
    const confirmation = isZh 
      ? '感谢您对 TidyOtter 的关注！我们已收到您的预约申请。'
      : 'Thank you for your interest in TidyOtter! We have received your reservation request.';
    
    const details = isZh ? '您的预约详情：' : 'Your reservation details:';
    const emailLabel = isZh ? '邮箱：' : 'Email:';
    const phoneLabel = isZh ? '电话：' : 'Phone:';
    const messageLabel = isZh ? '留言：' : 'Message:';
    
    const nextSteps = isZh ? '接下来的步骤：' : 'Next steps:';
    const steps = isZh 
      ? ['我们的团队将在 24 小时内与您联系', '我们会为您安排产品演示时间', '您将收到详细的产品介绍和使用指南']
      : ['Our team will contact you within 24 hours', 'We will schedule a product demonstration for you', 'You will receive detailed product introduction and user guide'];
    
    const contact = isZh ? '如有任何问题，请随时联系我们：' : 'If you have any questions, please feel free to contact us:';
    const team = isZh ? 'TidyOtter 团队' : 'TidyOtter Team';
    
    return `
${greeting}

${confirmation}

${details}
${emailLabel} ${email}
${phone ? `${phoneLabel} ${phone}` : ''}
${message ? `${messageLabel} ${message}` : ''}
${reservationId ? `ID: ${reservationId}` : ''}
${timestamp ? `${isZh ? '时间：' : 'Time:'} ${new Date(timestamp).toLocaleString(locale)}` : ''}

${nextSteps}
${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${contact}
${isZh ? '邮箱：' : 'Email:'} support@tidyotter.app
${isZh ? '官网：' : 'Website:'} https://tidyotter.app

${isZh ? '再次感谢您的关注！' : 'Thank you again for your interest!'}

${team}
    `.trim();
  } else {
    const notification = isZh 
      ? '您收到了一个新的 TidyOtter 预约申请：'
      : 'You have received a new TidyOtter reservation request:';
    
    const userInfo = isZh ? '用户信息：' : 'User Information:';
    const nameLabel = isZh ? '姓名：' : 'Name:';
    const emailLabel = isZh ? '邮箱：' : 'Email:';
    const phoneLabel = isZh ? '电话：' : 'Phone:';
    const messageLabel = isZh ? '留言：' : 'Message:';
    
    return `
${notification}

${userInfo}
${nameLabel} ${name}
${emailLabel} ${email}
${phone ? `${phoneLabel} ${phone}` : ''}
${message ? `${messageLabel} ${message}` : ''}
${reservationId ? `ID: ${reservationId}` : ''}
${timestamp ? `${isZh ? '时间：' : 'Time:'} ${new Date(timestamp).toLocaleString(locale)}` : ''}
${isZh ? '用户语言：' : 'User Language:'} ${locale}

TidyOtter Admin Notification System
    `.trim();
  }
}