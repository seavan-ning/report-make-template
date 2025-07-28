import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// PDF 生成选项接口
interface PdfGenerationOptions {
  url: string;
  filename?: string;
  format?: 'A4' | 'A3' | 'Letter';
  printBackground?: boolean;
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

// PDF 生成结果接口
interface PdfGenerationResult {
  success: boolean;
  filePath?: string;
  filename?: string;
  duration?: number;
  error?: string;
}

// 生成 PDF 的主函数
export async function generatePdf(options: PdfGenerationOptions): Promise<PdfGenerationResult> {
  const startTime = new Date();
  console.log(`PDF generation started at: ${startTime.toISOString()}`);
  console.log(`Target URL: ${options.url}`);

  let browser;
  try {
    // 启动浏览器时指定已安装的Chrome路径
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({ width: 1080, height: 1024 });

    // 导航到指定URL
    await page.goto(options.url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Navigated to URL: ', (new Date().getTime() - startTime.getTime()) / 1000);

    // 创建输出目录
    const outputDir = path.join(process.cwd(), 'public', 'generated-pdfs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成文件名
    const filename = options.filename || `pdf-${Date.now()}.pdf`;
    const filePath = path.join(outputDir, filename);

    // 生成PDF
    await page.pdf({
      path: filePath,
      format: options.format || 'A4',
      printBackground: options.printBackground !== false,
      margin: options.margin || {
        top: '1cm',
        bottom: '1cm',
        left: '1cm',
        right: '1cm',
      }
    });

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log(`PDF saved to ${filePath}`);
    console.log(`PDF generation completed at: ${endTime.toISOString()}`);
    console.log(`Total time taken: ${duration} seconds`);

    return {
      success: true,
      filePath,
      filename,
      duration
    };

  } catch (error) {
    console.error('PDF generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 保持原有的调试功能 - 直接执行脚本时使用
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const result = await generatePdf({
      url: 'http://127.0.0.1:5500/test.html',
      filename: 'test.pdf'
    });

    if (result.success) {
      console.log('Debug mode: PDF generated successfully');
    } else {
      console.error('Debug mode: PDF generation failed:', result.error);
    }
  })();
}